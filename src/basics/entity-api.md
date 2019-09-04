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

|メソッド名|戻り値の型|
|:---|:---|
|SqlAgent#find(Class<E&gt;, Object...)|Optional<E&gt;|

主キーを指定してエンティティを取得します。PKカラムの数と引数に指定するキーの数は合わせる必要があります。

```java
// emp_no = 1 のレコードをエンティティとして取得
Optional<Employee> employee = agent.find(Employee.class, 1);
```

### 条件指定検索(`SqlAgent#query`) <Badge text="0.11.0+"/>

|メソッド名|戻り値の型|
|:---|:---|
|SqlAgent#query(Class<E&gt;)|SqlEntityQuery<E&gt;|

エンティティクラスを利用した検索を行うためのオブジェクト（`SqlEntityQuery`)を取得します。  
`SqlEntityQuery`に対して抽出条件の指定を行い、抽出条件に該当するエンティティを取得します。

#### 抽出条件の指定

|抽出条件指定メソッド記述例|生成されるwhere句の条件式|補足説明|
|:-------|:---------------|:-------------|
|equal("col", "value")|col = 'value'||
|notEqual("col", "value")|col != 'value'||
|greaterThan("col", 1)|col > 1||
|lessThan("col", 1)|col < 1||
|greaterEqual("col", 1)|col >= 1||
|lessEqual("col", 1)|col <= 1||
|in("col", "val1", "val2")|col in ('val1', 'val2')||
|in("col", List.of("val1", "val2"))|col in ('val1', 'val2')||
|notIn("col", "val1", "val2")|col not in ('val1', 'val2')||
|notIn("col", List.of("val1", "val2"))|col not in ('val1', 'val2')||
|like("col", "%val%")|like '%val%'|`val`はエスケープされない|
|startsWith("col", "val")|like 'val%'|`val`はエスケープされる|
|endsWith("col", "val")|like '%val'|`val`はエスケープされる|
|contains("col", "val")|like '%val%'|`val`はエスケープされる|
|notLike("col", "%val%")|not like '%val%'|`val`はエスケープされない|
|notStartsWith("col", "val")|not like 'val%'|`val`はエスケープされる|
|notEndsWith("col", "val")|not like '%val'|`val`はエスケープされる|
|notContains("col", "val")|not like '%val%'|`val`はエスケープされる|
|between("col", 1, 2)|col between 1 and 2||
|isNull("col")|col is null||
|isNotNull("col")|col is not null||
|where("col = 1 or col = 2")|(col = 1 or col = 2) |もし複数回`where()`が呼び出された場合は条件を `AND` で結合する|

```java
// emp_no = 1 のレコードをList<Employee>で取得
agent.query(Employee.class).equal("emp_no", 1).collect();

// emp_no = 10 又は 20 のレコードをList<Employee>で取得
agent.query(Employee.class).in("emp_no", 10, 20).collect();

// first_name like '%Bob%' のレコードをList<Employee>で取得
agent.query(Employee.class).contains("first_name", "Bob").collect();

// where句を直接記述(first_name = 'Bob' and last_name = 'Smith')した結果をList<Employee>で取得
agent.query(Employee.class).where("first_name ='Bob'").where("last_name = 'Smith").collect();
```

#### ソート順や取得データの件数、開始位置の指定 <Badge text="0.11.0+"/>

`SqlEntityQuery`では抽出条件に加えて検索結果のソート順や取得件数の制限、開始位置の指定が行えます。

|条件指定メソッド記述例|生成されるSQL|補足説明|
|:-------|:---------------|:-------------|
|asc("col1", "col2")| order by col1 asc, col2 asc|`NULLS`が有効な場合は`NULLS LAST`が出力される|
|asc("col1", Nulls.FIRST)| order by col1 asc NULLS FIRST|複数回`asc()`が呼び出された場合は呼び出し順に並べる|
|desc("col1", "col2")| order by col1 desc, col2 desc|`NULLS`が有効な場合は`NULLS LAST`が出力される|
|desc("col1", Nulls.FIRST)| order by col1 desc NULLS FIRST|複数回`asc()`が呼び出された場合は呼び出し順に並べる|
|limit(10)|LIMIT 10|接続しているDBで`limit`句が使用できない場合は`UroborosqlRuntimeException`がスローされる|
|offset(10)|OFFSET 10|接続しているDBで`offset`句が使用できない場合は`UroborosqlRuntimeException`がスローされる|

```java
// birth_dateの降順、first_nameの昇順でソートした結果を List<Employee>で取得
agent.query(Employee.class).desc("birth_date").asc("first_name").collect();

// emp_no の昇順でソートした結果の3行目から5件取得
agent.query(Employee.class).asc("emp_no").offset(3).limit(5).collect();
```

#### 集約関数 <Badge text="0.12.0+"/>

`SqlEntityQuery`ではエンティティを取得する他に結果の集計を行うこともできます。

|メソッド|説明|
|:--|:--|
|collect()|検索結果をエンティティのリストとして取得する|
|stream()|検索結果を`java.util.stream.Stream`として取得する|
|count()|検索結果の件数を取得する|
|count(String col)|検索結果のうち、引数で指定したカラムがNULLでない行の件数を取得する|
|sum(String col)|検索結果のうち、引数で指定したカラムの合計値を取得する|
|min(String col)|検索結果のうち、引数で指定したカラムの最小値を取得する|
|max(String col)|検索結果のうち、引数で指定したカラムの最大値を取得する|
|exists(Runnable runnable)|検索結果が1件以上ある場合に引数で渡した関数を実行する|
|notExists(Runnable runnable)|検索結果が0件の場合に引数で渡した関数を実行する|

```java
// List<Employee>で取得
List<Enployee> employees = agent.query(Employee.class).collect();

// 検索結果の件数を取得
long count = agent.query(Employee.class).count();

// 検索結果が1件以上の場合にログを出力する
agent.query(Employee.class).greaterThan("emp_no", 10).exists(() -> {
  log.info("Employee(emp_no > 10) exists.");
});

```

## エンティティの挿入

### 1件の挿入(`SqlAgent#insert`)

|メソッド名|戻り値の型|
|:---|:---|
|SqlAgent#insert(Object)|int|

エンティティクラスのインスタンスを使って１レコードの挿入を行います。

```java
Employee employee = new Employee();
employee.setEmpNo(2);
employee.setFirstName("Susan");
employee.setLastName("Davis");
employee.setBirthDate(LocalDate.of(1969, 2, 10));
employee.setGender(Gender.FEMALE); // MALE("M"), FEMALE("F"), OTHER("O")

// 1件の挿入
agent.insert(employee);
```

### 複数件の挿入(`SqlAgent#inserts`) <Badge text="0.10.0+"/>

|メソッド名|戻り値の型|
|:---|:---|
|SqlAgent#inserts(Stream<E&gt;)|int|
|SqlAgent#inserts(Stream<E&gt;, InsertsType)|int|
|SqlAgent#inserts(Stream<E&gt;, InsertsCondition<? super E>)|int|
|SqlAgent#inserts(Stream<E&gt;, InsertsCondition<? super E>, InsertsType)|int|
|SqlAgent#inserts(Class<E&gt;, Stream<E&gt;)|int|
|SqlAgent#inserts(Class<E&gt;, Stream<E&gt;, InsertsType)|int|
|SqlAgent#inserts(Class<E&gt;, Stream<E&gt;, InsertsCondition<? super E>)|int|
|SqlAgent#inserts(Class<E&gt;, Stream<E&gt;, InsertsCondition<? super E>, InsertsType)|int|

`java.util.stream.Stream`経由で渡される複数のエンティティインスタンスを挿入します。

```java
Stream<Employee> employees = agent.query(Employee.class)
  .stream()
  .map(e -> e.setEmpNo(e.getEmpNo() + 1000));
  
// 複数件の挿入
agent.inserts(employees);
}
```

### 挿入方法（InsertsType）の指定

`InsertsType`を指定することで実行される挿入用のSQLを変更することが出来ます。

|InsertsType|説明|
|:---|:---|
|BULK|`insert into ... values ( ... ), ( ... )`という風にvaluesに複数行の値を出力し一度に複数レコードを挿入する。<br>DBがこの記法をサポートしている場合に指定可能。DBが未サポートの場合、指定しても`BATCH`として実行される。|
|BATCH|`java.sql.PreparedStatement#executeBatch()`を使用したバッチSQL実行|

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

### 1件の更新(`SqlAgent#update`)

|メソッド名|戻り値の型|
|:---|:---|
|SqlAgent#update(Object)|int|

エンティティクラスのインスタンスを使って１レコードの更新を行います。

```java
agent.find(Employee.class, 1).ifPresent(employee -> {
  employee.setLastName("Wilson");

  // エンティティの更新
  agent.update(employee);
});
```

## エンティティの削除

### 1件の削除(`SqlAgent#delete`)

|メソッド名|戻り値の型|
|:---|:---|
|SqlAgent#delete(Object)|int|

エンティティクラスのインスタンスを使って１レコードの削除を行います。

```java
agent.find(Employee.class, 1).ifPresent(employee -> {
  // エンティティの削除
  agent.delete(employee);
});
```

### PKを指定した複数件の削除(`SqlAgent#delete`) <Badge text="0.11.0+"/>

|メソッド名|戻り値の型|
|:---|:---|
|SqlAgent#delete(Class<? extends E>, Object...)|int|

```java
// PK(emp_no) = 1 or 2 のエンティティの削除
agent.delete(Employee.class, 1, 2);
```

### 条件指定による複数件の削除(`SqlAgent#delete`) <Badge text="0.11.0+"/>

|メソッド名|戻り値の型|
|:---|:---|
|SqlAgent#delete(Class<? extends E>)|SqlEntityDelete<E&gt;|

削除対象のレコードを抽出する条件を指定して削除を行います。  
抽出条件の指定方法は [抽出条件の指定](#抽出条件の指定) を参照してください。

```java
// first_name = 'Bob' に該当するエンティティの削除
agent.delete(Employee.class).contains("first_ame", "Bob").count();
```

## Entityアノテーション

DAOインタフェースで利用するエンティティクラスではテーブルとのマッピングやカラムの属性を指定するためにアノテーションを利用することができます。

### `@Table`

エンティティクラスに紐づけるテーブル名を指定します。  
テーブル名と名前が一致しないエンティティクラスにマッピングしたい場合に利用します。

|属性名|型|必須|説明|初期値|
|:---|:---|:--:|:---|:---|
|name|String|-|マッピングするテーブル名。指定しない場合はクラス名をスネークケースにしたテーブルとマッピングする|なし|
|schema|String|-|マッピングするテーブルの所属するスキーマ名|なし|

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

|属性名|型|必須|説明|初期値|
|:---|:---|:--:|:---|:---|
|name|String|〇|マッピングするカラム名|なし|

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

|属性名|型|必須|説明|初期値|
|:---|:---|:--:|:---|:---|
|valueType|Class<?>|〇|ドメインクラスを生成するのに必要な値の型|なし|
|factoryMethod|String|-|ドメインクラスを生成・取得するメソッド名。指定しない場合はコンストラクタが呼び出される。|""|
|toJdbcMethod|String|-|JDBCが受け付けられる値に変換するメソッド名|"getValue"|
|nullable|boolean|-|null可かどうかの指定|false|

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

|属性名|型|必須|説明|初期値|
|:---|:---|:--:|:---|:---|
|insert|boolean|-|`agent#insert()`実行時にフィールドを無視するかどうか。`true`の場合は無視する。|true|
|update|boolean|-|`agent#update()`実行時にフィールドを無視するかどうか。`true`の場合は無視する。|true|

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
UPDATE時にはSET句で+1され、WHERE句の検索条件に追加されてSQLを実行し更新件数が0の場合には`OptimisticLockException`をスローします。

::: warning
`@Version`を付与するフィールドにマッピングされるDBカラムの型は数値型でなければなりません。
:::

|属性名|型|必須|説明|初期値|
|:---|:---|:--:|:---|:---|
|なし|-|-|-|-|

例

```java
import jp.co.future.uroborosql.mapping.annotations.Table;
import jp.co.future.uroborosql.mapping.annotations.Version;

@Table
public class Employee {
  private long empNo;
  private String firstName;
  private String lastName;

　　// 途中略

  @version
  private long lockVersion = 0;

  // 以下略
}
```

### `@Id` / `@GeneratedValue` / `@SequenceGenerator` <Badge text="0.12.0+"/>

これらのアノテーションが付与されたフィールドは自動採番フィールドになります。  
`@Id`と`@GeneratedValue`は必ずセットでフィールドに付与する必要があります。  
`@GeneratedValue`のstrategy属性が`GenerationType.SEQUENCE`の場合に`@SequenceGenerator`を付与してシーケンスの生成方法を指定する必要があります。

|アノテーション|説明|
|:---|:---|
|@Id|エンティティの主キーを識別するアノテーション|
|@GeneratedValue|主キーの値の生成戦略を指定するアノテーション|
|@SequenceGenerator|SEQUENCEによるID生成を設定するアノテーション|

|アノテーション|属性名|型|必須|説明|初期値|
|:---|:---|:---|:--:|:---|:---|
|@Id|なし|-|-|-|-|
|@GeneratedValue|strategy|GenerationType|-|主キー生成戦略の型。`GenerationType.IDENTITY`, `GenerationType.SEQUENCE`のいずれかを指定|GenerationType.IDENTITY|
|@SequenceGenerator|sequence|String|〇|シーケンス名|なし|
|@SequenceGenerator|catalog|String|-|シーケンスが所属するカタログ名|""|
|@SequenceGenerator|schema|String|-|シーケンスが所属するスキーマ名|""|

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
