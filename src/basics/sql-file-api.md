---
meta:
  - name: og:title
    content: 'SQLファイルインタフェース'
  - name: og:url
    content: '/uroborosql-doc/basics/sql-file-api.html'
---
# SQLファイルインタフェース

## SQLによる検索(`SqlAgent#query`, `SqlAgent#queryWith`)

SQLを検索する方法は2つあります。

|利用メソッド|説明|
|:---|:----|
|SqlAgent#query("[SQL名]")|[SQL名](./README.md#sql名)で説明した`SQL名`を指定|
|SqlAgent#queryWith("[SQL文字列]")|`SQL文字列`を直接指定|

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
/*IF SF.isNotEmpty(dept_no)*/
and  dept.dept_no  =  /*dept_no*/1
/*END*/
/*IF SF.isNotEmpty(dept_name)*/
and  dept.dept_name  =  /*dept_name*/'sample'
/*END*/
```

### リスト取得(`SqlQuery#collect`)

|メソッド名|戻り値の型|
|:---|:---|
|SqlQuery#collect()|List<Map<String, Object>>|
|SqlQuery#collect(CaseFormat)|List<Map<String, Object>>|
|SqlQuery#collect(Class<T&gt;)|List<Class<T&gt;>|

検索結果をMapやエンティティクラスのListとして取得します。  
Mapには`キー：カラムラベル名`、`値：カラムの値`の形で1行分のデータが格納されます。  

::: warning
`SqlQuery#collect()`では検索結果をすべてメモリ上に格納します。大量データの検索を行う場合は後述の`SqlQuery#strem()`の利用を検討してください。
:::

引数なし

```java
try (SqlAgent agent = config.agent()) {
  List<Map<String, Object>> departments =
    agent.query("department/select_department").collect();
}
// 結果(departments)
[
 {"DEPT_NO"=1, "DEPT_NAME"="sales"},
 {"DEPT_NO"=2, "DEPT_NAME"="export"},
 {"DEPT_NO"=3, "DEPT_NAME"="accounting"},
 {"DEPT_NO"=4, "DEPT_NAME"="personnel"}
]
```

引数に`jp.co.future.uroborosql.utils.CaseFormat`を指定することで、Mapのキー名に対する書式を変更することができます。

`CaseFormat.CAMEL_CASE`指定

```java
try (SqlAgent agent = config.agent()) {
  List<Map<String, Object>> departments =
    agent.query("department/select_department").collect(CaseFormat.CAMEL_CASE);
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
デフォルト`CaseFormat`の設定の詳細は [CaseFormatの初期値設定](../configuration/sql-agent-factory.md#caseformatの初期値設定) を参照してください

引数にエンティティクラスを指定すると、検索結果をMapの代わりにエンティティクラスのインスタンスのListで取得することができます。

エンティティクラス

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
  List<Department> departments =
    agent.query("department/select_department").collect(Department.class);
}
```

### 先頭取得（`SqlQuery#first`)

|メソッド名|戻り値の型|
|:---|:---|
|SqlQuery#first()|Map<String, Object>|
|SqlQuery#first(CaseFormat)|Map<String, Object>|
|SqlQuery#first(Class<T&gt;)|T|

検索結果の1件目を取得します。  
結果を取得できない（検索結果が0件）場合、`jp.co.future.uroborosql.exception.DataNotFoundException`をスローします。

::: tip
メモリ上には最大1件分のデータしか格納しないため、検索結果が大量になる場合でもメモリ使用量を気にせず呼び出すことができます。
:::

引数なし

```java
try (SqlAgent agent = config.agent()) {
  Map<String, Object> department =
    agent.query("department/select_department").first();
} catch (DataNotFoundException ex) {
  ex.printStackTrace();
}

// 結果(department)
 {"DEPT_NO"=1, "DEPT_NAME"="sales"}
```

引数に`jp.co.future.uroborosql.utils.CaseFormat`を指定することで、Mapのキー名に対する書式を変更することができます。

`CaseFormat.CAMEL_CASE`指定

```java
try (SqlAgent agent = config.agent()) {
  Map<String, Object> department =
    agent.query("department/select_department").first(CaseFormat.CAMEL_CASE);
} catch (DataNotFoundException ex) {
  ex.printStackTrace();
}
// 結果(department)
 {"deptNo"=1, "deptName"="sales"}
```

引数にエンティティクラスを指定すると、検索結果をエンティティクラスのインスタンスの形で取得することができます。

エンティティクラス

```java
try (SqlAgent agent = config.agent()) {
  Department department =
    agent.query("department/select_department").first(Department.class);
} catch (DataNotFoundException ex) {
  ex.printStackTrace();
}
```

### 先頭取得（`SqlQuery#findFirst`)

|メソッド名|戻り値の型|
|:---|:---|
|SqlQuery#findFirst()|Optional<Map<String, Object>>|
|SqlQuery#findFirst(CaseFormat)|Optional<Map<String, Object>>|
|SqlQuery#findFirst(Class<T&gt;)|Optional<T&gt;|

検索結果の1件目をOptionalの形式で取得します。  
メモリ上には最大1件分のデータしか格納しないため、検索結果が大量になる場合でもメモリ使用量を気にせず呼び出すことができます。

引数なし

```java
try (SqlAgent agent = config.agent()) {
  Optional<Map<String, Object>> department =
    agent.query("department/select_department").findFirst();
}
// 結果(department)
 {"DEPT_NO"=1, "DEPT_NAME"="sales"}
```

引数に`jp.co.future.uroborosql.utils.CaseFormat`を指定することで、Mapのキー名に対する書式を変更することができます。

`CaseFormat.CAMEL_CASE`指定

```java
try (SqlAgent agent = config.agent()) {
  Optional<Map<String, Object>> department =
    agent.query("department/select_department").findFirst(CaseFormat.CAMEL_CASE);
}
// 結果(department)
 {"deptNo"=1, "deptName"="sales"}
```

引数にエンティティクラスを指定すると、検索結果をエンティティクラスのインスタンスの形で取得することができます。

エンティティクラス

```java
try (SqlAgent agent = config.agent()) {
  Department department =
    agent.query("department/select_department").findFirst(Department.class).orElse(null);
}
```

### Stream取得(`SqlQuery#stream`)

|メソッド名|戻り値の型|
|:---|:---|
|SqlQuery#stream()|Stream<Map<String, Object>>|
|SqlQuery#stream(CaseFormat)|Stream<Map<String, Object>>|
|SqlQuery#stream(Class<T&gt;)|Stream<T&gt;|
|SqlQuery#stream(ResultSetConverter<T&gt;)|Stream<T&gt;|

検索結果を`java.util.stream.Stream`の形式で取得します。  
Streamによる順次読み込みと終端操作までの遅延処理により、メモリ効率の良い操作が可能になります。

引数なし

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

引数に`jp.co.future.uroborosql.utils.CaseFormat`を指定することで、Mapのキー名に対する書式を変更することができます。

CaseFormat.PASCAL_CASE指定

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

引数にエンティティクラスを指定すると、検索結果をエンティティクラスのインスタンスの形で取得することができます。

エンティティクラス

```java
try (SqlAgent agent = config.agent()) {
  agent.query("department/select_department").stream(Department.class)
    .forEach(System.out::println);
}
```

`jp.co.future.uroborosql.converter.ResultSetConverter`インタフェースを実装したクラスを引数に渡すことで、検索結果により複雑な加工を行うことができます。  
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

また、取得したStreamのクローズより先にSqlAgentインスタンスがクローズ、または破棄された場合、Streamの内部に保持しているResultSetリソースもクローズされてしまい不正な動作となります。StreamインスタンスとそのStreamを生成したSqlAgentインスタンスの生存期間を合わせる、もしくはSqlAgentインスタンスの生存期間を長くしてください。
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

|メソッド名|戻り値の型|
|:---|:---|
|SqlQuery#resultSet()|ResulitSet|

検索結果を`java.sql.ResultSet`の形式で取得します。

::: danger 注意
 ResultSetリソースのクローズは各自で行う必要があります。

また、ResultSetリソースのクローズより先にSqlAgentインスタンスがクローズ、または破棄された場合、ResultSetリソースもクローズされてしまい不正な動作となります。ResultSetリソースとそのResultSetを生成したSqlAgentインスタンスの生存期間を合わせる、もしくはSqlAgentインスタンスの生存期間を長くしてください。
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

## SQLによる更新(`SqlAgent#update`, `SqlAgent#updateWith`)

DB更新処理(登録/変更/削除)やDDLの実行も検索処理と同様`SQL名`を指定する場合と`SQL文字列`を指定する２つのAPIが提供されています。

|利用メソッド|説明|
|:---|:----|
|SqlAgent#update("[SQL名]")|[SQL名](./README.md#sql名)で説明した`SQL名`を指定|
|SqlAgent#updateWith("[SQL文字列]")|`SQL文字列`を直接指定|

上記２つのメソッドは更新を行うための`SqlUpdate`インタフェースのインスタンスを返却します。

```java
// １件挿入(SQL名指定)
int count = agent.update("department/insert_department")
  .param("dept_no", 1)
  .param("dept_name", "Sales")
  .count();

// 更新(SQL文字列指定)
int count = agent.updateWith("update employee set first_name = /*first_name*/ where emp_no = /*emp_no*/")
  .param("emp_no", 1)
  .param("first_name", "Bob")
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
  /*dept_name*/'sample'
,  0
)
```

`SqlUpdate`インタフェースの主なAPIは以下になります。

### 更新の実行(`SqlUpdate#count`)

|メソッド名|戻り値の型|
|:---|:---|
|SqlUpdate#count()|int|

更新処理を行い、登録、更新、削除を行った行数を返します。

```java
try (SqlAgent agent = config.agent()) {
  // insert
  agent.update("department/insert_department")
    .param("dept_no", 1)
    .param("dept_name", "sales")
    .count();
  // update
  agent.update("department/update_department")
    .param("dept_no", 1)
    .param("dept_name", "HR")
    .count();
  // delete
  agent.update("department/delete_department")
    .param("dept_no", 1)
    .count();
}
```

## SQLによるバッチ更新(`SqlBatch#batch`, `SqlBatch#batchWith`)

大量のデータを一括で更新する場合、通常の更新ではSQLが都度実行されるため処理速度が遅く問題になる場合があります。  
こういったケースに対応するため、**uroboroSQL**ではバッチ更新用のAPIを提供しています。

バッチ更新処理も他と同様`SQL名`を指定する場合と`SQL文字列`を直接記述する２つのAPIが提供されています。  

|利用メソッド|説明|
|:---|:----|
|SqlAgent#batch("[SQL名]")|[SQL名](./README.md#sql名)で説明した`SQL名`を指定|
|SqlAgent#batchWith("[SQL文字列]")|`SQL文字列`を直接指定|

上記２つのメソッドはバッチ更新を行うための`SqlBatch`インタフェースのインスタンスを返却します。

`SqlBatch`インタフェースでは、`SqlFluent`インタフェースによるバインドパラメータの設定とは別に`java.util.stream.Stream`を用いたバッチパラメータの設定を行うAPIが提供されています。

|メソッド|説明|
|:---|:---|
|SqlBatch#paramStream(Stream<Map<String, Object>>)|バインドパラメータや置換文字列として使用するキーと値のセットを`java.util.stream.Stream`で設定する。<Badge text="0.5.0+"/>|
|SqlBatch#paramStream(Stream<E&gt;)|バインドパラメータや置換文字列として使用するエンティティクラスインスタンスを`java.util.stream.Stream`で設定する。<Badge text="0.10.0+"/>|

### バッチ更新の実行(`SqlBatch#count`)

|メソッド名|戻り値の型|
|:---|:---|
|SqlBatch#count()|int|

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
dept_no  dept_name
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
      ans.replaceAll((k, v) -> v != null ? v.toString() + "_after" : "after");
      return ans;
    }))
  .count();

```

### バッチSQL実行動作のカスタマイズ

`SqlBatch`インタフェースにはバッチSQL実行時の動作を変更するためのAPIが提供されています。

|メソッド|説明|デフォルト値|
|:---|:---|:----|
|by(BiPredicate<SqlContext, Map<String, Object>>)|バッチSQLの実行条件を指定します。`BiPredicate`の結果がtrueの場合にバッチSQLを実行します。|1000件毎|
|batchWhen(BiConsumer<SqlAgent, SqlContext>)|バッチSQLの実行タイミングで行う操作を指定します。|何もしない|
|errorWhen(TriConsumer<SqlAgent, SqlContext, Exception>)|バッチSQLの実行時に例外が発生した時の動作を指定します。|`UroborosqlRuntimeException`をスローする|

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

## プロシージャの実行(`SqlAgent#proc`, `SqlAgent#procWith`)

**uroboroSQL**では、SQLの検索/更新のほかDBが提供するストアドプロシージャの呼び出し用APIも提供しています。

|利用メソッド|説明|
|:---|:----|
|SqlAgent#proc("[SQL名]")|[SQL名](./README.md#sql名)で説明した`SQL名`を指定|
|SqlAgent#procWith("[SQL文字列]")|`SQL文字列`を直接指定|

上記２つのメソッドはストアドプロシージャの呼出を行うための`Procedure`インタフェースのインスタンスを返却します。

### ストアドプロシージャの実行

|メソッド名|戻り値の型|
|:---|:---|
|Procedure#call()|Map<String, Object>|

ストアドプロシージャからの戻り値を取得する場合は　`SqlFluent#outParam()`でパラメータを指定します。  
`SqlFluent#outParam()`で指定したキーと実行したプロシージャ内でそのキーに設定された値が、戻り値の`Map<String, Object>`として取得できます。

```java
// Procedureインタフェースのインスタンスを取得
Map<String, Object> result = agent.procWith("{call product_id_exist_check(/*product_id*/, /*check_out*/)}")
  .param("product_id", 0)
  .outParam("check_out", java.sql.JDBCType.NUMERIC)
  .call();
// outParamメソッドで指定したパラメータの値(戻り値)を取得
BigDecimal checkOut = (BigDecimal)result.get("check_out");
```
