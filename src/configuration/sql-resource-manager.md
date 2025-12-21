---
head:
  - - meta
    - name: og:title
      content: "SqlResourceManager"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/configuration/sql-resource-manager.html"
---

# SqlResourceManager

`SqlResourceManager`はSQLファイルを管理するクラスです。

::: tip クラス名の変更
uroborosql v1.x で SqlManager から SqlResourceManagerにクラス名が変更されました。
:::

SqlResourceManagerの具象クラスとしてSqlResourceManagerImplクラスが提供されています。

| クラス                 | 説明                                                                 |
| :--------------------- | :------------------------------------------------------------------- |
| SqlResourceManagerImpl | `java.nio`を利用したファイルアクセスを行う`SqlResourceManager`クラス |

SqlResourceManagerImplクラスの特徴

- SQLファイルルートフォルダ設定
- SQLファイルエンコーディング設定
- 起動時のファイルパスキャッシュ
- 遅延ファイルキャッシュ
- jarファイル中のSQL参照
- zipファイル中のSQL参照
- カスタムファイルアクセス対応（`java.nio.file`パッケージを使用）
- DB種類毎のファイルパス切り替え

## SQLファイルルートフォルダの設定

**uroboroSQL**は初期設定ではクラスパス上にある`sql`フォルダ配下のSQLを読み込みます。  
このSQLファイルルートフォルダは変更することができます。

SQLファイルルートフォルダの設定 (custom_sqlフォルダを指定)

```java
// SqlResourceManagerImplの場合
SqlConfig config = UroboroSQL.builder(...)
  // SQLファイルのルートフォルダの設定(custom_sqlフォルダをルートフォルダにする場合)
  .setSqlResourceManager(new SqlResourceManagerImpl("custom_sql")).build();
```

## DB種類毎のファイルパス切り替え

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
