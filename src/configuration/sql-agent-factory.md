---
meta:
  - name: og:title
    content: 'SqlAgentFactory'
  - name: og:url
    content: '/uroborosql-doc/configuration/sql-agent-factory.html'
---
# SqlAgentFactory

SQL実行を行うクラスである`SqlAgent`を生成するファクトリクラスです。SQL実行時の挙動を変更するための初期値の設定が行えます。

設定例

```java
SqlConfig config = UroboroSQL.builder(...)
  // SqlAgentFactoryの設定
  .setSqlAgentFactory(new SqlAgentFactoryImpl()
    // JDBCフェッチサイズ
    .setFetchSize(1000)
    // Statementオブジェクトの検索タイムアウト時間(s)
    .setQueryTimeout(10)
    // 例外発生時のログ出力を行うかどうか
    .setOutputExceptionLog(true)
    // SQL_IDの置換文字列
    .setSqlIdKeyName("_SQL_ID_")
    // 検索結果を格納するMapのキー変換に使用するCaseFormatの初期値
    .setDefaultMapKeyCaseFormat(CaseFormat.UPPER_SNAKE_CASE)
    // 複数件挿入時の挿入方法の初期値
    .setDefaultInsertsType(InsertsType.BULK)
    // アプリケーション全体のリトライ設定
    // SQLエラーコードが54,30006のいずれか(Oracleのリソース・ビジー)の場合
    .setSqlRetryCodeList(Arrays.asList("54", "30006"))
    // 最大リトライ回数
    .setDefaultMaxRetryCount(3)
    // リトライ間隔
    .setDefaultSqlRetryWaitTime(10)
    // トランザクション内での更新を強制するかどうか
    .setForceUpdateWithinTransaction(true)
    // 明示的な行ロック時の待機時間(s)デフォルト値
    .setDefaultForUpdateWaitSeconds(10)
    )
  ).build();
```

## フェッチサイズと検索タイムアウト設定

`SqlAgent`で検索処理を行う際、データベースから一度に取得する行数（`fetchSize`）や
検索タイムアウト時間（秒）（`queryTimeout`）の初期値を指定することが出来ます。
指定しない場合`fetchSize`, `queryTimeout`ともに`-1`が設定されます。

```java
SqlConfig config = UroboroSQL.builder(...)
  // SqlAgentFactoryの設定
  .setSqlAgentFactory(new SqlAgentFactoryImpl()
    // JDBCフェッチサイズ
    .setFetchSize(1000)
    // Statementオブジェクトの検索タイムアウト時間(s)
    .setQueryTimeout(10)
  ).build();
```

::: warning 補足
fetchSizeは、[Statement.setFetchSize](https://docs.oracle.com/javase/jp/8/docs/api/java/sql/Statement.html#setFetchSize-int-)に渡される値です。collect/foreachメソッドで返却される結果セットの行数を制限する設定ではありません。
:::

## 例外発生時のログ出力を行うかどうかを設定

SQL実行時にSQL例外が発生した場合に、発生した例外と実行したSQLの詳細情報を出力するかどうかを指定できます。
指定しない場合`false`になります。

```java
SqlConfig config = UroboroSQL.builder(...)
  // SqlAgentFactoryの設定
  .setSqlAgentFactory(new SqlAgentFactoryImpl()
    // 例外発生時のログ出力を行うかどうか
    .setOutputExceptionLog(true)
  ).build();
```

## SQL_IDの置換文字列設定

SQL文に特定の置換文字列をSQLコメントとして記述することで、SQL実行時に実行したSQLの元となるSQLファイルを特定するための
情報（SQL_ID）を埋め込むことが出来ます。SQL_IDを埋め込むことでSQLログやDBのSQL履歴で実行されたSQLの元となるファイルを
特定しやすくなります。  
必要に応じてこの置換文字列は変更することが出来ます。
指定しない場合`_SQL_ID_`になります。

設定例

```java
SqlConfig config = UroboroSQL.builder(...)
  // SqlAgentFactoryの設定
  .setSqlAgentFactory(new SqlAgentFactoryImpl()
    // SQL_IDの置換文字列
    .setSqlIdKeyName("_SQL_ID_")
  ).build();
```

department/select_department.sql

```sql
select /* _SQL_ID_ */  -- _SQL_ID_ がSQLファイルを特定するための情報の埋め込み先となる
  dept.dept_no      as  dept_no
, dept.dept_name    as  dept_name
, dept.lock_version as  lock_version
from
  department  dept
/*BEGIN*/
where
/*IF SF.isNotEmpty(deptNo)*/
and dept.dept_no  = /*deptNo*/1
/*END*/
/*IF SF.isNotEmpty(deptName)*/
and dept.dept_name  = /*deptName*/'sample'
/*END*/
/*END*/
```

SQL実行処理

```java
agent.query("department/select_department")
  .param("deptNo", 1)
  .collect();
```

実行されるSQL

```sql
select /* department/select_department */  -- _SQL_ID_ にSQL名（department/select_department）が設定される
  dept.dept_no      as  dept_no
, dept.dept_name    as  dept_name
, dept.lock_version as  lock_version
from
  department  dept
where
  dept.dept_no  = 1/*deptNo*/
```

## CaseFormatの初期値設定

SQLによる検索で、以下のメソッドを使用して`List<Map<String, Object>>`や`Map<String, Object>`を取得する際、
取得したMapのキー名に対する書式の初期値を指定することが出来ます。
指定しない場合`CaseFormat.UPPER_SNAKE_CASE`になります。

|対象メソッド|戻り値の型|
|:---|:---|
|SqlQuery#collect()|List<Map<String, Object>>|
|SqlQuery#findFirst()|Optional<Map<String, Object>>|
|SqlQuery#first()|Map<String, Object>|
|SqlQuery#stream()|Stream<Map<String, Object>>|

指定しない場合（初期設定：`CaseFormat.UPPER_SNAKE_CASE`）

```java
agent.query("department/select_department").collect();

// 結果(departments) キーがUPPER_SNAKE_CASEとなっている
[
 {"DEPT_NO"=1, "DEPT_NAME"="sales"},
 {"DEPT_NO"=2, "DEPT_NAME"="export"},
 {"DEPT_NO"=3, "DEPT_NAME"="accounting"},
 {"DEPT_NO"=4, "DEPT_NAME"="personnel"}
]
```

`CaseFormat.CAMEL_CASE`を初期値として設定

```java
SqlConfig config = UroboroSQL.builder(...)
  // SqlAgentFactoryの設定
  .setSqlAgentFactory(new SqlAgentFactoryImpl()
    // 検索結果を格納するMapのキー変換に使用するCaseFormatの初期値
    .setDefaultMapKeyCaseFormat(CaseFormat.CAMEL_CASE)
  ).build();
```

```java
agent.query("department/select_department").collect();

// 結果(departments) キーがCAMEL_CASEとなっている
[
 {"deptNo"=1, "deptName"="sales"},
 {"deptNo"=2, "deptName"="export"},
 {"deptNo"=3, "deptName"="accounting"},
 {"deptNo"=4, "deptName"="personnel"}
]
```

## 複数件挿入時の挿入方法の初期値設定

`SqlAgent#inserts()`メソッドで使用する[InsertsType](../basics/entity-api.md#挿入方法（insertstype）の指定)の初期値を設定することが出来ます。
指定しない場合`InsertsType.BULK`になります。

```java
SqlConfig config = UroboroSQL.builder(...)
  // SqlAgentFactoryの設定
  .setSqlAgentFactory(new SqlAgentFactoryImpl()
    // 複数件挿入時の挿入方法の初期値
    .setDefaultInsertsType(InsertsType.BULK)
  ).build();
```



## SQL実行のリトライ

SQLを実行した際、タイミングによって発生する例外（テーブルロックエラーなど）の場合はリトライを行い、
できるだけ正常に処理を終了させたい場合があります。  
通常、このようなケースでは以下のような実装を行います。

```java
String MAX_RETRY_COUNT = 3; // MAX_RETRY_COUNT はアプリケーションで定義された最大リトライ回数の定数とする
SqlConfig config = UroboroSQL.builder(...).build();

int retryCount = 0;
for(;;) {
  try (SqlAgent agent = config.agent()) {
    // INSERT文の実行
    // insert into product (product_id) values (/*product_id*/0);
    agent.update("example/insert_product").param("product_id", 1).count();
    break;
  } catch (UroborosqlSQLException ex) {
    // SQLExceptionが発生した際に行う処理を実装
    int errorCode = ex.getErrorCode();
    if (errorCode == 30006 || errorCode == 54) {// リソース・ビジー(Oracleの場合)
      // リトライ対象エラーコードの場合はリトライカウントをカウントアップしてリトライする
      retryCount++;
      if (retryCount == MAX_RETRY_COUNT) {
        // 最大リトライ回数に達した場合は例外をスローする
        throw ex;
      } else {
        try {
          // 10ms 待機
          Thread.sleep(10);
        } catch (InterruptedException iex) {
          // do nothing
        }
      }
    } else {
      // リトライ対象エラーコード以外はすぐに例外をスローする
      throw ex;
    }
  }
}
```

しかし、上記のようなリトライ処理を個々の実装で行うと、
実装漏れや実装ミス、実装方法の差異（for()の代わりにwhile()を使用するなど）により不具合が発生しやすくなります。  
**uroboroSQL**では、アプリケーション全体のリトライ設定と、全体設定より優先される個別処理でのリトライ用APIの
2種類のAPIを提供することで、より簡潔で確実なリトライ処理が行えるよう工夫されています。  
アプリケーション全体のリトライ設定は`SqlAgentFactory`生成時に行います。

```java
SqlConfig config = UroboroSQL.builder(...)
  // SqlAgentFactoryの設定
  .setSqlAgentFactory(new SqlAgentFactoryImpl()
    // アプリケーション全体のリトライ設定
    // SQLエラーコードが54,30006のいずれか(Oracleのリソース・ビジー)の場合
    .setSqlRetryCodeList(Arrays.asList("54", "30006"))
    // 最大リトライ回数（3回）リトライ
    .setDefaultMaxRetryCount(3)
    // リトライ間隔10ms待機
    .setDefaultSqlRetryWaitTime(10)
  ).build();
```

リトライAPIを用いた実装は次のようになります。

```java
// アプリケーション全体のリトライ設定に従ってリトライを行う。（個別のリトライ指定なし）
try (SqlAgent agent = config.agent()) {
  // INSERT文の実行
  // insert into product (product_id) values (/*product_id*/0);
  agent.update("example/insert_product")
    .param("product_id", 1)
    .count();
}

// 個別にリトライ設定を上書きする（retry()を利用）
try (SqlAgent agent = config.agent()) {
  // INSERT文の実行
  // insert into product (product_id) values (/*product_id*/0);
  // リトライ対象エラーコードの場合、5回のリトライを20ms間隔で行う
  agent.update("example/insert_product")
    .param("product_id", 1)
    .retry(5, 20)
    .count();
}
```

## トランザクション内での更新を強制するかどうか <Badge text="0.14.0+" vertical="middle"/>

::: warning
🚧 準備中
:::

## 明示的な行ロック時の待機時間(s)のデフォルト値設定 <Badge text="0.14.0+" vertical="middle"/>

`SqlEntityQuery#forUpdateWait()`による明示的な行ロックをおこなう場合の待機時間を指定することができます。

```java
SqlConfig config = UroboroSQL.builder(...)
  // SqlAgentFactoryの設定
  .setSqlAgentFactory(new SqlAgentFactoryImpl()
    // 明示的な行ロック時の待機時間(s)デフォルト値
    .setDefaultForUpdateWaitSeconds(10)
    )
  ).build();
```

待機時間の初期値を設定することで`SqlEntityQuery#forUpdateWait()`を発行する際に適用され、
待機時間を都度指定する必要がなくなります。  
`SqlEntityQuery#forUpdateWait(int)`を使って個別に待機時間を指定した場合は個別設定が優先されます。
