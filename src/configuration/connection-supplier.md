---
head:
  - - meta
    - name: og:title
      content: "ConnectionSupplier"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/configuration/connection-supplier.html"
---

# ConnectionSupplier

DB接続を行う際のコネクションを提供するクラスです。
標準で以下のクラスが提供されているので用途に応じて使い分けてください。

| クラス名                         | 説明                                                                     |
| :------------------------------- | :----------------------------------------------------------------------- |
| DefaultConnectionSupplierImpl    | コンストラクタで受け取ったコネクションを返すだけのコネクション供給クラス |
| JdbcConnectionSupplierImpl       | JDBCドライバーマネージャを使用したコネクション提供クラス                 |
| DataSourceConnectionSupplierImpl | データソースを使用したコネクション提供クラス                             |

また、[ConnectionSupplier](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/connection/ConnectionSupplier.java)インタフェースを実装した独自のJDBCコネクション提供クラスを利用することもできます。

## ConnectionContext <Badge text="0.19.0+"/>

動的に`SqlAgent`の接続先を切り替える場合は、`SqlConfig#agent(ConnectionContext)`メソッドを使用します。

`ConnectionContext`は、`ConnectionContextBuilder`の下記メソッドを利用して、インスタンスを生成します。

| 戻り値                      | メソッド名                                                    | 説明                                    |
| :-------------------------- | :------------------------------------------------------------ | :-------------------------------------- |
| DataSourceConnectionContext | dataSource()                                                  | DataSourceConnectionContext を生成する. |
| DataSourceConnectionContext | dataSource(String dataSourceName)                             | DataSourceConnectionContext を生成する. |
| JdbcConnectionContext       | jdbc(String url)                                              | JdbcConnectionContext を生成する.       |
| JdbcConnectionContext       | jdbc(String url, String user, String password)                | JdbcConnectionContext を生成する.       |
| JdbcConnectionContext       | jdbc(String url, String user, String password, String schema) | JdbcConnectionContext を生成する.       |

### 実装例

```java
SqlConfig config = UroboroSQL
    .builder()
    .setConnectionSupplier(new JdbcConnectionSupplier("jdbc:h2:mem:mainConnection", "sa", "sa"))
    .build();

try (SqlAgent agent = config.agent()) {
  // using jdbc:h2:mem:mainConnection
  agent.required(() -> {
    ....
  });
}

//-------------------------------------------------------

try (SqlAgent agent = config.agent(ConnectionContextBuilder
				.jdbc("jdbc:h2:mem:subConnection", "sa", "sa"))) {
  // usingjdbc:h2:mem:subConnection
  agent.required(() -> {
    ....
  });
}
```
