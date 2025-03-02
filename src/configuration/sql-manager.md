---
head:
  - - meta
    - name: og:title
      content: "SqlManager"
  - - meta
    - name: og:url
      content: "/uroborosql-doc_v0.x/configuration/sql-manager.html"
---

# SqlManager

`SqlManager`はSQLファイルを管理するクラスです。２つのクラスが提供されています。

| クラス            | 説明                                                          |
| :---------------- | :------------------------------------------------------------ |
| SqlManagerImpl    | `java.io`を利用したファイルアクセスを行う`SqlManager`クラス。 |
| NioSqlManagerImpl | `java.nio`を利用したファイルアクセスを行う`SqlManager`クラス  |

クラスの特徴比較

| 特徴                            | SqlManagerImpl | NioSqlManagerImpl | 補足                                          |
| :------------------------------ | :------------: | :---------------: | :-------------------------------------------- |
| SQLファイルルートフォルダ設定   |       〇       |        〇         |                                               |
| SQLファイルエンコーディング設定 |       〇       |        〇         |                                               |
| 起動時のファイルキャッシュ      |       〇       |         △         | NioSqlManagerImplはファイルパスのみキャッシュ |
| 遅延ファイルキャッシュ          |       ×        |        〇         |                                               |
| jarファイル中のSQL参照          |       〇       |        〇         |                                               |
| zipファイル中のSQL参照          |       ×        |        〇         |                                               |
| カスタムファイルアクセス対応    |       ×        |        〇         | `java.nio.file`パッケージを使用               |
| ファイル変更検知                |       ×        |        〇         |
| DB種類毎のファイルパス切り替え  |       ×        |        〇         |

利用用途に応じて`SqlManager`を選択してください。  
SqlManagerクラスの切り替えはビルダーAPIで行うことが出来ます。指定しない場合の初期値は`SqlManagerImpl`になります。

```java
SqlConfig config = UroboroSQL.builder(...)
  // NioSqlManagerの指定
  .setSqlManager(new NioSqlManagerImpl(false)).build();
```

## SQLファイルルートフォルダの設定

**uroboroSQL**は初期設定ではクラスパス上にある`sql`フォルダ配下のSQLを読み込みます。  
このSQLファイルルートフォルダは変更することができます。

SQLファイルルートフォルダの設定 (custom_sqlフォルダを指定)

```java
// SqlManagerImplの場合
SqlConfig config = UroboroSQL.builder(...)
  // SQLファイルのルートフォルダの設定(custom_sqlフォルダをルートフォルダにする場合)
  .setSqlManager(new SqlManagerImpl("custom_sql")).build();

// NioSqlManagerImplの場合
SqlConfig config = UroboroSQL.builder(...)
  // SQLファイルのルートフォルダの設定(custom_sqlフォルダをルートフォルダにする場合)
  .setSqlManager(new NioSqlManagerImpl("custom_sql")).build();
```

### Spring bootでの利用 <Badge text="NioSqlManagerImplのみ" />

#### v0.20.5まで

Spring boot利用時に実行可能jarにSQLファイルをリソースとして含める場合には、NioSqlManagerImplの場合、パスの指定を変更する必要があります。

例えば、`classpath:sql`にSQLファイルを配置している場合は、実行可能jarで起動する際にはアプリケーション設定を利用して `BOOT-INF/classes/sql` のように指定してください。
なお、v0.20.5までのバージョンでは、 `BOOT-INF/lib` 配下のjarに含まれるSQLの読み込みができませんので、v0.21.0以降へのバージョンアップを検討してください。

#### v0.21.0以降

v0.20.5までのように、実行可能jarかどうかで設定を変える必要はありません。  
実行可能jarかどうかに問わず、クラスパス配下のjarのリソースを探索するように変更されているため、
`BOOT-INF/classes` 、 `BOOT-INF/lib` のどちらに含まれているSQLファイルも読み込みが可能です。

## DB種類毎のファイルパス切り替え <Badge text="NioSqlManagerImplのみ" />

後述する[Dialect](./dialect.md#dialect)を利用して、１つのSQL名に対してDB種類毎にファイルパスを切り替えることが出来ます。

以下のようなファイル構成を例として説明します。

```txt
sql
  ├─employee
  │    └─select_employee.sql  -- Oracle, postgresql以外のDB用SQL
  ├─oracle
  │   └─employee
  │        └─select_employee.sql  -- oracle DB用SQL
  └─postgresql
      └─employee
           └─select_employee.sql  -- postgresql DB用SQL
```

SQL名として`employee/select_employee`を指定した場合、  
Oracle DBの場合は`sql/oracle/employee/select_employee.sql`が読み込まれます。  
同様にPostgresql DBの場合は`sql/postgresql/employee/select_employee.sql`が読み込まれます。  
DBに対するDialect用のフォルダがない場合は通常通り`sql/employee/select_employee.sql`が読み込まれます。

DB毎のフォルダ名

| DB名                 | フォルダ名 |
| :------------------- | :--------- |
| H2 DB                | h2         |
| Microsoft SQL Server | mssql      |
| MySQL                | mysql      |
| Oracle               | oracle     |
| Postgresql           | postgresql |
| その他               | default    |

## SQLファイルの更新監視 <Badge text="NioSqlManagerImplのみ" />

`NioSqlManagerImpl`では、最初にSQLファイルの呼び出しがあったタイミングでSQLファイルをロードし、メモリ内にSQLをキャッシュします。
ファイル監視を有効にしている場合はキャッシュしているファイルに対して`java.nio.file.WatchService`を利用したファイル監視を行い、
更新があった場合は自動的にリロードする仕組みを提供しています。

::: warning
ファイル監視を行うのはファイルシステム上のファイルについてのみでjarファイルやzipファイル内のファイルに対してはファイル監視は行いません。
:::

アプリケーションの開発中など頻繁にSQLファイルを更新する場合に有効です。  
ファイル監視の有無は`NioSqlManagerImpl`の設定時に行います。

```java
// NioSqlManagerImplの場合
SqlConfig config = UroboroSQL.builder(...)
  // SQLファイル監視を有効化（初期値はfalse）
  .setSqlManager(new NioSqlManagerImpl(true)).build();
```
