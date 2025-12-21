---
head:
  - - meta
    - name: og:title
      content: "事前準備"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/basics/"
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
設定の詳細については[設定](../configuration/index.md)を参照してください。

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

```txt
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
変更方法の詳細は [SQLファイルルートフォルダの設定](../configuration/sql-resource-manager.md#sqlファイルルートフォルダの設定) を参照してください。
:::

### SQL名

SQLファイルの指定する際のファイルパスを`SQL名`といいます。  
上記フォルダ構成の場合、それぞれのSQLファイルは以下のような`SQL名`となります。

| SQLファイルパス（SQLルートフォルダから） | SQL名                        |
| :--------------------------------------- | :--------------------------- |
| department/insert_department.sql         | department/insert_department |
| department/select_department.sql         | department/select_department |
| employee/insert_employee.sql             | employee/insert_employee     |
| employee/select_employee.sql             | employee/select_employee     |

SQLファイルの配置は設定によりカスタマイズが可能です。SQLファイル配置のカスタマイズについては [SQLファイルの解決ルール](../advanced/#sqlファイルの解決ルール) を参照してください。

### 共通API

検索([SqlQuery](https://github.com/future-architect/uroborosql/blob/main/src/main/java/jp/co/future/uroborosql/fluent/SqlQuery.java))、更新([SqlUpdate](https://github.com/future-architect/uroborosql/blob/main/src/main/java/jp/co/future/uroborosql/fluent/SqlUpdate.java))、バッチ更新([SqlBatch](https://github.com/future-architect/uroborosql/blob/main/src/main/java/jp/co/future/uroborosql/fluent/SqlBatch.java))、ストアドプロシージャ実行([Procedure](https://github.com/future-architect/uroborosql/blob/main/src/main/java/jp/co/future/uroborosql/fluent/Procedure.java))を行うクラスは、バインドパラメータや置換文字列の設定を行うためのAPI([SqlFluent](https://github.com/future-architect/uroborosql/blob/main/src/main/java/jp/co/future/uroborosql/fluent/SqlFluent.java))を実装しています。

バインドパラメータや置換文字列の設定はこのAPIを利用して設定を行ってください。  
流れるAPI(Fluent API)を採用しているため、値の設定は連続して行うことができるようになっています。

パラメータ設定例

```java
Map<String, Object> department = agent.query("department/select_department")
  .param("deptNo", 1)
  .param("deptName", "sales")
  .first();
```

| 主なメソッド                                                           | 説明                                                                                   |
| :--------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| <V&gt; SqlFluent#param(String key, V value)                            | バインドパラメータや置換文字列として使用するキーと値のセットを設定する                 |
| <V&gt; SqlFluent#param(String key, V value, SQLType sqlType)           | SQLTypeを指定して値を設定する                                                          |
| <V&gt; SqlFluent#param(String key, V value, int sqlType)               | SQLTypeを表すint型を指定して値を設定する                                               |
| <V&gt; SqlFluent#param(String key, Supplier<V&gt; supplier)            | supplierの評価結果をキーの値としてパラメータに設定する <Badge text="0.10.1+"/>         |
| <V&gt; SqlFluent#paramIfAbsent(String key, V value)                    | 指定したキーがまだ登録されていない場合に値を設定する                                   |
| <V&gt; SqlFluent#paramIfAbsent(String key, V value, SQLType sqlType)   | 指定したキーがまだ登録されていない場合にSQLTypeを指定して値を設定する                  |
| <V&gt; SqlFluent#paramIfAbsent(String key, V value, int sqlType)       | 指定したキーがまだ登録されていない場合にSQLTypeを表すint型を指定して値を設定する       |
| <V&gt; SqlFluent#paramIfNotEmpty(String key, V value)                  | 指定した値が空文字、空配列、空List以外の場合に値を設定する                             |
| <V&gt; SqlFluent#paramIfNotEmpty(String key, V value, SQLType sqlType) | 指定した値が空文字、空配列、空List以外の場合にSQLTypeを指定して値を設定する            |
| <V&gt; SqlFluent#paramIfNotEmpty(String key, V value, int sqlType)     | 指定した値が空文字、空配列、空List以外の場合にSQLTypeを表すint型を指定して値を設定する |
| SqlFluent#paramMap(Map<String, ?&gt; paramMap)                         | 引数のMapのKey/Valueのセットをパラメータに設定する                                     |
| <V&gt; SqlFluent#paramBean(V bean)                                     | 引数として渡されたbeanのフィールド名と値のセットをパラメータに設定する                 |

他にもパラメータの型に応じたパラメータ設定メソッドが提供されています。

::: tip 配列型の指定
DBの種類によっては配列型をサポートしています。（postgresqlなど）  
バインドパラメータで配列型を利用する場合、以下のようにJavaの配列を値としてparamメソッドに渡してください

- Java実装例

```java
agent.query("select_with_array")
  .param("arrayValues", new String[] {"1", "2"})
  .first();
```

- SQL例

```sql
select
  st.val
from sample_table st
where 1 = 1
and st.val = ANY(/*arrayValues*/)
```

:::
