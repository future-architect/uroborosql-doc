---
head:
  - - meta
    - name: og:title
      content: "環境設定"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/getting_started/"
---

# 環境設定

## ビルドツールの設定

**uroboroSQL**をMavenプロジェクトに組み込むには、**pom.xml**に以下のライブラリ依存関係を追加してください。
**uroboroSQL**は[Maven Central Repository](https://central.sonatype.com/artifact/jp.co.future/uroborosql)で公開されています。

```xml
<dependency>
  <groupId>jp.co.future</groupId>
  <artifactId>uroborosql</artifactId>
  <version>1.0.10</version>
</dependency>
```

また、<Badge text="0.18.0+" vertical="middle" /> より式言語ライブラリの選択が可能になりました。  
以下の2つのライブラリのうち、どちらかを選択してライブラリ依存関係に追加して下さい。

[Spring Expression Language(SpEL)](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#expressions)を利用する場合 <Badge text="推奨" vertical="middle"/>

```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-expression</artifactId>
  <version>5.3.24</version>
</dependency>
```

[OGNL](https://github.com/jkuhnert/ognl)を利用する場合

```xml
<dependency>
  <groupId>ognl</groupId>
  <artifactId>ognl</artifactId>
  <version>3.3.4</version>
</dependency>
```

**uroboroSQL**でREPLを使用する場合は追加で以下のライブラリ依存関係を追加してください。

```xml
<dependency>
  <groupId>org.jline</groupId>
  <artifactId>jline</artifactId>
  <version>3.21.0</version>
</dependency>
<dependency>
  <groupId>org.fusesource.jansi</groupId>
  <artifactId>jansi</artifactId>
  <version>2.4.0</version>
</dependency>
```

Gradleプロジェクトの場合は、**build.gradle**のdependencies内に以下のライブラリ依存関係を追加してください。

```groovy
compile group: 'jp.co.future', name: 'uroborosql', version: '1.0.10'

// 式言語ライブラリとしてSpring Expression Language(SpEL)を使用する場合
compile group: 'org.springframework', name: 'spring-expression', version: '5.3.24'
// 式言語ライブラリとしてOGNLを使用する場合
compile group: 'ognl', name: 'ognl', version: '3.3.4'

// REPLを使用する場合
compile group: 'org.jline', name: 'jline', version: '3.21.0'
compile group: 'org.fusesource.jansi', name: 'jansi', version: '2.4.0'
```

::: tip
uroboroSQLを利用するためには、Java11以上の環境が必要です。
:::

## 事前準備

事前準備として、

- Java11以上のJDKディストリビューション
  - [Eclipse Temurin](https://adoptium.net/temurin/releases/)
  - [AdoptOpenJDK](https://adoptopenjdk.net/index.html)
  - [Amazon Corretto](https://aws.amazon.com/jp/corretto/)
  - [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
- [Apache Maven](https://maven.apache.org/download.cgi) のv3.3.1以上のバージョン

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

<<< ./tree.txt

主要なファイルの説明です

| ファイル                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 説明                                                                                                                |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| [Main.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/Main.java)                                                                                                                                                                                                                                                                                                                                | uroborosql-sampleのメインプログラムです。ここから各サンプルコードの呼び出しを行っています。                         |
| [SqlFileApiSample.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/SqlFileApiSample.java) / [EntityApiSample.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/EntityApiSample.java)                                                                                                                                          | 提供されているAPIの種類毎のサンプルコードです。                                                                     |
| [Department.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/entity/Department.java) / [Employee.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/entity/Employee.java) / [DeptEmp.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/entity/DeptEmp.java) | テーブル構造を表すエンティティクラスです。サンプルコードの中で使用します。                                          |
| [Gender.java](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/java/jp/co/future/uroborosql/sample/type/Gender.java)                                                                                                                                                                                                                                                                                                                       | 性別を表すEnumクラスです。サンプルコードの中で使用します。                                                          |
| [sqlフォルダ配下のSQL](https://github.com/future-architect/uroborosql-sample/tree/master/src/main/resources/sql)                                                                                                                                                                                                                                                                                                                                                     | uroborosqlで実行するSQLファイルです。                                                                               |
| [dataフォルダ配下のTSV](https://github.com/future-architect/uroborosql-sample/tree/master/src/main/resources/data)                                                                                                                                                                                                                                                                                                                                                   | テーブルデータ作成用のTSVファイルです。Mainクラスの中でテーブルへの一括データ投入を行う際のデータとして利用します。 |
| [logback.xml](https://github.com/future-architect/uroborosql-sample/blob/master/src/main/resources/logback.xml)                                                                                                                                                                                                                                                                                                                                                      | ログ出力設定ファイルです。                                                                                          |
