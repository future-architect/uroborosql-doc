---
head:
  - - meta
    - name: og:title
      content: "SqlConfigの生成"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/configuration/"
---

# SqlConfigの生成

**uroboroSQL**ではSqlConfigを生成するタイミングで各種の設定を行うことによりライブラリの動作や実行されるSQLを変更することができます。

シンプルな設定

```java
// create SqlConfig H2DBのメモリDBに接続する
SqlConfig config = UroboroSQL
  .builder("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1", "sa", "")
  .build();
```

`UroboroSQL`ビルダー取得API（`UroboroSQL.UroboroSQLBuilder`）

| メソッド名                                                       | 説明                                                       |
| :--------------------------------------------------------------- | :--------------------------------------------------------- |
| builder()                                                        | DB接続設定を行っていないビルダーを取得                     |
| builder(Connection conn)                                         | 引数で指定したコネクションでDB接続するビルダーを取得       |
| builder(DataSource dataSource)                                   | 引数で指定したデータソースを使ってDB接続するビルダーを取得 |
| builder(String url, String user, String password)                | 引数で指定したDB接続情報を元にDB接続するビルダーを取得     |
| builder(String url, String user, String password, String schema) | 引数で指定したDB接続情報を元にDB接続するビルダーを取得     |

上記APIで取得した`UroboroSQL.UroboroSQLBuilder`に対して下記の設定クラスを設定することで、設定変更ができます。

| 設定するクラス                                                                        | 説明                                                                                                                                            |
| :------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| [ConnectionSupplier](./connection-supplier.md#connectionsupplier)                     | JDBCコネクション提供クラス                                                                                                                      |
| [SqlAgentProvider](./sql-agent-provider.md#sqlagentprovider)                          | SQL実行クラス(`SqlAgent`)生成クラス                                                                                                             |
| [ExecutionContextProvider](./execution-context-provider.md#executioncontextprovider)  | SQL実行コンテキスト生成クラス                                                                                                                   |
| [SqlResourceManager](./sql-resource-manager.md#sqlresourcemanager)                    | SQLリソース管理クラス                                                                                                                           |
| [EventListenerHolder](./event-listener-holder.md#eventlistenerholder)                 | イベントリスナ格納クラス                                                                                                                        |
| [Dialect](./dialect.md#dialect)                                                       | Database方言を表すクラス                                                                                                                        |
| [Clock](https://docs.oracle.com/javase/jp/11/docs/api/java.base/java/time/Clock.html) | タイムゾーンを使用して現在の時点、日付および時間へのアクセスを提供するクロック<br>指定しない場合は `Clock.systemDefaultZone()` が設定されます。 |
