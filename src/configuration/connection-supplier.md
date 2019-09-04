# ConnectionSupplier

DB接続を行う際のコネクションを提供するクラスです。
標準で以下のクラスが提供されているので用途に応じて使い分けてください。

|クラス名|説明|
|:--|:--|
|DefaultConnectionSupplierImpl|コンストラクタで受け取ったコネクションを返すだけのコネクション供給クラス|
|JdbcConnectionSupplierImpl|JDBCドライバーマネージャを使用したコネクション提供クラス|
|DataSourceConnectionSupplierImpl|データソースを使用したコネクション提供クラス|

また、[ConnectionSupplier](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/connection/ConnectionSupplier.java)インタフェースを実装した独自のJDBCコネクション提供クラスを利用することもできます。
