---
url: /uroborosql-doc/getting_started/sql-repl.md
---

# SQL-REPL

ここまではJavaアプリケーションから**uroboroSQL**を利用する場合の説明でした。
**uroboroSQL**にはもう一つ特徴的な機能として、SQLを対話しながら実行するための **REPL(Read-Eval-Print Loop)** 機能を提供しています。

今度はこの**REPL**機能を利用してみましょう。

## REPLの利用

**REPL**を起動するためには`jp.co.future.uroborosql.client.SqlREPL`クラスを実行する必要があります。
サンプルアプリケーションで`SqlREPL`クラスを実行するためには以下のコマンドを実行します。

```sh
mvn -PREPL
```

実行すると以下のようにタイトル表示とコマンド説明、設定値の情報が表示され、そのあとコマンド入力状態になります。

```sh
===========================================================
                 _                    ____   ___  _
 _   _ _ __ ___ | |__   ___  _ __ ___/ ___| / _ \| |
| | | | '__/ _ \| '_ \ / _ \| '__/ _ \___ \| | | | |
| |_| | | | (_) | |_) | (_) | | | (_) |__) | |_| | |___
 \__,_|_|  \___/|_.__/ \___/|_|  \___/____/ \__\_\_____|

uroboroSQL SQL REPL ver.1.0.10
===========================================================

Commands :
        query   : execute query from loaded sql file.
                ex1) query [sql file name]<Enter> : Execute SQL without parameter.
                ex2) query [sql file name] param1=val1 param2=val2 ...<Enter> : Execute SQL with the specified parameters.
        update  : execute update from loaded sql file.
                ex1) update [sql file name]<Enter> : Execute SQL without parameter.
                ex2) update [sql file name] param1=val1 param2=val2 ...<Enter> : Execute SQL with the specified parameters.
        view    : view sql file.
                ex) view [sql file name]<Enter> : Show sql file contents.
        list    : list loaded sql files.
                ex1) list<Enter> : Show all loaded sql file(s).
                ex2) list keyword<Enter> : Show loaded sql file(s) filter by keyword.
        history : list command history.
                ex1) history<Enter> : Show all command history.
                ex2) history keyword<Enter> : Show command history filter by keyword.
        driver  : list loaded drivers.
        desc    : describe table.
                ex) desc [table name]<Enter> : Show table description.
        generate: generate sql to access the table.
                ex) generate [select/insert/update/delete] [table name]<Enter> : Show sql to access tables according to keywords.
        parse   : parse sql file.
                ex) parse [sql file name]<Enter> : Parse sql file.
        cls     : clear screen.
        exit    : exit SQL REPL. `CTRL+C` is an alias.
Properties file path:REPL\repl.properties
[Properties]
db.user=sa
db.password=
db.url=jdbc:h2:file:./target/db/repldb;

initialize.
uroborosql >
```

**REPL**を立ち上げた状態では接続したDB（H2DB メモリDB）には何もない状態なので、まずはテーブルを作成します。
サンプルアプリケーションで利用できるSQLファイルを確認しましょう。

```sh
uroborosql > list[Enter]
```

と入力してください。

```sh
uroborosql > list
LIST:
ddl/create_tables
department/insert_department
department/select_department
employee/insert_employee
employee/select_employee
employee/update_employee
relation/insert_dept_emp
relation/select_dept_emp
setup/insert_data
uroborosql >
```

ロード済みのSQLファイルの`SQL名`がわかります。
テーブルを作成するために`ddl/create_tables`を実行します。
`ddl/create_tables`はDDLなので実行するためには`update`コマンドを使用します。

```sh
uroborosql > u[Tab]
```

と入力してください。

```sh
uroborosql > update
```

という風に`u`に一致するコマンドがコード補完されます。
::: tip
**REPL**では`[Tab]`を押下することでコマンドや`SQL名`、バインドパラメータなどが必要に応じでコード補完されます。
:::

続いて

```sh
uroborosql > update d[Tab]
```

と入力してください。\
今度は`ddl`に一致する`SQL名`の候補が表示されます。

```sh
uroborosql > update d
ddl/create_tables   department/insert_department   department/select_department
```

この状態で`[Tab]`を入力することで候補を選択することが出来ます。\
`ddl/create_tables`を選択して`[Enter]`を入力すると以下のようになります。

```sh
uroborosql > update ddl/create_tables
```

もう一度`[Enter]`を入力するとSQLが実行されます。

```sql
uroborosql > update ddl/create_tables
[DEBUG] Executed SQL[
-- employee
drop table if exists employee cascade;
create table employee (
  emp_no number(6) auto_increment
  , first_name varchar(20) not null
  , last_name varchar(20) not null
  , birth_date date not null
  , gender char(1) not null
  , lock_version number(10) not null default 0
  , constraint employee_PKC primary key (emp_no)
) ;
-- dept_emp
drop table if exists dept_emp cascade;
create table dept_emp (
  emp_no number(6) not null
  , dept_no number(4) not null
  , constraint dept_emp_PKC primary key (emp_no,dept_no)
) ;
-- department
drop table if exists department cascade;
create table department (
  dept_no number(4) auto_increment
  , dept_name varchar(100) not null
  , lock_version number(10) not null default 0
  , constraint department_PKC primary key (dept_no)
) ;
comment on table employee is 'employee';
comment on column employee.emp_no is 'emp_no';
comment on column employee.first_name is 'first_name';
comment on column employee.last_name is 'last_name';
comment on column employee.birth_date is 'birth_date';
comment on column employee.gender is 'gender     ''F''emale/''M''ale/''O''ther';
comment on column employee.lock_version is 'lock_version';
comment on table dept_emp is 'dept_emp';
comment on column dept_emp.emp_no is 'emp_no';
comment on column dept_emp.dept_no is 'dept_no';
comment on table department is 'department';
comment on column department.dept_no is 'dept_no';
comment on column department.dept_name is 'dept_name';
comment on column department.lock_version is 'lock_version'
]
[DEBUG] Execute update SQL.
[DEBUG] SQL execution time [ddl/create_tables] : [00:00:00.030]
update sql[ddl/create_tables] end. row count=0
uroborosql >

```

`ddl/create_tables`が実行され、DBにテーブルが作成されました。

では次に作成されたテーブルの定義情報を確認します。\
テーブル定義情報の確認には`desc`コマンドを使用します。
ここでは`EMPLOYEE`テーブルの定義情報を確認してみましょう。

```sh
uroborosql > desc EMPLOYEE[Enter]
```

```sql
uroborosql > desc EMPLOYEE
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
|TABLE_NAME|COLUMN_NAME |TYPE_NAME|COLUMN_SIZE|DECIMAL_DIGITS|IS_NULLABLE|COLUMN_DEF                                                                      |REMARKS                        |
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
|EMPLOYEE  |EMP_NO      |DECIMAL  |          6|             0|NO         |(NEXT VALUE FOR "PUBLIC"."SYSTEM_SEQUENCE_D06A5524_EC18_4835_A536_1F5A372BFC73")|emp_no                         |
|EMPLOYEE  |FIRST_NAME  |VARCHAR  |         20|             0|NO         |                                                                                |first_name                     |
|EMPLOYEE  |LAST_NAME   |VARCHAR  |         20|             0|NO         |                                                                                |last_name                      |
|EMPLOYEE  |BIRTH_DATE  |DATE     |         10|             0|NO         |                                                                                |birth_date                     |
|EMPLOYEE  |GENDER      |CHAR     |          1|             0|NO         |                                                                                |gender        'F'emale/'M'ale/'O'ther|
|EMPLOYEE  |LOCK_VERSION|DECIMAL  |         10|             0|NO         |                                                                               0|lock_version                   |
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
uroborosql >
```

EMPLOYEEテーブルの定義情報が表形式で表示されました。

続いて初期データを投入しましょう。

`setup/insert_data`を実行します。

```sh
uroborosql > update setup/insert_data[Enter]
```

```sql
uroborosql > update setup/insert_data
[DEBUG] Executed SQL[
insert into department (dept_name) values ('sales');
insert into department (dept_name) values ('export');
insert into department (dept_name) values ('accounting');
insert into department (dept_name) values ('personnel');
insert into employee (first_name, last_name, birth_date, gender) values ('Bob', 'Smith', '1970-01-02', 'M');
insert into employee (first_name, last_name, birth_date, gender) values ('Susan', 'Davis', '1969-02-10', 'F');
insert into employee (first_name, last_name, birth_date, gender) values ('John', 'Wilson', '1982-05-08', 'M');
insert into employee (first_name, last_name, birth_date, gender) values ('Sharon', 'Johnson', '1990-01-20', 'F');
insert into employee (first_name, last_name, birth_date, gender) values ('Stephen', 'Taylor', '2003-12-31', 'M');
insert into dept_emp (emp_no, dept_no) values (1, 1);
insert into dept_emp (emp_no, dept_no) values (2, 1);
insert into dept_emp (emp_no, dept_no) values (3, 2);
insert into dept_emp (emp_no, dept_no) values (4, 3);
insert into dept_emp (emp_no, dept_no) values (5, 4)
]
[DEBUG] Execute update SQL.
[DEBUG] SQL execution time [setup/insert_data] : [00:00:00.017]
update sql[setup/insert_data] end. row count=1
uroborosql >
```

これでテーブルに初期データが挿入されました。
では、挿入したデータを検索してみましょう。

検索を行う前に、検索を行うSQLの内容を確認してみましょう。\
SQLの内容を確認するには`view`コマンドを使用します。

```sh
uroborosql > view department/select_department[Enter]
```

```sql
uroborosql > view department/select_department
select /* _SQL_ID_ */
        dept.dept_no            as      dept_no
,       dept.dept_name          as      dept_name
,       dept.lock_version       as      lock_version
from
        department      dept
/*BEGIN*/
where
/*IF SF.isNotEmpty(deptNo)*/
and     dept.dept_no    =       /*deptNo*/1
/*END*/
/*IF SF.isNotEmpty(deptName)*/
and     dept.dept_name  =       /*deptName*/'sample'
/*END*/
/*END*/
uroborosql >
```

検索を行う場合は`query`コマンドを使用します。
`query`の後に実行する`SQL名`を指定します。

```sh
uroborosql > query department/select_department[Enter]
```

```sql
uroborosql > query department/select_department
[DEBUG] Evaluation Expression:[SF.isNotEmpty(deptNo)], Result:[false], Parameter:[deptNo:[null]]
[DEBUG] Evaluation Expression:[SF.isNotEmpty(deptName)], Result:[false], Parameter:[deptName:[null]]
[DEBUG] Executed SQL[
select /* department/select_department */
        dept.dept_no            as      dept_no
,       dept.dept_name          as      dept_name
,       dept.lock_version       as      lock_version
from
        department      dept

]
[DEBUG] Execute search SQL.
[INFO ]
+-------+----------+------------+
|DEPT_NO|DEPT_NAME |LOCK_VERSION|
+-------+----------+------------+
|      1|sales     |           0|
|      2|export    |           0|
|      3|accounting|           0|
|      4|personnel |           0|
+-------+----------+------------+
[DEBUG] SQL execution time [department/select_department] : [00:00:00.078]
query sql[department/select_department] end.
uroborosql >
```

ここではバインドパラメータを指定しなかったため、絞込み条件のないSQLが実行され検索結果として4件のデータが取得できました。

**REPL**では上の結果のように、

* 実行するSQL
* バインドパラメータ
* SQL文の中の評価式とその評価結果
* 検索結果
* 実行時間

が表示されるので、SQLがどういう風に実行され、どういう値が取得できるのかが良く分かるようになっています。

次にバインドパラメータを指定して検索してみましょう。

検索するSQLにどのようなバインドパラメータや条件分岐があるかを確認するには`parse`コマンドを使用します。

```sh
uroborosql > parse department/select_department[Enter]
```

```sql
uroborosql > parse department/select_department
PARSE:

SQL :
select /* _SQL_ID_ */
        dept.dept_no            as      dept_no
,       dept.dept_name          as      dept_name
,       dept.lock_version       as      lock_version
from
        department      dept
/*BEGIN*/
where
/*IF SF.isNotEmpty(deptNo)*/
and     dept.dept_no    =       /*deptNo*/1
/*END*/
/*IF SF.isNotEmpty(deptName)*/
and     dept.dept_name  =       /*deptName*/'sample'
/*END*/
/*END*/

BRANCHES :
        BEGIN {
                IF ( SF.isNotEmpty(deptNo) ) {
                }
                IF ( SF.isNotEmpty(deptName) ) {
                }
        }

BIND_PARAMS :
        deptName
        deptNo
uroborosql >
```

`parse`コマンドの結果は以下のようになります。

* `SQL` : 解析対象のSQL
* `BRANCHES` : 条件分岐
* `BIND_PARAMS` : バインドパラメータ

条件分岐では `BEGIN`のスコープ（{}で囲まれた中）に２つのIF分岐が並んでいることがわかります。\
また、バインドパラメータでは `deptNo`と`deptName`があることがわかります。

`parse`コマンドで確認したバインドパラメータを指定して検索を行います。

```sh
uroborosql > query department/select_department deptNo=1[Enter]
```

```sql
uroborosql > query department/select_department deptNo=1
[DEBUG] Evaluation Expression:[SF.isNotEmpty(deptNo)], Result:[true], Parameter:[deptNo:[1]]
[DEBUG] Evaluation Expression:[SF.isNotEmpty(deptName)], Result:[false], Parameter:[deptName:[null]]
[DEBUG] Executed SQL[
select /* department/select_department */
        dept.dept_no            as      dept_no
,       dept.dept_name          as      dept_name
,       dept.lock_version       as      lock_version
from
        department      dept
where
dept.dept_no    =       ?/*deptNo*/

]
[DEBUG] Set the parameter.[INDEX[1], Parameter name[deptNo], Value[1], Class[Integer]]
[DEBUG] Execute search SQL.
[INFO ]
+-------+---------+------------+
|DEPT_NO|DEPT_NAME|LOCK_VERSION|
+-------+---------+------------+
|      1|sales    |           0|
+-------+---------+------------+
[DEBUG] SQL execution time [department/select_department] : [00:00:00.005]
query sql[department/select_department] end.
uroborosql >
```

`deptNo`に`1`を指定して検索しています。
この時、SQL文の評価式である/\*IF SF.isNotEmpty(deptNo)\*/が`true`となりSQLのwhere句に`dept_no`の条件が追加されバインドパラメータがバインドされます。\
その結果、検索結果は1件になっています。

このように`SQL名`の後ろに`バインドパラメータ名`=`値`という形でバインドパラメータを記述することでバインドパラメータを指定してSQLを実行することができます。

バインドパラメータが複数ある場合は`バインドパラメータ名1`=`値1` `バインドパラメータ名2`=`値2` ... という風に各パラメータの間を空白で区切って指定してください。

* バインドパラメータを複数指定する例

```sh
uroborosql > query department/select_department deptNo=1 deptName=sales[Enter]
```

```sql
uroborosql > query department/select_department deptNo=1 deptName=sales
[DEBUG] Evaluation Expression:[SF.isNotEmpty(deptNo)], Result:[true], Parameter:[deptNo:[1]]
[DEBUG] Evaluation Expression:[SF.isNotEmpty(deptName)], Result:[true], Parameter:[deptName:[{115,97,108,101,115},0,0]]
[DEBUG] Executed SQL[
select /* department/select_department */
        dept.dept_no            as      dept_no
,       dept.dept_name          as      dept_name
,       dept.lock_version       as      lock_version
from
        department      dept
where
dept.dept_no    =       ?/*deptNo*/
and     dept.dept_name  =       ?/*deptName*/

]
[DEBUG] Set the parameter.[INDEX[1], Parameter name[deptNo], Value[1], Class[Integer]]
[DEBUG] Set the parameter.[INDEX[2], Parameter name[deptName], Value[sales], Class[String]]
[DEBUG] Execute search SQL.
[INFO ]
+-------+---------+------------+
|DEPT_NO|DEPT_NAME|LOCK_VERSION|
+-------+---------+------------+
|      1|sales    |           0|
+-------+---------+------------+
[DEBUG] SQL execution time [department/select_department] : [00:00:00.006]
query sql[department/select_department] end.
uroborosql >
```

**REPL**を終了する場合はコマンド`quit`,もしくは`exit`を入力してください。

```sh
uroborosql > quit[Enter]
SQL REPL end.
```

終了メッセージが表示されてREPLが終了します。

**REPL**には他にも以下のコマンドがあります。

| コマンド | 説明                                                                          |
| :------- | :---------------------------------------------------------------------------- |
| query    | 検索SQLを実行します                                                           |
| update   | 更新SQL（insert/update/delete）やDDLを実行します                              |
| view     | SQL名で指定したSQLの内容を表示します                                          |
| list     | 使用可能なSQL名の一覧を表示します                                             |
| history  | 実行したコマンドの履歴を表示します                                            |
| driver   | 使用可能なJDBCドライバーの一覧を表示します                                    |
| desc     | 指定したテーブルの定義情報を表示します                                        |
| generate | 指定したテーブルに対するselect/insert/update/deleteを行うSQLを生成します      |
| parse    | 指定したSQLで使用されているバインドパラメータやIF分岐条件を抽出して表示します |
| cls      | コンソール画面のクリア                                                        |
| exit     | REPLを終了します                                                              |
| help     | 利用できるコマンドの説明を表示します                                          |

## REPLの設定

さて、ここまでREPLの操作を説明してきましたが、DB接続情報やSQLファイルの場所はどこで指定していたのでしょうか。
実は`jp.co.future.uroborosql.client.SqlREPL`を実行する際、引数としてプロパティファイルを指定します。このプロパティファイルにDB接続情報やSQLファイルの場所などREPLを実行するのに必要な情報が記載されています。

pom.xmlのREPL実行部分

```xml
<plugin>
  <groupId>org.codehaus.mojo</groupId>
  <artifactId>exec-maven-plugin</artifactId>
  <executions>
    <execution>
      <id>repl</id>
      <goals>
        <goal>java</goal>
      </goals>
      <configuration>
        <workingDirectory>${basedir}</workingDirectory>
        <mainClass>jp.co.future.uroborosql.client.SqlREPL</mainClass>
        <arguments>
          <argument>REPL/repl.properties</argument>
        </arguments>
      </configuration>
      <phase>process-test-classes</phase>
    </execution>
  </executions>
</plugin>
```

初期設定ではプロパティファイルの場所は`REPL/repl.properties`になっています。

* REPL/repl.properties

```properties
db.url=jdbc:h2:file:./target/db/repldb;
db.user=sa
db.password=

sql.additionalClassPath=${user.home}/.m2/repository/com/h2database/h2/1.4.192/h2-1.4.192.jar
```

| プロパティ名                                      | 説明                                                                                                                                                                                                                                                                                                      |
| :------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| db.url                                            | DB接続URL                                                                                                                                                                                                                                                                                                 |
| db.schema                                         | DB接続スキーマ                                                                                                                                                                                                                                                                                            |
| db.user                                           | DB接続ユーザ                                                                                                                                                                                                                                                                                              |
| db.password                                       | DB接続パスワード                                                                                                                                                                                                                                                                                          |
| sql.loadPath                                      | SQLをロードするパス。初期値は`sql`                                                                                                                                                                                                                                                                        |
| sql.encoding                                      | SQLファイルのエンコーディング。初期値は`UTF-8`                                                                                                                                                                                                                                                            |
| sql.fileExtension                                 | ロードするSQLファイルの拡張子。初期値は`.sql`                                                                                                                                                                                                                                                             |
| sql.detectChanges                                 | SQLファイルの変更検知を行うかどうか。初期値は`true`                                                                                                                                                                                                                                                       |
| sql.additionalClassPath                           | **REPL**起動時に起動時クラスパス以外でクラスパスに追加する場所。`;`で区切ることで複数指定可。SQLファイルのルート（sqlフォルダの親フォルダ）をクラスパスに追加することで、自動的にSQLファイルがロードされます。合わせて接続するDBのJDBCドライバを含むJarを指定することで動的にJDBCドライバを読み込みます。 |
| executionContextProvider.constantClassNames       | ExecutionContextProviderに登録する定数クラスを指定。`,`で区切ることで複数指定可。 ex) jp.co.future.uroborosql.context.test.TestConsts                                                                                                                                                                     |
| executionContextProvider.enumConstantPackageNames | ExecutionContextProviderに登録するEnum定数パッケージ名を指定。`,`で区切ることで複数指定可。ex) jp.co.future.uroborosql.context.test                                                                                                                                                                       |

このプロパティファイルを変更することでいろいろなDBに接続することができるようになります。

これまで見てきたように**REPL**を利用することで簡単にSQL実行や動作確認ができるので、SQL開発には欠かせないツールになります。
色々なSQLを記述して**REPL**で試してみてください。

これで *Getting Started* は終了です。

**uroboroSQL**で使用するSQLの文法や基本的な操作については[基本操作](../basics/index.md)を参照してください。
