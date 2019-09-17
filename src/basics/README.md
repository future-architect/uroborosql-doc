---
meta:
  - name: og:title
    content: '事前準備'
  - name: og:url
    content: '/uroborosql-doc/basics/'
---
# 事前準備

**uroboroSQL**を利用した基本的なDB操作を説明します。

## DB接続

まず最初にSQLを実行するDBへの接続を行います。  
DBに接続するためには`SqlConfig`インタフェースのインスタンスを生成する必要があります。

`SqlConfig`インスタンスは`UroboroSQL`クラスのビルダーメソッドを使用して生成します。

```java
// JDBC接続を行うSqlConfigの生成
// SqlConfig config = UroboroSQL.builder(url, user, password).build();
SqlConfig config = UroboroSQL.builder("jdbc:h2:mem:uroborosql", "sa", "").build();

// DataSourceを使用したDB接続を行うSqlConfigの生成
// SqlConfig config = UroboroSQL.builder(datasource).build();
Context context = new InitialContext();
DataSource dataSource = context.lookup("java:comp/env/jdbc/datasource");
SqlConfig config = UroboroSQL.builder(dataSource).build();

```

`UroboroSQL`クラスを使って`SqlConfig`インスタンスを生成する際、**uroboroSQL**の挙動を変更する各種の設定も合わせて行うことができます。  
設定の詳細については[設定](../configuration)を参照してください。

::: warning
`SqlConfig`インスタンスはアプリケーション内で接続先毎に１つ保持するようにしてください。
SQL実行の都度生成すると、不要なインスタンスの生成やSQLロード処理が実行されます。
:::

## SqlAgentインスタンスの取得

次にすべての操作の基点となる`SqlAgent`インタフェースのインスタンスを取得します。

```java
try (SqlAgent agent = config.agent()) {
  // この中でSQLの操作を行う
}
```

SQLの操作はすべてこの`SqlAgent`インスタンスを使って行うことになります。

::: tip
`SqlAgent`インタフェースは`java.lang.AutoClosable`インタフェースを実装しており、`try-with-resources`で記述することで終了時に自動的にclose処理が呼び出され、中で保持しているConnectionやPreparedStatementなどのリソースオブジェクトも正しくクローズされます。
:::

## SQLファイルの配置

**uroboroSQL**ではSQL文の書かれたファイルのパスを指定してSQLを実行することができます。  
その際、SQLファイルはクラスパスから参照できる場所に配置されている必要があります。  

```md
src
    └─main
        └─resources
            └─sql
                ├─department
                │    ├─insert_department.sql
                │    └─select_department.sql
                └─employee
                     ├─insert_employee.sql
                     └─select_employee.sql
```

上のようなフォルダ構成の場合で、`src/main/resources/`をクラスパスに指定すれば、
その下の`sql`フォルダをルートフォルダとした相対パスでSQLファイルを指定することができます。

::: tip
SQLファイルのルートフォルダ（初期値：`sql`)は変更することができます。  
変更方法の詳細は [SQLファイルルートフォルダの設定](../configuration/sql-manager.md#sqlファイルルートフォルダの設定) を参照してください。
:::

### SQL名

SQLファイルの指定する際のファイルパスを`SQL名`といいます。  
上記フォルダ構成の場合、それぞれのSQLファイルは以下のような`SQL名`となります。

|SQLファイルパス（SQLルートフォルダから）|SQL名|
|:---|:---|
|department/insert_department.sql|department/insert_department|
|department/select_department.sql|department/select_department|
|employee/insert_employee.sql|employee/insert_employee|
|employee/select_employee.sql|employee/select_employee|

SQLファイルの配置は設定によりカスタマイズが可能です。SQLファイル配置のカスタマイズについては [SQLファイルの解決ルール](../advanced/#sqlファイルの解決ルール) を参照してください。

### 共通API

検索([SqlQuery](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/fluent/SqlQuery.java))、更新([SqlUpdate](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/fluent/SqlUpdate.java))、バッチ更新([SqlBatch](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/fluent/SqlBatch.java))、プロシージャ実行([Procedure](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/fluent/Procedure.java))を行うクラスは、バインドパラメータや置換文字列の設定を行うためのAPI([SqlFluent](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/fluent/SqlFluent.java))を実装しています。

バインドパラメータや置換文字列の設定はこのAPIを利用して設定を行ってください。  
流れるAPI(Fluent API)を採用しているため、値の設定は連続して行うことができるようになっています。

パラメータ設定例

```java
Map<String, Object> department = agent.query("department/select_department")
  .param("dept_no", 1)
  .param("dept_name", "sales")
  .first();
```

|主なメソッド|説明|
|:---|:---|
|SqlFluent#param(String key, Object value)|バインドパラメータや置換文字列として使用するキーと値のセットを設定する|
|SqlFluent#param(String key, Supplier<Object&gt; supplier)|supplierの評価結果をキーの値としてパラメータに設定する <Badge text="0.10.1+"/>|
|~~SqlFluent#paramList(String key, Object... value)~~|IN句のバインドパラメータに使用するキーと値のセットを設定する。<br><Badge text="0.14.0+" /> から非推奨。かわりに`param()`に`Arrays.asList()`もしくは`List.of()`を使って`List型`に詰めて設定する|
|SqlFluent#paramMap(Map<String, ?&gt; paramMap)|引数のMapのKey/Valueのセットをパラメータに設定する|
|SqlFluent#paramBean(Object bean)|引数として渡されたObjectのフィールド名と値のセットをパラメータに設定する|

他にもパラメータの型に応じたパラメータ設定メソッドが提供されています。
