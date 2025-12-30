---
head:
  - - meta
    - name: og:title
      content: "SQLファイルインタフェース"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/basics/sql-file-api.html"
---

# SQLファイルインタフェース

## SQLによる検索(`SqlAgent#query` /`#queryWith`)

SQLを検索する方法は2つあります。

| 利用メソッド                      | 説明                                             |
| :-------------------------------- | :----------------------------------------------- |
| SqlAgent#query("[SQL名]")         | [SQL名](./index.md#sql名)で説明した`SQL名`を指定 |
| SqlAgent#queryWith("[SQL文字列]") | `SQL文字列`を直接指定                            |

上記２つのメソッドは検索を行うための`SqlQuery`インタフェースのインスタンスを返却します。

```java
// SQL名を指定
SqlQuery query1 = agent.query("employee/select_employee");

// SQL文字列を指定
SqlQuery query2 = agent.queryWith("select first_name, last_name where employee");
```

### 検索結果の取得

`SqlAgent`から取得した`SQLQuery`を使用していろいろな形式で検索結果を取得することが出来ます。  
下記のSQLを例に説明します。

```sql
-- department/select_department.sql
select /* _SQL_ID_ */
  dept.dept_no  as  dept_no
,  dept.dept_name  as  dept_name
from
  department  dept
where
  1        =  1
/*IF SF.isNotEmpty(deptNo)*/
and  dept.dept_no  =  /*deptNo*/1
/*END*/
/*IF SF.isNotEmpty(deptName)*/
and  dept.dept_name  =  /*deptName*/'sample'
/*END*/
```

### リスト取得(`SqlQuery#collect`)

| メソッド名                    | 戻り値の型                |
| :---------------------------- | :------------------------ |
| SqlQuery#collect()            | List<Map<String, Object>> |
| SqlQuery#collect(CaseFormat)  | List<Map<String, Object>> |
| SqlQuery#collect(Class<T&gt;) | List<Class<T&gt;>         |

検索結果をMapや指定したクラスのListとして取得します。  
Mapには`キー：カラムラベル名`、`値：カラムの値`の形で1行分のデータが格納されます。

::: warning
`SqlQuery#collect()`では検索結果をすべてメモリ上に格納します。大量データの検索を行う場合は後述の`SqlQuery#strem()`の利用を検討してください。
:::

#### `SqlQuery#collect()` 引数なし

```java
try (SqlAgent agent = config.agent()) {
  List<Map<String, Object>> departments = agent.query("department/select_department")
      .collect();
}
// 結果(departments)
[
 {"DEPT_NO"=1, "DEPT_NAME"="sales"},
 {"DEPT_NO"=2, "DEPT_NAME"="export"},
 {"DEPT_NO"=3, "DEPT_NAME"="accounting"},
 {"DEPT_NO"=4, "DEPT_NAME"="personnel"}
]
```

#### `SqlQuery#collect(CaseFormat)` `CaseFormat`指定

引数に`jp.co.future.uroborosql.utils.CaseFormat`を指定することで、Mapのキー名に対する書式を変更することができます。

`CaseFormat.CAMEL_CASE`指定

```java
try (SqlAgent agent = config.agent()) {
  List<Map<String, Object>> departments = agent.query("department/select_department")
      .collect(CaseFormat.CAMEL_CASE);
}
// 結果(departments) のキーが"deptNo", "deptName"となる
[
 {"deptNo"=1, "deptName"="sales"},
 {"deptNo"=2, "deptName"="export"},
 {"deptNo"=3, "deptName"="accounting"},
 {"deptNo"=4, "deptName"="personnel"}
]
```

`CaseFormat`の指定がない場合はデフォルトの`CaseFormat`（初期設定では`UPPER_SNAKE_CASE`）で加工した値になります。  
デフォルトの`CaseFormat`はSqlConfig生成時に変更することができます。
デフォルト`CaseFormat`の設定の詳細は [CaseFormatの初期値設定](../configuration/sql-agent-provider.md#caseformatの初期値設定) を参照してください

#### `SqlQuery#collect(Class<T>)` 型指定

引数にクラスを指定すると、検索結果をMapの代わりに指定したクラスのインスタンスのListで取得することができます。

エンティティクラスを指定した場合

```java
/**
 * Entity that can be mapped to department table
 */
public class Department {
  private long deptNo;
  private String deptName;

  public long getDeptNo() {　return this.deptNo;　}
  public void setDeptNo(long deptNo) {　this.deptNo = deptNo;　}
  public String getDeptName() {　return this.deptName;　}
  public void setDeptName(String deptName) {　this.deptName = deptName;　}
}
```

```java
try (SqlAgent agent = config.agent()) {
  List<Department> departments = agent.query("department/select_department")
      .collect(Department.class);
}
```

引数に以下のクラスを指定すると、検索結果の `先頭項目` を指定したクラスのインスタンスの形で取得することができます。 <Badge text="0.25.0+"/>

::: details 引数に指定可能な型

- プリミティブ型
  - boolean
  - byte
  - short
  - int
  - long
  - float
  - double
- ラッパー型
  - java.lang.Boolean
  - java.lang.Byte
  - java.lang.Short
  - java.lang.Integer
  - java.lang.Long
  - java.lang.Float
  - java.lang.Double
- その他の基本型
  - java.lang.String
  - java.lang.BigInteger
  - java.lang.BigDecimal
  - Enum型
- 日付型
  - java.util.Date
- JDBCの提供する型
  - java.sql.Date
  - java.sql.Time
  - java.sql.Timestamp
  - java.sql.Array
  - java.sql.Clob
  - java.sql.NClob
  - java.sql.Blob
  - java.sql.Ref
  - java.sql.SQLXML
- java.time API
  - java.time.LocalDate
  - java.time.LocalTIme
  - java.time.OffsetTime
  - java.time.LocalDateTime
  - java.time.OffsetDateTime
  - java.time.ZonedDateTime
  - java.time.Year
  - java.time.Month
  - java.time.YearMonth
  - java.time.MonthDay
  - java.time.DayOfWeek
- Optional型
  - java.util.Optional
  - java.util.OptionalInt
  - java.util.OptionalLong
  - java.util.OptionalDouble
- 配列
  - java.lang.Object[]
  - byte[]
- ドメイン型
  - [Domain](./entity-api.md#domain) アノテーションを付与した型

:::

```java
try (SqlAgent agent = config.agent()) {
  List<Long> deptNoList = agent.query("department/select_department").collect(Long.class);
}
```

### 先頭取得（`SqlQuery#first`)

| メソッド名                  | 戻り値の型          |
| :-------------------------- | :------------------ |
| SqlQuery#first()            | Map<String, Object> |
| SqlQuery#first(CaseFormat)  | Map<String, Object> |
| SqlQuery#first(Class<T&gt;) | T                   |

検索結果の1件目を取得します。  
結果を取得できない（検索結果が0件）場合、`jp.co.future.uroborosql.exception.DataNotFoundException`をスローします。

::: tip
メモリ上には最大1件分のデータしか格納しないため、検索結果が大量になる場合でもメモリ使用量を気にせず呼び出すことができます。
:::

#### `SqlQuery#first()` 引数なし

```java
try (SqlAgent agent = config.agent()) {
  Map<String, Object> department = agent.query("department/select_department")
      .first();
} catch (DataNotFoundException ex) {
  ex.printStackTrace();
}

// 結果(department)
 {"DEPT_NO"=1, "DEPT_NAME"="sales"}
```

#### `SqlQuery#first(CaseFormat)` `CaseFormat`指定

引数に`jp.co.future.uroborosql.utils.CaseFormat`を指定することで、Mapのキー名に対する書式を変更することができます。

`CaseFormat.CAMEL_CASE`指定

```java
try (SqlAgent agent = config.agent()) {
  Map<String, Object> department = agent.query("department/select_department")
      .first(CaseFormat.CAMEL_CASE);
} catch (DataNotFoundException ex) {
  ex.printStackTrace();
}
// 結果(department)
 {"deptNo"=1, "deptName"="sales"}
```

#### `SqlQuery#first(Class<T>)` 型指定

引数にクラスを指定すると、検索結果を指定したクラスのインスタンスの形で取得することができます。

エンティティクラスを指定した場合

```java
try (SqlAgent agent = config.agent()) {
  Department department = agent.query("department/select_department")
      .first(Department.class);
} catch (DataNotFoundException ex) {
  ex.printStackTrace();
}
```

`SqlQuery#collect(Class<T>)` と同様、検索結果の先頭項目を指定したクラスのインスタンスの形で取得することができます。<Badge text="0.25.0+"/>

```java
try (SqlAgent agent = config.agent()) {
  long deptNo = agent.query("department/select_department")
      .first(long.class);
} catch (DataNotFoundException ex) {
  ex.printStackTrace();
}
```

### 先頭取得（`SqlQuery#findFirst`)

| メソッド名                      | 戻り値の型                    |
| :------------------------------ | :---------------------------- |
| SqlQuery#findFirst()            | Optional<Map<String, Object>> |
| SqlQuery#findFirst(CaseFormat)  | Optional<Map<String, Object>> |
| SqlQuery#findFirst(Class<T&gt;) | Optional<T&gt;                |

検索結果の1件目をOptionalの形式で取得します。  
メモリ上には最大1件分のデータしか格納しないため、検索結果が大量になる場合でもメモリ使用量を気にせず呼び出すことができます。

#### `SqlQuery#findFirst()` 引数なし

```java
try (SqlAgent agent = config.agent()) {
  Optional<Map<String, Object>> department = agent.query("department/select_department")
      .findFirst();
}
// 結果(department)
 {"DEPT_NO"=1, "DEPT_NAME"="sales"}
```

#### `SqlQuery#findFirst(CaseFormat)` `CaseFormat`指定

引数に`jp.co.future.uroborosql.utils.CaseFormat`を指定することで、Mapのキー名に対する書式を変更することができます。

`CaseFormat.CAMEL_CASE`指定

```java
try (SqlAgent agent = config.agent()) {
  Optional<Map<String, Object>> departmentOpt = agent.query("department/select_department")
      .findFirst(CaseFormat.CAMEL_CASE);
}
// 結果(department)
 {"deptNo"=1, "deptName"="sales"}
```

#### `SqlQuery#findFirst(Class<T>)` 型指定

引数にクラスを指定すると、検索結果を指定したクラスのOptional型の形で取得することができます。

エンティティクラスを指定した場合

```java
try (SqlAgent agent = config.agent()) {
  Optional<Department> departmentOpt = agent.query("department/select_department")
      .findFirst(Department.class);
}
```

`SqlQuery#collect(Class<T>)` と同様、検索結果の先頭項目を指定したクラスのOptional型の形で取得することができます。<Badge text="0.25.0+"/>

```java
try (SqlAgent agent = config.agent()) {
  Optional<Long> deptNoOpt = agent.query("department/select_department")
      .findFirst(Long.class);
}
```

### 先頭１件取得（`SqlQuery#one`)

| メソッド名                | 戻り値の型          |
| :------------------------ | :------------------ |
| SqlQuery#one()            | Map<String, Object> |
| SqlQuery#one(CaseFormat)  | Map<String, Object> |
| SqlQuery#one(Class<T&gt;) | T                   |

検索結果の1件目を取得します。[find()](#先頭取得（sqlquery-first)と違い、実行するSQLで複数件の検索結果を返す場合は例外をスローします。  
結果を取得できない（検索結果が0件）場合、`jp.co.future.uroborosql.exception.DataNotFoundException`をスローします。  
検索結果が2件以上存在する場合、`jp.co.future.uroborosql.exception.DataNotUniqueException`をスローします。

::: tip
メモリ上には最大1件分のデータしか格納しないため、検索結果が大量になる場合でもメモリ使用量を気にせず呼び出すことができます。
:::

#### `SqlQuery#one()` 引数なし

```java
try (SqlAgent agent = config.agent()) {
  Map<String, Object> department = agent.query("department/select_department")
      .one();
} catch (DataNotFoundException | DataNotUniqueException ex) {
  ex.printStackTrace();
}

// 結果(department)
 {"DEPT_NO"=1, "DEPT_NAME"="sales"}
```

#### `SqlQuery#one(CaseFormat)` `CaseFormat`指定

引数に`jp.co.future.uroborosql.utils.CaseFormat`を指定することで、Mapのキー名に対する書式を変更することができます。

`CaseFormat.CAMEL_CASE`指定

```java
try (SqlAgent agent = config.agent()) {
  Map<String, Object> department = agent.query("department/select_department")
      .one(CaseFormat.CAMEL_CASE);
} catch (DataNotFoundException | DataNotUniqueException ex) {
  ex.printStackTrace();
}
// 結果(department)
 {"deptNo"=1, "deptName"="sales"}
```

#### `SqlQuery#one(Class<T>)` 型指定

引数にクラスを指定すると、検索結果を指定したクラスのインスタンスの形で取得することができます。

エンティティクラスを指定した場合

```java
try (SqlAgent agent = config.agent()) {
  Department department = agent.query("department/select_department")
      .one(Department.class);
} catch (DataNotFoundException | DataNotUniqueException ex) {
  ex.printStackTrace();
}
```

`SqlQuery#collect(Class<T>)` と同様、検索結果の先頭項目を指定したクラスのインスタンスの形で取得することができます。<Badge text="0.25.0+"/>

```java
try (SqlAgent agent = config.agent()) {
  long deptNo = agent.query("department/select_department")
      .one(long.class);
} catch (DataNotFoundException | DataNotUniqueException ex) {
  ex.printStackTrace();
}
```

### 先頭１件取得（`SqlQuery#findOne`)

| メソッド名                    | 戻り値の型                    |
| :---------------------------- | :---------------------------- |
| SqlQuery#findOne()            | Optional<Map<String, Object>> |
| SqlQuery#findOne(CaseFormat)  | Optional<Map<String, Object>> |
| SqlQuery#findOne(Class<T&gt;) | Optional<T&gt;                |

検索結果の1件目をOptionalの形式で取得します。  
検索結果が2件以上存在する場合、`jp.co.future.uroborosql.exception.DataNotUniqueException`をスローします。  
メモリ上には最大1件分のデータしか格納しないため、検索結果が大量になる場合でもメモリ使用量を気にせず呼び出すことができます。

#### `SqlQuery#findOne()` 引数なし

```java
try (SqlAgent agent = config.agent()) {
  Optional<Map<String, Object>> departmentOpt = agent.query("department/select_department")
      .findOne();
} catch (DataNotUniqueException ex) {
  ex.printStackTrace();
}
// 結果(department)
 {"DEPT_NO"=1, "DEPT_NAME"="sales"}
```

#### `SqlQuery#findOne(CaseFormat)` `CaseFormat`指定

引数に`jp.co.future.uroborosql.utils.CaseFormat`を指定することで、Mapのキー名に対する書式を変更することができます。

`CaseFormat.CAMEL_CASE`指定

```java
try (SqlAgent agent = config.agent()) {
  Optional<Map<String, Object>> departmentOpt = agent.query("department/select_department")
      .findOne(CaseFormat.CAMEL_CASE);
} catch (DataNotUniqueException ex) {
  ex.printStackTrace();
}
// 結果(department)
 {"deptNo"=1, "deptName"="sales"}
```

#### `SqlQuery#findOne(Class<T>)` 型指定

引数にクラスを指定すると、検索結果を指定したクラスのOptional型の形で取得することができます。

エンティティクラスを指定した場合

```java
try (SqlAgent agent = config.agent()) {
  Optional<Department> departmentOpt = agent.query("department/select_department")
      .findOne(Department.class);
} catch (DataNotUniqueException ex) {
  ex.printStackTrace();
}
```

`SqlQuery#collect(Class<T>)` と同様、検索結果の先頭項目を指定したクラスのOptionalの形で取得することができます。<Badge text="0.25.0+"/>

```java
try (SqlAgent agent = config.agent()) {
  Optional<Long> deptNoOpt = agent.query("department/select_department")
      .findOne(Long.class);
} catch (DataNotUniqueException ex) {
  ex.printStackTrace();
}
```

### 指定カラムのStream取得(`SqlQuery#select`) <Badge text="0.25.0+"/>

| メソッド名                           | 戻り値の型   |
| :----------------------------------- | :----------- |
| SqlQuery#select(Class<T&gt;)         | Stream<T&gt; |
| SqlQuery#select(String, Class<T&gt;) | Stream<T&gt; |

検索結果のうち、先頭項目、もしくは指定した項目を`java.util.stream.Stream`の形式で取得します。  
Streamによる順次読み込みと終端操作までの遅延処理により、メモリ効率の良い操作が可能になります。

#### `SqlQuery#select(Class<T>)` 項目指定なし（先頭項目）

引数にクラスのみを指定すると、検索結果の先頭項目を指定したクラスのインスタンスの形で取得することができます。  
（引数に指定できる型については `SqlQuery#collect(Class<T>)` を参照）

```java
try (SqlAgent agent = config.agent()) {
  Stream<Long> deptNoStream = agent.query("department/select_department")
      .select(Long.class);
}
```

#### `SqlQuery#select(String, Class<T>)` 項目指定あり

引数に取得する項目名を指定すると、その項目を指定したクラスのインスタンスの形で取得することができます。

```java
try (SqlAgent agent = config.agent()) {
  Stream<String> deptNameStream = agent.query("department/select_department").select("deptName", String.class);
}
```

### Stream取得(`SqlQuery#stream`)

| メソッド名                                | 戻り値の型                  |
| :---------------------------------------- | :-------------------------- |
| SqlQuery#stream()                         | Stream<Map<String, Object>> |
| SqlQuery#stream(CaseFormat)               | Stream<Map<String, Object>> |
| SqlQuery#stream(Class<T&gt;)              | Stream<T&gt;                |
| SqlQuery#stream(ResultSetConverter<T&gt;) | Stream<T&gt;                |

検索結果を`java.util.stream.Stream`の形式で取得します。  
Streamによる順次読み込みと終端操作までの遅延処理により、メモリ効率の良い操作が可能になります。

#### `SqlQuery#stream()` 引数なし

```java
try (SqlAgent agent = config.agent()) {
  agent.query("department/select_department").stream()
    .forEach(System.out::println);
}
// 結果
{"DEPT_NO"=1, "DEPT_NAME"="sales"}
{"DEPT_NO"=2, "DEPT_NAME"="export"}
{"DEPT_NO"=3, "DEPT_NAME"="accounting"}
{"DEPT_NO"=4, "DEPT_NAME"="personnel"}
```

#### `SqlQuery#stream(CaseFormat)` `CaseFormat`指定

引数に`jp.co.future.uroborosql.utils.CaseFormat`を指定することで、Mapのキー名に対する書式を変更することができます。

`CaseFormat.PASCAL_CASE` 指定

```java
try (SqlAgent agent = config.agent()) {
  agent.query("department/select_department").stream(CaseFormat.PASCAL_CASE)
    .forEach(System.out::println);
}
// 結果
{"DeptNo"=1, "DeptName"="sales"}
{"DeptNo"=2, "DeptName"="export"}
{"DeptNo"=3, "DeptName"="accounting"}
{"DeptNo"=4, "DeptName"="personnel"}
```

#### `SqlQuery#stream(Class<T>)` 型指定

引数にクラスを指定すると、検索結果を指定したクラスのインスタンスの形で取得することができます。

エンティティクラスを指定した場合

```java
try (SqlAgent agent = config.agent()) {
  agent.query("department/select_department").stream(Department.class)
    .forEach(System.out::println);
}
```

`SqlQuery#collect(Class<T>)` と同様、検索結果の先頭項目を指定したクラスのインスタンスの形で取得することができます。<Badge text="0.25.0+"/>

```java
try (SqlAgent agent = config.agent()) {
  Stream<Long> deptNoStream = agent.query("department/select_department").stream(Long.class);
}
```

`jp.co.future.uroborosql.converter.ResultSetConverter`インタフェースを実装したクラスを引数に渡すことで、検索結果により複雑な加工を行うことができます。

提供されている `ResultSetConverter` は以下になります。

| クラス                                          | 説明                                                                                                                    |
| :---------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| MapResultSetConverter                           | 検索結果を項目名と値のMapに変換します。項目名はコンストラクタにCaseFormatを指定することで書式を変更することができます。 |
| EntityResultSetConverter                        | 検索結果をエンティティ型のインスタンスに変換します。エンティティ型はコンストラクタで指定します。                        |
| ScalarResultSetConverter <Badge text="1.0.0+"/> | 検索結果のうち、１項目を指定した型のインスタンスに変換します。対象とする項目と変換する型はコンストラクタで指定します。  |

`ResultSetConverter`は`FunctionInterface`として提供されているので、`lambda式`による記述も可能です。

ResultSetConverter指定(lambda式)

```java
try (SqlAgent agent = config.agent()) {
  // ResultSetConverterはlambda式で指定可能
  agent.query("department/select_department").stream(rs -> {
    Map<String, Object> row = new HashMap<>();
    row.put("deptNo", rs.getObject("DEPT_NO"));
    row.put("deptName", rs.getObject("DEPT_NAME"));
    return row;
  }).forEach(System.out::println);
}
// 結果
{"deptNo"=1, "deptName"="sales"}
{"deptNo"=2, "deptName"="export"}
{"deptNo"=3, "deptName"="accounting"}
{"deptNo"=4, "deptName"="personnel"}
```

::: danger 注意
戻り値として取得されるStreamインスタンスは内部にResultSetリソースを保持しています。このResultSetはデータを最後まで読み込むか`Stream#close()`が呼ばれたタイミングでリソースのクローズを行います。(Stream生成時、Stream#onClose()にResultSetリソースの`closeHandler`を登録します)  
そのため、取得したStreamで全データを扱う終端処理(collectなど)を行うか、try-with-resourcesの利用やStream#close()の明示的な呼び出しによるStreamのクローズを行わないとResultSetリソースがクローズされずカーソルのリークが発生します。
:::
::: danger 注意
取得したStreamのクローズより先にSqlAgentインスタンスがクローズ、または破棄された場合、Streamの内部に保持しているResultSetリソースもクローズされてしまい不正な動作となります。StreamインスタンスとそのStreamを生成したSqlAgentインスタンスの生存期間を合わせる、もしくはSqlAgentインスタンスの生存期間を長くしてください。
:::

Streamのクローズ

```java
try (SqlAgent agent = config.agent()) {
  try (Stream<Map<String, Object>> stream = agent.query("department/select_department").stream()) {
    // Stream#findFirst() はStream内のResultSetリソースをクローズしないので、try-with-resourcesでStreamをクローズする
    stream.findFirst().ifPresent(System.out::println);
  }
}
```

### ResultSet取得(`SqlQuery#resultSet`)

| メソッド名           | 戻り値の型 |
| :------------------- | :--------- |
| SqlQuery#resultSet() | ResulitSet |

検索結果を`java.sql.ResultSet`の形式で取得します。

::: danger 注意
ResultSetリソースのクローズは各自で行う必要があります。
:::
::: danger 注意
ResultSetリソースのクローズより先にSqlAgentインスタンスがクローズ、または破棄された場合、ResultSetリソースもクローズされてしまい不正な動作となります。ResultSetリソースとそのResultSetを生成したSqlAgentインスタンスの生存期間を合わせる、もしくはSqlAgentインスタンスの生存期間を長くしてください。
:::

このAPIは他のフレームワークとの連携など、`ResultSet`リソースの取得が必要なケースを想定して提供しています。

::: warning
`ResultSet`リソースの取得が必要でなければ、`ResultSet`リソースのクローズが管理されている他のAPIの利用を検討してください。
:::

```java
try (SqlAgent agent = config.agent()) {
  try (ResultSet rs = agent.query("department/select_department").resultSet()) {
    // try-with-resourcesでResultSetをクローズする
    while (rs.next()) {
      // ResultSetからの値取得
      ・・・
    }
  }
}
```

## SQLによる更新(`SqlAgent#update` /`#updateWith` /`#updateChained`)

DB更新処理(登録/変更/削除)やDDLの実行も検索処理と同様`SQL名`を指定する場合と`SQL文字列`を指定するAPIが提供されています。  
また <Badge text="1.0.5+" vertical="middle"/>から、引数で指定された複数のSQLを単一の通信でまとめてデータベースに発行する `updateChained` APIが提供されています。これにより、ネットワークの往復によるオーバーヘッドを最小限に抑えることが可能です。

| 利用メソッド                                        | 説明                                                                                        |
| :-------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| SqlAgent#update("[SQL名]")                          | [SQL名](./index.md#sql名)で説明した`SQL名`を指定                                            |
| SqlAgent#updateWith("[SQL文字列]")                  | `SQL文字列`を直接指定                                                                       |
| SqlAgent#updateChained("[SQL名1]", "[SQL名2]", ...) | 指定した複数のSQL名に対するSQLをまとめて発行する。 <Badge text="1.0.5+" vertical="middle"/> |

上記メソッドは更新を行うための`SqlUpdate`インタフェースのインスタンスを返却します。

```java
// １件挿入(SQL名指定)
int count = agent.update("department/insert_department")
  .param("deptNo", 1)
  .param("deptName", "Sales")
  .count();

// 更新(SQL文字列指定)
int count = agent.updateWith("update employee set first_name = /*firstName*/ where emp_no = /*empNo*/")
  .param("empNo", 1)
  .param("firstName", "Bob")
  .count();

// 複数SQL名指定
int count = agent.updateChained("department/insert_department", "department/update_department")
  .param("deptNo", 1)
  .param("deptName", "Sales")
  .param("updDeptName", "HR")
  .count();

```

department/insert_department.sql

```sql
insert /* _SQL_ID_ */
into
  department
(
  dept_name
, lock_version
) values (
  /*deptName*/'sample'
,  0
)
```

department/update_department.sql

```sql
update /* _SQL_ID_ */ department
set dept_name =  /*updDeptName*/'sample'
where
dept_name = /*deptName*/
```

`SqlUpdate`インタフェースの主なAPIは以下になります。

### 更新の実行(`SqlUpdate#count`)

| メソッド名        | 戻り値の型 |
| :---------------- | :--------- |
| SqlUpdate#count() | int        |

更新処理を行い、登録、更新、削除を行った行数を返します。

```java
try (SqlAgent agent = config.agent()) {
  // insert
  agent.update("department/insert_department")
    .param("deptNo", 1)
    .param("deptName", "sales")
    .count();
  // update
  agent.update("department/update_department")
    .param("deptNo", 1)
    .param("deptName", "HR")
    .count();
  // delete
  agent.update("department/delete_department")
    .param("deptNo", 1)
    .count();
}
```

::: warning updateChained の利用について
updateChainedメソッドは内部で指定された複数のSQLを1つに結合したうえで一度のDB間通信でまとめてSQLの発行を行います。  
大量のSQL更新があり、都度DB通信することによるオーバーヘッドが問題になる場合に有効です。  
ただし、内部で行われるSQL文の結合処理のオーバーヘッドもあるため、このメソッドを利用する場合は必ず実際に計測して効果があることを確認してください。
:::

::: danger updateChained で返却されるcount() の値

JDBCでは 1つのPreparedStatementで複数のSQLを実行した結果について明確に規定していません。そのため利用するDBによって結果が変わります。  
updateChainedを利用する場合はDB毎にどういう結果が返却されるかを理解したうえでご利用ください。

- H2 / Postgresql / MySQL : `最初のSQL` で登録、更新、削除を行った行数
- SQLServer : `最後のSQL` で登録、更新、削除を行った行数
- Oracle : 1つのPreparedStatementで複数のSQLを発行すると例外が発生

:::

## SQLによるバッチ更新(`SqlBatch#batch` /`#batchWith`)

大量のデータを一括で更新する場合、通常の更新ではSQLが都度実行されるため処理速度が遅く問題になる場合があります。  
こういったケースに対応するため、**uroboroSQL**ではバッチ更新用のAPIを提供しています。

バッチ更新処理も他と同様`SQL名`を指定する場合と`SQL文字列`を直接記述する２つのAPIが提供されています。

| 利用メソッド                      | 説明                                             |
| :-------------------------------- | :----------------------------------------------- |
| SqlAgent#batch("[SQL名]")         | [SQL名](./index.md#sql名)で説明した`SQL名`を指定 |
| SqlAgent#batchWith("[SQL文字列]") | `SQL文字列`を直接指定                            |

上記２つのメソッドはバッチ更新を行うための`SqlBatch`インタフェースのインスタンスを返却します。

::: danger batch/batchWith に指定するSQLの注意点
batch/batchWithの内部では `PreparedStatement` を作成し、渡されたパラメータをバインドしながら `PreparedStatement#executeBatch()` メソッドを呼び出すことでバッチ処理を行っています。  
その際 `PreparedStatement` は、引数で渡されたSQLを**定数パラメータとエスケープキャラクタ置換文字**で評価したSQLを元に生成し、この `PreparedStatement` をバッチ処理が終了するまで利用します。  
そのため、SQLの中に 条件分岐（`/*IF*/` など）や埋め込み文字（`/*# */` など）を記載していると、条件分岐や埋め込み文字をnullで判定したSQLを元に `PreparedStatement` が生成されることになり、意図しない結果になります。  
このことから、バッチ処理で使用するSQLには条件分岐や埋め込み文字を **使用しないようにする必要があります**。

例）  
下記のようなデータを

| id   | name   | age |
| :--- | :----- | :-- |
| null | taro   | 13  |
| 2    | hanako | 15  |
| 3    | jiro   | 10  |

以下のSQLでバッチインサートすると

```sql
insert into person (
/*IF id != null */
  id,
/*END*/
  name,
  age
) values (
/*IF id != null */
/*id*/,
/*END*/
/*name*/,
/*age*/
)
```

１件目のデータ（id=null, name=taro, age=13）を使ってSQLが評価され以下のようになる

```sql
insert into person (
  name,
  age
) values (
/*name*/,
/*age*/
)
```

このSQLでバッチインサートが行われると、2件目、3件目のデータで指定していた `id` の値がDBに格納されなくなります。

:::

`SqlBatch`インタフェースでは、`SqlFluent`インタフェースによるバインドパラメータの設定とは別に`java.util.stream.Stream`を用いたバッチパラメータの設定を行うAPIが提供されています。

| メソッド                                          | 説明                                                                                                                                     |
| :------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------- |
| SqlBatch#paramStream(Stream<Map<String, Object>>) | バインドパラメータや置換文字列として使用するキーと値のセットを`java.util.stream.Stream`で設定する。<Badge text="0.5.0+"/>                |
| SqlBatch#paramStream(Stream<E\>)                  | バインドパラメータや置換文字列として使用するエンティティクラスインスタンスを`java.util.stream.Stream`で設定する。<Badge text="0.10.0+"/> |

### バッチ更新の実行(`SqlBatch#count`)

| メソッド名       | 戻り値の型 |
| :--------------- | :--------- |
| SqlBatch#count() | int        |

バッチ更新処理を行い、登録、更新、削除を行った行数を返します。

バッチ更新

```java
// バッチ処理の実行
int count = agent.batch("department/insert_department")
  // 指定したファイルからMap<String, Object>のStreamを生成し、バッチ処理のパラメータとして指定する
  .paramStream(getDataByFile(Paths.get("data/department.tsv")))
  .count();

・・・

private Stream<Map<String, Object>> getDataByFile(final Path filePath) {
  try {
    final List<String> lines = Files.readAllLines(filePath);
    final String[] header = lines.get(0).split("\\t");
    return lines.stream()
        .skip(1)
        .map(s -> s.split("\\t"))
        .map(data -> IntStream.range(0, header.length)
            .<Map<String, Object>> collect(HashMap::new, (row, i) -> row.put(header[i], data[i]),
                Map::putAll));
  } catch (IOException e) {
    e.printStackTrace();
    throw new UncheckedIOException(e);
  }
}
```

data/department.tsv　の内容

```yaml
deptNo  deptName
1  sales
2  export
3  accounting
4  personnel
```

`paramStream()`メソッドに`SqlQuery#stream()`の結果を指定することで疑似的に`SELECT-INSERT` / `SELECT-UPDATE` / `SELECT-DELETE`を行うことができます。  
Stream APIを利用することで検索結果の件数が多い場合でも、少ないメモリ使用量でバッチ処理を行うことができます。

SELECT-UPDATE

```java
int updateCount = agent.batch("department/update_department")
  .paramStream(agent.query("department/select_department")
    .stream(CaseFormat.LOWER_SNAKE_CASE).map(e -> {
      Map<String, Object> ans = new HashMap<>(e);
      ans.replaceAll((k, v) -> v != null ? v.toString() + "_after" : "after"); // 取得した検索結果の各行の値に "_after" を付与する
      return ans;
    }))
  .count();

```

### バッチSQL実行動作のカスタマイズ

`SqlBatch`インタフェースにはバッチSQL実行時の動作を変更するためのAPIが提供されています。

| メソッド                                                      | 説明                                                                                      | デフォルト値                             |
| :------------------------------------------------------------ | :---------------------------------------------------------------------------------------- | :--------------------------------------- |
| by(BiPredicate<ExecutionContext, Map<String, Object>>)        | バッチSQLの実行条件を指定します。`BiPredicate`の結果がtrueの場合にバッチSQLを実行します。 | 1000件毎                                 |
| batchWhen(BiConsumer<SqlAgent, ExecutionContext>)             | バッチSQLの実行タイミングで行う操作を指定します。                                         | 何もしない                               |
| errorWhen(TriConsumer<SqlAgent, ExecutionContext, Exception>) | バッチSQLの実行時に例外が発生した時の動作を指定します。                                   | `UroborosqlRuntimeException`をスローする |

これらのAPIを利用することでより柔軟なSQL実行が可能になります。

バッチSQL実行時動作のカスタマイズ例

```java
List<Map<String, Object>> inputData = new ArrayList<>();
// 中略　入力データ作成

try (SqlAgent agent = config.agent()) {
  agent.batch("department/insert_department")
    .paramStream(inputData.stream())
    .by((ctx, row) -> ctx.batchCount() == 10)  // 10件毎にSQL実行
    .batchWhen((agent, ctx) -> agent.commit())  // SQL実行が成功したらコミットする
    .errorWhen((agent, ctx, ex) -> {
      log.error("error occured. ex:{}", ex.getMessage());
    })  // 例外が発生したらログ出力する
    .count();
}
```

## ストアドプロシージャの実行(`SqlAgent#proc` /`#procWith`)

**uroboroSQL**では、SQLの検索/更新のほかDBが提供するストアドプロシージャの呼び出し用APIも提供しています。

| 利用メソッド                     | 説明                                             |
| :------------------------------- | :----------------------------------------------- |
| SqlAgent#proc("[SQL名]")         | [SQL名](./index.md#sql名)で説明した`SQL名`を指定 |
| SqlAgent#procWith("[SQL文字列]") | `SQL文字列`を直接指定                            |

上記２つのメソッドはストアドプロシージャの呼出を行うための`Procedure`インタフェースのインスタンスを返却します。

### `Procedure`インタフェース

| メソッド名       | 戻り値の型          |
| :--------------- | :------------------ |
| Procedure#call() | Map<String, Object> |

`Procedure`インタフェースでは、ストアドプロシージャからの戻り値を取得するためのAPIが提供されています。

| メソッド                                            | 説明                                                                                                                                                                                                                                                                                                                                |
| :-------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ProcedureFluent#outParam(String, int)               | ストアドプロシージャからの戻り値として受け取るパラメータを指定します<br>実行したストアドプロシージャ内で指定したキーに設定された値が、戻り値の`Map<String, Object>`に格納されて取得できます。第2引数で受け取る値の型をint型で指定します                                                                                             |
| ProcedureFluent#outParam(String, SQLType)           | ストアドプロシージャからの戻り値として受け取るパラメータを指定します<br>実行したストアドプロシージャ内で指定したキーに設定された値が、戻り値の`Map<String, Object>`に格納されて取得できます。第2引数で受け取る値の型をSQLType型で指定します                                                                                         |
| ProcedureFluent#inOutParam(String, int)             | ストアドプロシージャに渡し、かつ、戻り値として受け取るパラメータを指定します<br>実行したストアドプロシージャ内で指定したキーに設定された値が、戻り値の`Map<String, Object>`に格納されて取得できます。第2引数で受け取る値の型をint型で指定します                                                                                     |
| ProcedureFluent#inOutParam(String, SQLType)         | ストアドプロシージャに渡し、かつ、戻り値として受け取るパラメータを指定します<br>実行したストアドプロシージャ内で指定したキーに設定された値が、戻り値の`Map<String, Object>`に格納されて取得できます。第2引数で受け取る値の型をSQLType型で指定します                                                                                 |
| ProcedureFluent#inOutParamIfAbsent(String, int)     | ストアドプロシージャに渡し、かつ、戻り値として受け取るパラメータを指定します<br>指定したパラメータ名のパラメータが事前に登録されていない場合に値を追加します<br>実行したストアドプロシージャ内で指定したキーに設定された値が、戻り値の`Map<String, Object>`に格納されて取得できます。第2引数で受け取る値の型をint型で指定します     |
| ProcedureFluent#inOutParamIfAbsent(String, SQLType) | ストアドプロシージャに渡し、かつ、戻り値として受け取るパラメータを指定します<br>指定したパラメータ名のパラメータが事前に登録されていない場合に値を追加します<br>実行したストアドプロシージャ内で指定したキーに設定された値が、戻り値の`Map<String, Object>`に格納されて取得できます。第2引数で受け取る値の型をSQLType型で指定します |

```java
// Procedureインタフェースのインスタンスを取得
Map<String, Object> result = agent.procWith("{call product_id_exist_check(/*productId*/, /*checkOut*/)}")
  .param("productId", 0)
  .outParam("checkOut", java.sql.JDBCType.NUMERIC)
  .call();
// outParamメソッドで指定したパラメータの値(戻り値)を取得
BigDecimal checkOut = (BigDecimal)result.get("checkOut");
```

## リトライ(`SqlFluent#retry`)

SQLを実行した際、タイミングによって発生する例外（テーブルロックエラーなど）の場合はリトライを行い、できるだけ正常に処理を終了させたい場合があります。  
uroboroSQLでは、`retry` メソッドにより簡潔で確実なリトライ処理が行えるよう工夫されています。

```java
try (SqlAgent agent = config.agent()) {
  // INSERT文の実行
  // insert into product (product_id) values (/*productId*/0);
  // リトライ対象エラーコードの場合、5回のリトライを20ms間隔で行う
  agent.update("example/insert_product")
    .param("productId", 1)
    .retry(5, 20)
    .count();
}
```
