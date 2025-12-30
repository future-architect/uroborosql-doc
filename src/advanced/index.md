---
head:
  - - meta
    - name: og:title
      content: "高度な操作"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/advanced/"
---

# SQLファイルの解決ルール

## 複数フォルダの指定

sqlフォルダはクラスパスから参照することが出来れば複数指定することが出来ます。

- `src/test/resources`, `src/main/resources` の順にクラスパスに指定されている場合

```txt
src
    ├─main
    │   └─resources
    │       └─sql
    │           ├─department
    │           │    ├─insert_department.sql
    │           │    └─select_department.sql
    │           └─employee
    │                ├─insert_employee.sql
    │                └─select_employee.sql
    └─test
        └─resources
            └─sql
                ├─department
                │    ├─update_department.sql
                │    └─delete_department.sql
                └─employee
                     ├─update_employee.sql
                     └─select_employee.sql
```

::: warning
SQLファイルのパスが重複している場合、クラスパス上で先にあるフォルダのSQLファイルが使用されます。  
:::

上記のフォルダ構成の場合、`src/main/resources/sql/employee/select_employee.sql` と `src/test/resources/sql/employee/select_employee.sql` がともに `employee/select_employee` として解決されますが、クラスパスとして`src/test/resources`が先に指定されているため、`src/test/resources/sql/employee/select_employee.sql`が使用されます。

## jarファイルの指定

SQLファイルはjarの中にリソースとして含めることもできます。  
その場合、リソースのルート直下のsqlフォルダをルートフォルダとした相対パスでSQLファイルを指定することができます。
SQLファイルのルートフォルダ（初期値：sql)は変更することができます。  
変更方法の詳細は [SQLファイルルートフォルダの設定](../configuration/sql-resource-manager.md#sqlファイルルートフォルダの設定) を参照してください。

## DB種類毎のファイルパス切り替え

[Dialect](../configuration/dialect.md#dialect)を利用して、１つのSQL名に対してDB種類毎にファイルパスを切り替えることが出来ます。  
この機能により、接続先のDB種類が複数ある場合に発生するSQL構文の差異を吸収することができます。

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
