---
meta:
  - name: og:title
    content: 'SqlConfigの生成'
  - name: og:url
    content: '/uroborosql-doc/configuration/'
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

|メソッド名|説明|
|:--|:--|
|builder()|DB接続設定を行っていないビルダーを取得|
|builder(Connection conn)|引数で指定したコネクションでDB接続するビルダーを取得|
|builder(DataSource dataSource)|引数で指定したデータソースを使ってDB接続するビルダーを取得|
|builder(String url, String user, String password)|引数で指定したDB接続情報を元にDB接続するビルダーを取得|
|builder(String url, String user, String password, String schema)|引数で指定したDB接続情報を元にDB接続するビルダーを取得|

上記APIで取得した`UroboroSQL.UroboroSQLBuilder`に対して下記の設定クラスを設定することで、設定変更ができます。

|設定するクラス|説明|
|:--|:--|
|[ConnectionSupplier](./connection-supplier.md#connectionsupplier)|JDBCコネクション提供クラス|
|[SqlContextFactory](./sql-context-factory.md#sqlcontextfactory)|SQLコンテキスト生成クラス|
|[SqlAgentFactory](./sql-agent-factory.md#sqlagentfactory)|SQL実行クラス(`SqlAgent`)生成クラス|
|[SqlManager](./sql-manager.md#sqlmanager)|SQLファイル管理クラス|
|[SqlFilterManager](./sql-filter-manager.md#sqlfiltermanager)|SQLフィルター管理クラス|
|[EntityHandler](./entity-handler.md#entityhandler)|エンティティ処理クラス|
|[Dialect](./dialect.md#dialect)|Database方言を表すクラス|
