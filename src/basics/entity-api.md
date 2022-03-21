---
meta:
  - name: og:title
    content: 'DAOインタフェース'
  - name: og:url
    content: '/uroborosql-doc/basics/entity-api.html'
---
# DAOインタフェース

**uroboroSQL**はDAO(Data Access Object)を用いた単一テーブルへのCRUDに対応しています。

下記のテーブルとそれに対応するエンティティクラスを例として説明します。

```sql
-- MySQLの場合
create table employee (
  emp_no number(6) not null auto_increment
  , first_name varchar(20) not null
  , last_name varchar(20) not null
  , birth_date date not null
  , gender char(1) not null
  , lock_version number(10) not null
  , constraint employee_PKC primary key (emp_no)
)

-- Postgresqlの場合
create table employee (
  emp_no serial not null
  , first_name varchar(20) not null
  , last_name varchar(20) not null
  , birth_date date not null
  , gender char(1) not null
  , lock_version number(10) not null
  , constraint employee_PKC primary key (emp_no)
) ;
```

```java
public class Employee {
  private long empNo;
  private String firstName;
  private String lastName;
  private LocalDate birthDate;
  private Gender gender;
  private long lockVersion = 0;

  // 中略 getter/setter
}
```

## エンティティクラスの検索

### キーを指定した１件取得(`SqlAgent#find`)

| メソッド名                               | 戻り値の型        |
| :--------------------------------------- | :---------------- |
| SqlAgent#find(Class&lt;E&gt;, Object...) | Optional&lt;E&gt; |

主キーを指定してエンティティを取得します。PKカラムの数と引数に指定するキーの数は合わせる必要があります。

```java
// emp_no = 1 のレコードをエンティティとして取得
Optional<Employee> employee = agent.find(Employee.class, 1);
```

### 条件指定検索(`SqlAgent#query`) <Badge text="0.11.0+"/>

| メソッド名                     | 戻り値の型              |
| :----------------------------- | :---------------------- |
| SqlAgent#query(Class&lt;E&gt;) | SqlEntityQuery&lt;E&gt; |

エンティティクラスを利用した検索を行うためのオブジェクト（`SqlEntityQuery`)を取得します。  
`SqlEntityQuery`に対して抽出条件の指定を行い、抽出条件に該当するエンティティを取得します。

---

### 抽出条件の指定(`SqlEntityQuery#equal` /`#notEqual` /`#greaterThan` /`#lessThan` /`#greaterEqual` /`#lessEqual` /`#in` /`#notIn` /`#like` /`#startsWith` /`#endsWith` /`#contains` /`#notLike` /`#notStartsWith` /`#notEndsWith` /`#notContains` /`#between` /`#isNull` /`#isNotNull` /`#where`)

| 抽出条件指定メソッド記述例                                                  | 生成されるwhere句の条件式                | 補足説明                                                       |
| :-------------------------------------------------------------------------- | :--------------------------------------- | :------------------------------------------------------------- |
| equal("col", "value")                                                       | col = 'value'                            |                                                                |
| notEqual("col", "value")                                                    | col != 'value'                           |                                                                |
| greaterThan("col", 1)                                                       | col > 1                                  |                                                                |
| lessThan("col", 1)                                                          | col < 1                                  |                                                                |
| greaterEqual("col", 1)                                                      | col >= 1                                 |                                                                |
| lessEqual("col", 1)                                                         | col <= 1                                 |                                                                |
| in("col", "val1", "val2")                                                   | col in ('val1', 'val2')                  |                                                                |
| in("col", List.of("val1", "val2"))                                          | col in ('val1', 'val2')                  |                                                                |
| notIn("col", "val1", "val2")                                                | col not in ('val1', 'val2')              |                                                                |
| notIn("col", List.of("val1", "val2"))                                       | col not in ('val1', 'val2')              |                                                                |
| like("col", "%val%")                                                        | like '%val%'                             | `val`はエスケープされない                                      |
| startsWith("col", "val")                                                    | like 'val%'                              | `val`はエスケープされる                                        |
| endsWith("col", "val")                                                      | like '%val'                              | `val`はエスケープされる                                        |
| contains("col", "val")                                                      | like '%val%'                             | `val`はエスケープされる                                        |
| notLike("col", "%val%")                                                     | not like '%val%'                         | `val`はエスケープされない                                      |
| notStartsWith("col", "val")                                                 | not like 'val%'                          | `val`はエスケープされる                                        |
| notEndsWith("col", "val")                                                   | not like '%val'                          | `val`はエスケープされる                                        |
| notContains("col", "val")                                                   | not like '%val%'                         | `val`はエスケープされる                                        |
| between("col", 1, 2)                                                        | col between 1 and 2                      |                                                                |
| isNull("col")                                                               | col is null                              |                                                                |
| isNotNull("col")                                                            | col is not null                          |                                                                |
| where("col = 1 or col = 2")                                                 | (col = 1 or col = 2)                     | もし複数回`where()`が呼び出された場合は条件を `AND` で結合する |
| where("col = /\*col1\*/", "col1", 1)                                        | (col = 1/\*col1\*/)                      | パラメータの指定（1件）付き                                    |
| where("col = /\*col1\*/ or col = /\*col2\*/", Map.of("col1", 1, "col2", 2)) | (col = 1/\*col1\*/ or col = 2/\*col2\*/) | パラメータの指定（複数件）付き                                 |

```java
// emp_no = 1 のレコードをList<Employee>で取得
agent.query(Employee.class).equal("emp_no", 1).collect();

// emp_no = 10 又は 20 のレコードをList<Employee>で取得
agent.query(Employee.class).in("emp_no", 10, 20).collect();

// first_name like '%Bob%' のレコードをList<Employee>で取得
agent.query(Employee.class).contains("first_name", "Bob").collect();

// where句を直接記述(first_name = 'Bob' and last_name = 'Smith')した結果をList<Employee>で取得
agent.query(Employee.class).where("first_name =''/*firstName*/", "firstName", "Bob").where("last_name = ''/*lastName*/", "lastName", "Smith").collect();
```

::: danger 注意
`SqlEntityQuery`に対して抽出条件を指定する場合`param`メソッドは使用しないでください。
`SqlEntityQuery#param()`には`@Deprecated`が付与されており、将来削除される予定です。
:::

### ソート順(`SqlEntityQuery#asc` /`#desc`)や取得データの件数(`#limit`)、開始位置(`#offset`)、悲観ロック(`#forUpdate` /`#forUpdateNoWait` /`#forUpdateWait`)の指定 <Badge text="0.11.0+"/>

`SqlEntityQuery`では抽出条件に加えて検索結果のソート順や取得件数の制限、開始位置の指定、明示的なロック指定が行えます。

| 条件指定メソッド記述例                                     | 生成されるSQL                  | 補足説明                                                                                            |
| :--------------------------------------------------------- | :----------------------------- | :-------------------------------------------------------------------------------------------------- |
| asc("col1", "col2")                                        | order by col1 asc, col2 asc    | `NULLS`が有効な場合は`NULLS LAST`が出力される                                                       |
| asc("col1", Nulls.FIRST)                                   | order by col1 asc NULLS FIRST  | 複数回`asc()`が呼び出された場合は呼び出し順に並べる                                                 |
| desc("col1", "col2")                                       | order by col1 desc, col2 desc  | `NULLS`が有効な場合は`NULLS LAST`が出力される                                                       |
| desc("col1", Nulls.FIRST)                                  | order by col1 desc NULLS FIRST | 複数回`asc()`が呼び出された場合は呼び出し順に並べる                                                 |
| limit(10)                                                  | LIMIT 10                       | 接続しているDBで`limit`句が使用できない場合は`UroborosqlRuntimeException`がスローされる             |
| offset(10)                                                 | OFFSET 10                      | 接続しているDBで`offset`句が使用できない場合は`UroborosqlRuntimeException`がスローされる            |
| forUpdate()<Badge text="0.14.0+" vertical="middle"/>       | FOR UPDATE                     | 接続しているDBで`FOR UPDATE`句が使用できない場合は`UroborosqlRuntimeException`がスローされる        |
| forUpdateNoWait()<Badge text="0.14.0+" vertical="middle"/> | FOR UPDATE NOWAIT              | 接続しているDBで`FOR UPDATE NOWAIT`句が使用できない場合は`UroborosqlRuntimeException`がスローされる |
| forUpdateWait()<Badge text="0.14.0+" vertical="middle"/>   | FOR UPDATE WAIT 10             | 接続しているDBで`FOR UPDATE WAIT`句が使用できない場合は`UroborosqlRuntimeException`がスローされる   |
| forUpdateWait(30)<Badge text="0.14.0+" vertical="middle"/> | FOR UPDATE WAIT 30             | 接続しているDBで`FOR UPDATE WAIT`句が使用できない場合は`UroborosqlRuntimeException`がスローされる   |

```java
// birth_dateの降順、first_nameの昇順でソートした結果を List<Employee>で取得
agent.query(Employee.class).desc("birth_date").asc("first_name").collect();

// emp_no の昇順でソートした結果の3行目から5件取得
agent.query(Employee.class).asc("emp_no").offset(3).limit(5).collect();

// 明示的な行ロックを行う
agent.query(Employee.class).forUpdate().collect();
```

### オプティマイザーヒントの指定(`SqlEntityQuery#hint`) <Badge text="0.18.0+"/>

`SqlEntityQuery#hint()`を使用することで、SQLに対してオプティマイザーヒントを指定することができます。

```java
SqlAgent agent = ...
agent.query(User.class).hint("ORDERED").lessThan("age", 30).collect();
```

出力されるSQL(Oracleの場合)

```sql
select /*+ ORDERED */ id, name, age, ... from user where age < 30
```

::: warning 注意
オプティマイザーヒントの指定は、利用するDBがオプティマイザーヒントをサポートしている場合に有効になります。  
また、指定可能なヒント句は利用するDBに依存します。
:::

### 検索結果の取得(`SqlEntityQury#collect` /`#first` /`#one` /`#select` /`#stream`)

`SqlEntityQuery`から抽出条件に該当するエンティティを取得します。

| メソッド                                                                        | 説明                                                                                    |
| :------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------- |
| collect()                                                                       | 検索結果をエンティティのリストとして取得する                                            |
| first()                                                                         | 検索結果の先頭行を取得する                                                              |
| one()                                                                           | 検索結果の先頭行を取得する。検索結果が2件以上の場合`DataNonUniqueException`をスローする |
| Stream&lt;C&gt; select(String col, Class&lt;C&gt; type) <Badge text="0.18.0+"/> | 検索結果の指定したカラムの値を`java.util.stream.Stream`として取得する。                 |
| stream()                                                                        | 検索結果を`java.util.stream.Stream`として取得する                                       |

```java
// List<Employee>で取得
List<Enployee> employees = agent.query(Employee.class).collect();

// 検索結果の先頭行を取得
Optional<Enployee> employee = agent.query(Employee.class).first();

// 検索結果（カラム値）の取得
String employeeName = agent.query(Employee.class)
    .equal("employeeId", 1)
    .select("employeeName", String.class).findFirst().get();
```

### 集約関数(`SqlEntityQuery#count` /`#sum` /`#sum` /`#min` /`#max` /`#exists` /`#notExists`) <Badge text="0.12.0+"/>

`SqlEntityQuery`ではエンティティを取得する他に結果の集計を行うこともできます。

| メソッド                     | 説明                                                               |
| :--------------------------- | :----------------------------------------------------------------- |
| count()                      | 検索結果の件数を取得する                                           |
| count(String col)            | 検索結果のうち、引数で指定したカラムがNULLでない行の件数を取得する |
| sum(String col)              | 検索結果のうち、引数で指定したカラムの合計値を取得する             |
| min(String col)              | 検索結果のうち、引数で指定したカラムの最小値を取得する             |
| max(String col)              | 検索結果のうち、引数で指定したカラムの最大値を取得する             |
| exists(Runnable runnable)    | 検索結果が1件以上ある場合に引数で渡した関数を実行する              |
| notExists(Runnable runnable) | 検索結果が0件の場合に引数で渡した関数を実行する                    |

```java
// 検索結果の件数を取得
long count = agent.query(Employee.class).count();

// 検索結果が1件以上の場合にログを出力する
agent.query(Employee.class).greaterThan("emp_no", 10).exists(() -> {
  log.info("Employee(emp_no > 10) exists.");
});
```

::: tip
集約関数を使用すると、検索結果からEntityオブジェクトを生成しないためメモリ効率が良くなります。
以下２つの処理結果は同じですが、メモリの使い方が違います。

```java
// collect()を使用すると、検索結果がエンティティに変換されるためメモリを使用する
long count = agent.query(Employee.class).collect().size();

// count()を使用すると件数のみ取得できる（エンティティは生成されない）
long count = agent.query(Employee.class).count();
```

:::

## エンティティの挿入

### 1件の挿入(`SqlAgent#insert`/`#insertAndReturn`)

| メソッド名                                                    | 戻り値の型 |
| :------------------------------------------------------------ | :--------- |
| &lt;E&gt; SqlAgent#insert(E)                                  | int        |
| &lt;E&gt; SqlAgent#insertAndReturn(E) <Badge text="0.15.0+"/> | E          |

エンティティクラスのインスタンスを使って１レコードの挿入を行います。  

* [@Id](#id-generatedvalue-sequencegenerator)アノテーションの指定があるフィールド
* 対するカラムが自動採番となっているフィールド

の型がprimitive型の場合、もしくはフィールドの値が`null`の場合、カラムの値は挿入時に自動採番されます。  
また、挿入により採番された値がエンティティの該当フィールドにも設定されます。  
フィールドに値を指定した場合は自動採番カラムであっても指定した値が挿入されます。  

`AndReturn`が付くメソッドでは、挿入したエンティティオブジェクトを戻り値として取得できるため、
エンティティの挿入に続けて処理を行う場合に便利です。

```java
Employee employee = new Employee();
employee.setFirstName("Susan");
employee.setLastName("Davis");
employee.setBirthDate(LocalDate.of(1969, 2, 10));
employee.setGender(Gender.FEMALE); // MALE("M"), FEMALE("F"), OTHER("O")

// 1件の挿入
agent.insert(employee);
System.out.println(employee.getEmpNo()); // 自動採番された値が出力される
```

### 複数件の挿入(`SqlAgent#inserts` /`#insertsAndReturn`) <Badge text="0.10.0+"/>

| メソッド名                                                                                                                   | 戻り値の型      |
| :--------------------------------------------------------------------------------------------------------------------------- | :-------------- |
| SqlAgent#inserts(Stream&lt;E&gt;)                                                                                            | int             |
| SqlAgent#inserts(Stream&lt;E&gt;, InsertsType)                                                                               | int             |
| SqlAgent#inserts(Stream&lt;E&gt;, InsertsCondition<? super E>)                                                               | int             |
| SqlAgent#inserts(Stream&lt;E&gt;, InsertsCondition<? super E>, InsertsType)                                                  | int             |
| SqlAgent#insertsAndReturn(Stream&lt;E&gt;) <Badge text="0.15.0+"/>                                                           | Stream&lt;E&gt; |
| SqlAgent#insertsAndReturn(Stream&lt;E&gt;, InsertsType) <Badge text="0.15.0+"/>                                              | Stream&lt;E&gt; |
| SqlAgent#insertsAndReturn(Stream&lt;E&gt;, InsertsCondition<? super E>) <Badge text="0.15.0+"/>                              | Stream&lt;E&gt; |
| SqlAgent#insertsAndReturn(Stream&lt;E&gt;, InsertsCondition<? super E>, InsertsType) <Badge text="0.15.0+"/>                 | Stream&lt;E&gt; |
| SqlAgent#inserts(Class&lt;E&gt;, Stream&lt;E&gt;)                                                                            | int             |
| SqlAgent#inserts(Class&lt;E&gt;, Stream&lt;E&gt;, InsertsType)                                                               | int             |
| SqlAgent#inserts(Class&lt;E&gt;, Stream&lt;E&gt;, InsertsCondition<? super E>)                                               | int             |
| SqlAgent#inserts(Class&lt;E&gt;, Stream&lt;E&gt;, InsertsCondition<? super E>, InsertsType)                                  | int             |
| SqlAgent#insertsAndReturn(Class&lt;E&gt;, Stream&lt;E&gt;) <Badge text="0.15.0+"/>                                           | Stream&lt;E&gt; |
| SqlAgent#insertsAndReturn(Class&lt;E&gt;, Stream&lt;E&gt;, InsertsType) <Badge text="0.15.0+"/>                              | Stream&lt;E&gt; |
| SqlAgent#insertsAndReturn(Class&lt;E&gt;, Stream&lt;E&gt;, InsertsCondition<? super E>) <Badge text="0.15.0+"/>              | Stream&lt;E&gt; |
| SqlAgent#insertsAndReturn(Class&lt;E&gt;, Stream&lt;E&gt;, InsertsCondition<? super E>, InsertsType) <Badge text="0.15.0+"/> | Stream&lt;E&gt; |

`java.util.stream.Stream`経由で渡される複数のエンティティインスタンスを挿入します。


* [@Id](#id-generatedvalue-sequencegenerator)アノテーションの指定があるフィールド
* 対するカラムが自動採番となっているフィールド

の型がprimitive型の場合、もしくはフィールドの値が`null`の場合、カラムの値は挿入時に自動採番されます。  
また、挿入により採番された値がエンティティの該当フィールドにも設定されます。  
フィールドに値を指定した場合は自動採番カラムであっても指定した値が挿入されます。  

::: warning 注意
複数件の挿入で生成されるSQLでは、行毎のフィールドの値の有無を変更することができません。  
最初に挿入するエンティティで`@Id`の指定があるフィールドや自動採番カラムに対するフィールドに値を設定する場合は、
2件目以降のエンティティにも必ず値を設定するようにしてください。  
また、最初に挿入するエンティティで`@Id`の指定があるフィールドや自動採番カラムに対するフィールドの値に`null`を設定する場合は、
2件目以降のエンティティで値を設定していても無視されて自動採番されます。  
:::

`AndReturn`が付くメソッドでは、挿入したエンティティオブジェクトの`java.util.stream.Stream`を戻り値として取得できるため、 
エンティティの挿入に続けて処理を行う場合に便利です。

::: warning 注意
`AndReturn`の戻り値となる`Stream<E>`を生成する際、挿入したエンティティを全件メモリ上に保持します。
大量データの挿入を行うとOOMEが発生する場合があるので、`insertsAndReturn`を使用する場合は挿入する
データの件数に気をつけてください。件数が多い場合は一度`inserts`で挿入した後に、再度検索するといった方法を検討してください。
:::

```java
// 1件の挿入
Department dept = new Department();
dept.setDeptName("sales");
agent.insert(dept);

// 複数件の挿入(EmployeeとDeptEmpの挿入)
agent.inserts(agent.insertsAndReturn(agent.query(Employee.class).stream())
  .map(e -> {
    DepEmp deptEmp = new DeptEmp();
    deptEmp.setEmpNo(e.getEmpNo());
    deptEmp.setDepNo(dept.getDepNo());
    return deptEmp;
  })
);
```

### 挿入方法（InsertsType）の指定

`InsertsType`を指定することで実行される挿入用のSQLを変更することが出来ます。

| InsertsType | 説明                                                                                                                                                                                                                   |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BULK        | `insert into ... values ( ... ), ( ... )`という風にvaluesに複数行の値を出力し一度に複数レコードを挿入する。<br>DBがこの記法をサポートしている場合に指定可能。DBが未サポートの場合、指定しても`BATCH`として実行される。 |
| BATCH       | `java.sql.PreparedStatement#executeBatch()`を使用したバッチSQL実行                                                                                                                                                     |

```java
Stream<Employee> employees = agent.query(Employee.class)
  .stream()
  .map(e -> e.setEmpNo(e.getEmpNo() + 1000));
  
// 複数件の挿入(バッチ実行)
agent.inserts(employees, InsertsType.BATCH);
}
```

::: tip
`InsertsType`は、[初期値設定](../configuration/sql-agent-factory.md#複数件挿入時の挿入方法の初期値設定)が可能です。
:::

### 挿入条件（InsertsCondition）の指定

挿入用SQLの実行条件を指定します。  
`InsertsCondition<E>#test(SqlContext ctx, int count, E entity)`の戻り値が`true`の場合に挿入用SQLを実行します。  
`InsertsCondition`はFunctionalInterfaceのためlambda式が利用できます。

```java
Stream<Employee> employees = agent.query(Employee.class)
  .stream()
  .map(e -> e.setEmpNo(e.getEmpNo() + 1000));
  
// 複数件の挿入（10件毎に挿入）
agent.inserts(employees, (ctx, count, entity) -> count == 10);
```

## エンティティの更新

### 1件の更新(`SqlAgent#update` /`#updateAndReturn`)

| メソッド名                                                    | 戻り値の型 |
| :------------------------------------------------------------ | :--------- |
| &lt;E&gt; SqlAgent#update(E)                                  | int        |
| &lt;E&gt; SqlAgent#updateAndReturn(E) <Badge text="0.15.0+"/> | E          |

エンティティクラスのインスタンスを使って１レコードの更新を行います。

レコード更新時、[@Version](#version)アノテーションの指定があるフィールドに対するカラムはカウントアップされます。  
また、更新された値がエンティティの該当フィールドにも設定されます。

::: warning 補足
エンティティクラスのインスタンスを使った１レコードの更新では、`@Id`を指定したフィールドに対するカラムや自動採番カラムは更新できません。  
`@Id`を指定したフィールドに対するカラムや自動採番カラムを更新する場合は、後述する[条件指定による複数件の更新](#条件指定による複数件の更新-sqlagent-update)を使用してください。
:::

`AndReturn`が付くメソッドでは、更新したエンティティオブジェクトを戻り値として取得できるため、 
エンティティの更新に続けて処理を行う場合に便利です。

```java
agent.find(Employee.class, 1).ifPresent(employee -> {
  employee.setLastName("Wilson");
  System.out.println(employee.getLockVersion()); // 1

  // エンティティの更新
  agent.update(employee);
  System.out.println(employee.getLockVersion()); // 2
});
```

### 条件指定による複数件の更新(`SqlAgent#update`) <Badge text="0.15.0+"/>

| メソッド名                          | 戻り値の型               |
| :---------------------------------- | :----------------------- |
| SqlAgent#update(Class<? extends E>) | SqlEntityUpdate&lt;E&gt; |

更新対象のレコードを抽出する条件を指定して更新を行います。  
抽出条件の指定方法は [抽出条件の指定](#抽出条件の指定) を参照してください。  
また、`set()`メソッドで更新対象のフィールドと値を指定することができます。

```java
// first_name に 'Bob' を含むエンティティの性別を更新
agent.update(Employee.class)
  .contains("firstName", "Bob")
  .set("gender", Gender.MALE)
  .count();
```

### 複数件の更新(`SqlAgent#updates` /`#updatesAndReturn`) <Badge text="0.15.0+"/>

| メソッド名                                                                              | 戻り値の型      |
| :-------------------------------------------------------------------------------------- | :-------------- |
| SqlAgent#updates(Stream&lt;E&gt;)                                                       | int             |
| SqlAgent#updates(Stream&lt;E&gt;, UpdatesCondition<? super E>)                          | int             |
| SqlAgent#updatesAndReturn(Stream&lt;E&gt;)                                              | Stream&lt;E&gt; |
| SqlAgent#updatesAndReturn(Stream&lt;E&gt;, UpdatesCondition<? super E>)                 | Stream&lt;E&gt; |
| SqlAgent#updates(Class&lt;E&gt;, Stream&lt;E&gt;)                                       | int             |
| SqlAgent#updates(Class&lt;E&gt;, Stream&lt;E&gt;, UpdatesCondition<? super E>)          | int             |
| SqlAgent#updatesAndReturn(Class&lt;E&gt;, Stream&lt;E&gt;)                              | Stream&lt;E&gt; |
| SqlAgent#updatesAndReturn(Class&lt;E&gt;, Stream&lt;E&gt;, UpdatesCondition<? super E>) | Stream&lt;E&gt; |

`java.util.stream.Stream`経由で渡される複数のエンティティインスタンスを使って更新します。

::: tip
`inserts`と違い必ずバッチSQL実行になります。
:::

レコード更新時、[@Version](#version)アノテーションの指定があるフィールドに対するカラムはカウントアップされます。  
また、更新された値がエンティティの該当フィールドにも設定されます。

`AndReturn`が付くメソッドでは、更新したエンティティオブジェクトの`java.util.stream.Stream`を戻り値として取得できるため、 
エンティティの更新に続けて処理を行う場合に便利です。

::: warning
`AndReturn`の戻り値となる`Stream<E>`を生成する際、更新したエンティティを全件メモリ上に保持します。
大量データの更新を行うとOOMEが発生する場合があるので、`updatesAndReturn`を使用する場合は更新する
データの件数に気をつけてください。件数が多い場合は一度`updates`で更新した後に、再度検索するといった方法を検討してください。
:::

```java
// 複数件の更新
agent.updates(agent.query(Employee.class)
  .stream()
  .map(e -> {
    e.setFirstName(e.getFirstName() + "_new");
    return e;
  })
);
```

### 更新条件（UpdatesCondition）の指定

更新用SQLの実行条件を指定します。  
`UpdatesCondition<E>#test(SqlContext ctx, int count, E entity)`の戻り値が`true`の場合に更新用SQLを実行します。  
`UpdatesCondition`はFunctionalInterfaceのためlambda式が利用できます。

```java
Stream<Employee> employees = agent.query(Employee.class)
  .stream()
  .map(e -> {
    e.setFirstName(e.getFirstName() + "_new");
    return e;
  });
  
// 複数件の更新（10件毎に挿入）
agent.updates(employees, (ctx, count, entity) -> count == 10);
```

## エンティティのマージ <Badge text="0.22.0+"/>

### 1件のマージ(`SqlAgent#merge` /`#mergeAndReturn`)

| メソッド名                                      | 戻り値の型 |
| :---------------------------------------------- | :--------- |
| &lt;E&gt; SqlAgent#merge(E)                     | int        |
| &lt;E&gt; SqlAgent#mergeAndReturn(E)            | E          |
| &lt;E&gt; SqlAgent#mergeWithLocking(E)          | int        |
| &lt;E&gt; SqlAgent#mergeWithLockingAndReturn(E) | E          |

エンティティクラスのインスタンスを使ってPKによるレコードの検索を行い、レコードがある場合は更新を行います。  
レコードがない場合、もしくは引数で指定したインスタンスのPKに該当するフィールドに値の指定が無い場合は挿入を行います。  
（これは通常、`UPSERT` や `MERGE` と呼ばれる動作です）

`AndReturn` が付くメソッドでは、更新、または挿入したエンティティオブジェクトを戻り値として取得できるため、 エンティティの更新や挿入に続けて処理を行う場合に便利です。

`WithLocking` が付くメソッドでは、PKによるレコードの検索時、レコードの悲観ロックも合わせて行います。

::: warning
接続しているDBが `SELECT FOR UPDATE` もしくは `SELECT FOR UPDATE NOWAIT` をサポートしていない場合、`WithLocking` が付くメソッドを呼び出すと `UroborosqlRuntimeException` がスローされます。
:::

#### mergeメソッドを使用しない場合

```java
agent.find(Employee.class, 1).ifPresentOrElse(employee -> {
  employee.setLastName("Wilson");

  // エンティティの更新
  agent.update(employee);
}, () -> {
  Employee employee = new Employee();
  employee.setFirstName("Susan");
  employee.setLastName("Wilson");
  employee.setBirthDate(LocalDate.of(1969, 2, 10));
  employee.setGender(Gender.FEMALE); // MALE("M"), FEMALE("F"), OTHER("O")

  // エンティティの挿入
  agent.insert(new Employee);
});
```

#### mergeメソッドを利用する場合（更新）

```java
Employee employee = ...;  // find or create instance.
// employee.setId(1); // id(PK) is 1
employee.setLastName("Wilson");
agent.merge(employee);
```

#### mergeメソッドを利用する場合（挿入）

```java
Employee employee = new Employee();
employee.setFirstName("Susan");
employee.setLastName("Wilson");
employee.setBirthDate(LocalDate.of(1969, 2, 10));
employee.setGender(Gender.FEMALE); // MALE("M"), FEMALE("F"), OTHER("O")
agent.merge(employee);
```


## エンティティの削除

### 1件の削除(`SqlAgent#delete` /`#deleteAndReturn`)

| メソッド名                                                    | 戻り値の型 |
| :------------------------------------------------------------ | :--------- |
| &lt;E&gt; SqlAgent#delete(E)                                  | int        |
| &lt;E&gt; SqlAgent#deleteAndReturn(E) <Badge text="0.15.0+"/> | E          |

エンティティクラスのインスタンスを使って１レコードの削除を行います。

`AndReturn`が付くメソッドでは、削除したエンティティオブジェクトを戻り値として取得できるため、
エンティティの削除に続けて処理を行う場合に便利です。

```java
agent.find(Employee.class, 1).ifPresent(employee -> {
  // エンティティの削除
  agent.delete(employee);
});
```

### PKを指定した複数件の削除(`SqlAgent#delete`) <Badge text="0.11.0+"/>

| メソッド名                                     | 戻り値の型 |
| :--------------------------------------------- | :--------- |
| SqlAgent#delete(Class<? extends E>, Object...) | int        |

```java
// PK(emp_no) = 1 or 2 のエンティティの削除
agent.delete(Employee.class, 1, 2);
```

### 条件指定による複数件の削除(`SqlAgent#delete`) <Badge text="0.11.0+"/>

| メソッド名                          | 戻り値の型               |
| :---------------------------------- | :----------------------- |
| SqlAgent#delete(Class<? extends E>) | SqlEntityDelete&lt;E&gt; |

削除対象のレコードを抽出する条件を指定して削除を行います。  
抽出条件の指定方法は [抽出条件の指定](#抽出条件の指定) を参照してください。

```java
// first_name = 'Bob' に該当するエンティティの削除
agent.delete(Employee.class).contains("firstName", "Bob").count();
```

### 全ての行を削除（`SqlAgent#truncate`） <Badge text="0.17.0+"/>

| メソッド名                            | 戻り値の型 |
| :------------------------------------ | :--------- |
| SqlAgent#truncate(Class<? extends E>) | SqlAgent   |

エンティティクラスとマッピングされているテーブルの全てのレコードを`TRUNCATE`文により削除します。
一般的に大量レコードの削除は、`TRUNCATE`文による削除のほうが性能上有利ですが、DBMSによってはロールバックできませんので、注意してください。

:::tip
PostgreSQLは、`TRUNCATE`文のロールバック可能です。
:::

`SqlAgent#truncate`は、`SqlAgent`を戻り値として返すため、`SqlAgent#truncate`に続けて、`SqlAgent#inserts`をつなげることにより、
テーブルの洗い替えを実装することが可能です。

```java
// 全てのレコードを削除
agent.truncate(Employee.class);

// テーブルの洗い替え
agent.truncate(Employee.class)
     .inserts(employees.stream());
```

## Entityアノテーション

DAOインタフェースで利用するエンティティクラスではテーブルとのマッピングやカラムの属性を指定するためにアノテーションを利用することができます。

### `@Table`

エンティティクラスに紐づけるテーブル名を指定します。  
テーブル名と名前が一致しないエンティティクラスにマッピングしたい場合に利用します。

| 属性名 | 型     | 必須  | 説明                                                                                             | 初期値 |
| :----- | :----- | :---: | :----------------------------------------------------------------------------------------------- | :----- |
| name   | String |   -   | マッピングするテーブル名。指定しない場合はクラス名をスネークケースにしたテーブルとマッピングする | なし   |
| schema | String |   -   | マッピングするテーブルの所属するスキーマ名                                                       | なし   |

```java
import jp.co.future.uroborosql.mapping.annotations.Table;

// name指定なし (departmentテーブルにマッピング)
@Table
public class Department {
  // 以下略
}

// name指定あり
@Table(name = "employee")
public class CustomEmployee {
  // 以下略
}
```

### `@Column`

フィールドに紐づけるカラム名を指定します。  
カラム名と名前が一致しないフィールドにマッピングしたい場合に利用します。

| 属性名 | 型     | 必須  | 説明                   | 初期値 |
| :----- | :----- | :---: | :--------------------- | :----- |
| name   | String |  〇   | マッピングするカラム名 | なし   |

```java
import jp.co.future.uroborosql.mapping.annotations.Table;
import jp.co.future.uroborosql.mapping.annotations.Column;

@Table(name = "employee")
public class Employee {
  @Column(name = "emp_no")
  private long employeeNo;

  private String firstName;

  // 以下略
}
```

### `@Domain`

独自に作成した型(ドメインクラス)のフィールドにカラムをマッピングする場合に指定します。

| 属性名        | 型       | 必須  | 説明                                                                                     | 初期値     |
| :------------ | :------- | :---: | :--------------------------------------------------------------------------------------- | :--------- |
| valueType     | Class<?> |  〇   | ドメインクラスを生成するのに必要な値の型                                                 | なし       |
| factoryMethod | String   |   -   | ドメインクラスを生成・取得するメソッド名。指定しない場合はコンストラクタが呼び出される。 | ""         |
| toJdbcMethod  | String   |   -   | JDBCが受け付けられる値に変換するメソッド名                                               | "getValue" |
| nullable      | boolean  |   -   | null可かどうかの指定                                                                     | false      |

例

```java
import jp.co.future.uroborosql.mapping.annotations.Table;
import jp.co.future.uroborosql.mapping.annotations.Domain;

@Domain(valueType = String.class, factoryMethod = "of", toJdbcMethod = "getName", nullable = true)
public static class NameDomain {
  private String name;

  private NameDomain(String name) {
    this.name = name;
  }

  public static NameDomain of(String name) {
    return new NameDomain(name);
  }

  public String getName() {
    return name;
  }
}

@Table
public class Employee {
  private long empNo;
  private NameDomain firstName;

  // 以下略
}
```

### `@Transient`

フィールドとカラムのマッピング対象から除外します。

:::tip
例えば、エンタープライズシステムの設計でしばしば利用される最終登録日時や最終更新日時など、
INSERT/UPDATEの対象から除外したいケースで利用します。
:::

| 属性名 | 型      | 必須  | 説明                                                                           | 初期値 |
| :----- | :------ | :---: | :----------------------------------------------------------------------------- | :----- |
| insert | boolean |   -   | `agent#insert()`実行時にフィールドを無視するかどうか。`true`の場合は無視する。 | true   |
| update | boolean |   -   | `agent#update()`実行時にフィールドを無視するかどうか。`true`の場合は無視する。 | true   |

例

```java
import jp.co.future.uroborosql.mapping.annotations.Table;
import jp.co.future.uroborosql.mapping.annotations.Transient;

@Table
public class Employee {

  // 途中略

  @Transient
  private String memo; // 常に無視

  @Transient(insert = false, update = true)
  private LocalDate creationDate; // insert時は対象、update時は無視

  @Transient(insert = true, update = false)
  private LocalDate updateDate;  // insert時は無視、update時は対象

  // 以下略
}
```

### `@Version`

このアノテーションが付与されたフィールドは楽観ロック用のバージョン情報を保持するフィールドになります。  
デフォルト(`LockVersionOptimisticLockSupplier`)ではUPDATE時にはSET句で+1され、WHERE句の検索条件に追加されてSQLを実行し更新件数が0の場合には`OptimisticLockException`をスローします。

::: warning
`@Version`を付与するフィールドにマッピングされるDBカラムの型は数値型でなければなりません。
:::

| 属性名                          | 型                     | 必須  | 説明                 | 初期値                            |
| :------------------------------ | :--------------------- | :---: | :------------------- | :-------------------------------- |
| supplier<Badge text="0.17.0+"/> | OptimisticLockSupplier |   -   | バージョン情報カラム | LockVersionOptimisticLockSupplier |

#### サプライヤの種類

| サプライヤ型                            | 概要                       | 説明                                                                                          |
| --------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------- |
| LockVersionOptimisticLockSupplier       | ロックバージョン           | UPDATEのSET句で`+1`がセットされます。                                                         |
| CyclicLockVersionOptimisticLockSupplier | 循環式ロックバージョン     | UPDATEのSET句で`バージョン情報カラム名 % 数値カラムの最大値 + 1`がセットされます。            |
| TimestampOptimisticLockSupplier         | タイムスタンプ             | UPDATEのSET句でタイムスタンプ(`System.currentTimeMillis()`)がセットされます。                 |
| FieldIncrementOptimisticLockSupplier    | フィールド値インクリメント | UPDATEのSET句で2WaySQLのバインド変数を利用して、`バージョン情報カラム名＋1`がセットされます。 |

例

```java
import jp.co.future.uroborosql.mapping.annotations.Table;
import jp.co.future.uroborosql.mapping.annotations.Version;
import jp.co.future.uroborosql.mapping.TimestampOptimisticLockSupplier;

@Table
public class Employee {
  private long empNo;
  private String firstName;
  private String lastName;

　　// 途中略

  @Version(supplier = TimestampOptimisticLockSupplier.class)
  private long lockVersion = 0;

  // 以下略
}
```

### `@Id` /`@GeneratedValue` /`@SequenceGenerator` <Badge text="0.12.0+"/>

これらのアノテーションが付与されたフィールドは自動採番フィールドになります。  
`@Id`と`@GeneratedValue`は必ずセットでフィールドに付与する必要があります。  
`@GeneratedValue`のstrategy属性が`GenerationType.SEQUENCE`の場合に`@SequenceGenerator`を付与してシーケンスの生成方法を指定する必要があります。

| アノテーション     | 説明                                         |
| :----------------- | :------------------------------------------- |
| @Id                | エンティティの主キーを識別するアノテーション |
| @GeneratedValue    | 主キーの値の生成戦略を指定するアノテーション |
| @SequenceGenerator | SEQUENCEによるID生成を設定するアノテーション |

| アノテーション     | 属性名   | 型             | 必須  | 説明                                                                                     | 初期値                  |
| :----------------- | :------- | :------------- | :---: | :--------------------------------------------------------------------------------------- | :---------------------- |
| @Id                | なし     | -              |   -   | -                                                                                        | -                       |
| @GeneratedValue    | strategy | GenerationType |   -   | 主キー生成戦略の型。`GenerationType.IDENTITY`, `GenerationType.SEQUENCE`のいずれかを指定 | GenerationType.IDENTITY |
| @SequenceGenerator | sequence | String         |  〇   | シーケンス名                                                                             | なし                    |
| @SequenceGenerator | catalog  | String         |   -   | シーケンスが所属するカタログ名                                                           | ""                      |
| @SequenceGenerator | schema   | String         |   -   | シーケンスが所属するスキーマ名                                                           | ""                      |

```java
import jp.co.future.uroborosql.mapping.annotations.Table;
import jp.co.future.uroborosql.mapping.annotations.Id;
import jp.co.future.uroborosql.mapping.annotations.GeneratedValue;
import jp.co.future.uroborosql.mapping.annotations.SequenceGenerator;

@Table
public class Employee {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  @SequenceGenerator(sequence = 'employee_emp_id_seq')
  private long empNo;

  private String firstName;

  // 以下略
}
```
