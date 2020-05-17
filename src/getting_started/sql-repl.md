---
meta:
  - name: og:title
    content: 'SQL-REPL'
  - name: og:url
    content: '/uroborosql-doc/getting_started/sql-repl.html'
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

<<<@/src/getting_started/repl/prompt.sh

**REPL**を立ち上げた状態では接続したDB（H2DB メモリDB）には何もない状態なので、まずはテーブルを作成します。
サンプルアプリケーションで利用できるSQLファイルを確認しましょう。

```sh
uroborosql > list[Enter]
```

と入力してください。

<<<@/src/getting_started/repl/list.sh

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

と入力してください。  
今度は`ddl`に一致する`SQL名`の候補が表示されます。

```sh
uroborosql > update d
ddl/create_tables   department/insert_department   department/select_department
```

この状態で`[Tab]`を入力することで候補を選択することが出来ます。  
`ddl/create_tables`を選択して`[Enter]`を入力すると以下のようになります。

```sh
uroborosql > update ddl/create_tables
```

もう一度`[Enter]`を入力するとSQLが実行されます。

<<<@/src/getting_started/repl/create_tables.sql

`ddl/create_tables`が実行され、DBにテーブルが作成されました。

では次に作成されたテーブルの定義情報を確認します。  
テーブル定義情報の確認には`desc`コマンドを使用します。
ここでは`EMPLOYEE`テーブルの定義情報を確認してみましょう。

```sh
uroborosql > desc EMPLOYEE[Enter]
```

<<<@/src/getting_started/repl/desc.sql

EMPLOYEEテーブルの定義情報が表形式で表示されました。

続いて初期データを投入しましょう。

`setup/insert_data`を実行します。

```sh
uroborosql > update setup/insert_data[Enter]
```

<<<@/src/getting_started/repl/insert_data.sql

これでテーブルに初期データが挿入されました。
では、挿入したデータを検索してみましょう。

検索を行う前に、検索を行うSQLの内容を確認してみましょう。  
SQLの内容を確認するには`view`コマンドを使用します。

```sh
uroborosql > view department/select_department[Enter]
```

<<<@/src/getting_started/repl/view.sql

検索を行う場合は`query`コマンドを使用します。
`query`の後に実行する`SQL名`を指定します。

```sh
uroborosql > query department/select_department[Enter]
```

<<<@/src/getting_started/repl/select_department_1.sql

ここではバインドパラメータを指定しなかったため、絞込み条件のないSQLが実行され検索結果として4件のデータが取得できました。

**REPL**では上の結果のように、

- 実行するSQL
- バインドパラメータ
- SQL文の中の評価式とその評価結果
- 検索結果
- 実行時間

が表示されるので、SQLがどういう風に実行され、どういう値が取得できるのかが良く分かるようになっています。

次にバインドパラメータを指定して検索してみましょう。

検索するSQLにどのようなバインドパラメータや条件分岐があるかを確認するには`parse`コマンドを使用します。

```sh
uroborosql > parse department/select_department[Enter]
```

<<<@/src/getting_started/repl/parse.sql

`parse`コマンドの結果は以下のようになります。

- `SQL` : 解析対象のSQL
- `BRANCHES` : 条件分岐
- `BIND_PARAMS` : バインドパラメータ

条件分岐では `BEGIN`のスコープ（{}で囲まれた中）に２つのIF分岐が並んでいることがわかります。  
また、バインドパラメータでは `deptNo`と`deptName`があることがわかります。

`parse`コマンドで確認したバインドパラメータを指定して検索を行います。

```sh
uroborosql > query department/select_department deptNo=1[Enter]
```

<<<@/src/getting_started/repl/select_department_2.sql

`deptNo`に`1`を指定して検索しています。
この時、SQL文の評価式である/\*IF SF.isNotEmpty(deptNo)\*/が`true`となりSQLのwhere句に`dept_no`の条件が追加されバインドパラメータがバインドされます。  
その結果、検索結果は1件になっています。

このように`SQL名`の後ろに`バインドパラメータ名`=`値`という形でバインドパラメータを記述することでバインドパラメータを指定してSQLを実行することができます。

バインドパラメータが複数ある場合は`バインドパラメータ名1`=`値1` `バインドパラメータ名2`=`値2` ... という風に各パラメータの間を空白で区切って指定してください。

- バインドパラメータを複数指定する例

```sh
uroborosql > query department/select_department deptNo=1 deptName=sales[Enter]
```

<<<@/src/getting_started/repl/select_department_3.sql

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

- REPL/repl.properties

```properties
db.url=jdbc:h2:file:./target/db/repldb;
db.user=sa
db.password=

sql.additionalClassPath=${user.home}/.m2/repository/com/h2database/h2/1.4.192/h2-1.4.192.jar
```

| プロパティ名                               | 説明                                                                                                                                                                                                                                                                                                      |
| :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| db.url                                     | DB接続URL                                                                                                                                                                                                                                                                                                 |
| db.schema                                  | DB接続スキーマ                                                                                                                                                                                                                                                                                            |
| db.user                                    | DB接続ユーザ                                                                                                                                                                                                                                                                                              |
| db.password                                | DB接続パスワード                                                                                                                                                                                                                                                                                          |
| sql.loadPath                               | SQLをロードするパス。初期値は`sql`                                                                                                                                                                                                                                                                        |
| sql.encoding                               | SQLファイルのエンコーディング。初期値は`UTF-8`                                                                                                                                                                                                                                                            |
| sql.fileExtension                          | ロードするSQLファイルの拡張子。初期値は`.sql`                                                                                                                                                                                                                                                             |
| sql.detectChanges                          | SQLファイルの変更検知を行うかどうか。初期値は`true`                                                                                                                                                                                                                                                       |
| sql.additionalClassPath                    | **REPL**起動時に起動時クラスパス以外でクラスパスに追加する場所。`;`で区切ることで複数指定可。SQLファイルのルート（sqlフォルダの親フォルダ）をクラスパスに追加することで、自動的にSQLファイルがロードされます。合わせて接続するDBのJDBCドライバを含むJarを指定することで動的にJDBCドライバを読み込みます。 |
| sqlContextFactory.constantClassNames       | SqlContextFactoryに登録する定数クラスを指定。`,`で区切ることで複数指定可。 ex) jp.co.future.uroborosql.context.test.TestConsts                                                                                                                                                                            |
| sqlContextFactory.enumConstantPackageNames | SqlContextFactoryに登録するEnum定数パッケージ名を指定。`,`で区切ることで複数指定可。ex) jp.co.future.uroborosql.context.test                                                                                                                                                                              |

このプロパティファイルを変更することでいろいろなDBに接続することができるようになります。

これまで見てきたように**REPL**を利用することで簡単にSQL実行や動作確認ができるので、SQL開発には欠かせないツールになります。
色々なSQLを記述して**REPL**で試してみてください。

これで *Getting Started* は終了です。

**uroboroSQL**で使用するSQLの文法や基本的な操作については[基本操作](../basics)を参照してください。
