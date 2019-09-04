# 環境設定

## ビルドツールの設定

**uroboroSQL**をMavenプロジェクトに組み込むには、**pom.xml**に以下のライブラリ依存関係を追加して下さい。
**uroboroSQL**は[Maven Central Repository](https://search.maven.org/#search%7Cga%7C1%7Curoborosql)で公開されています。

```xml
<dependency>
  <groupId>jp.co.future</groupId>
  <artifactId>uroborosql</artifactId>
  <version>0.13.0</version>
</dependency>
```

**uroboroSQL**でREPLを使用する場合は追加で以下のライブラリ依存関係を追加してください。

```xml
<dependency>
  <groupId>org.jline</groupId>
  <artifactId>jline</artifactId>
  <version>3.11.0</version>
</dependency>
<dependency>
  <groupId>org.fusesource.jansi</groupId>
  <artifactId>jansi</artifactId>
  <version>1.18</version>
</dependency>
```

Gradleプロジェクトの場合は、**build.gradle**のdependencies内に以下のライブラリ依存関係を追加してください。

```groovy
compile group: 'jp.co.future', name: 'uroborosql', version: '0.13.0'
// REPLを使用する場合
compile group: 'org.jline', name: 'jline', version: '3.11.0'
compile group: 'org.fusesource.jansi', name: 'jansi', version: '1.18'
```

::: tip
uroboroSQLを利用するためには、Java8以上の環境が必要です。
:::

## 事前準備

事前準備として、

- Java8 or 11のいずれかのJDKディストリビューション
  - [AdobtOpenJDK](https://adoptopenjdk.net/index.html)
  - [Amazon Corretto](https://aws.amazon.com/jp/corretto/)
  - [Oracle JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [Apache Maven](https://maven.apache.org/download.cgi) のv3.3.1(Java7対応版)以上のバージョン

をインストールしてください。

## サンプルプロジェクトの実行

**uroboroSQL**のサンプルアプリケーションである[uroborosql-sample](https://github.com/future-architect/uroborosql-sample)を使って**uroboroSQL**を動かしてみましょう。

まず始めに[uroborosql-sample](https://github.com/future-architect/uroborosql-sample)から最新のソースコードを取得します。

```sh
git clone https://github.com/future-architect/uroborosql-sample.git
```

取得できたらcloneしたフォルダに移動します。

```sh
cd uroborosql-sample
```

まずはサンプルアプリケーションを実行してみましょう。
サンプルアプリケーションは以下の起動コマンドで実行します。

```sh
mvn -PrunMain
```

これでサンプルアプリケーションが実行されます。  
（初回実行時は必要なライブラリをダウンロードするため時間がかかります）  
アプリケーションの実行ログが出力され、Mavenが正常終了すれば成功です。
色々ログが流れますが、この中で

- DB接続
- テーブル作成と初期データの挿入
- SQLによる検索
- トランザクション
- SQLによる挿入、更新、削除
- バッチ更新

といった一連の処理が実行されています。

## サンプルプロジェクトの構成

ではサンプルアプリケーションの構成を見ていきましょう。

<<<@/docs/getting_started/tree.txt

主要なファイルの説明です

|ファイル|説明|
|:---|:---|
|[Main.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/Main.java)|uroborosql-sampleのメインプログラムです。ここから各サンプルコードの呼び出しを行っています。|
|[SqlFileApiSample.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/SqlFileApiSample.java) / [EntityApiSample.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/EntityApiSample.java)|提供されているAPIの種類毎のサンプルコードです。|
|[Department.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/entity/Department.java) / [Employee.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/entity/Employee.java) / [DeptEmp.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/entity/DeptEmp.java)|テーブル構造を表すエンティティクラスです。サンプルコードの中で使用します。|
|[Gender.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/type/Gender.java)|性別を表すEnumクラスです。サンプルコードの中で使用します。|
|[sqlフォルダ配下のSQL](https://github.com/future-architect/uroborosql-sample/tree/master/src/main/resources/sql)|uroborosqlで実行するSQLファイルです。|
|[dataフォルダ配下のTSV](https://github.com/future-architect/uroborosql-sample/tree/master/src/main/resources/data)|テーブルデータ作成用のTSVファイルです。Mainクラスの中でテーブルへの一括データ投入を行う際のデータとして利用します。|
|[logback.xml](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/resources/logback.xml)|ログ出力設定ファイルです。|
