---
meta:
  - name: og:title
    content: '開発者ガイド'
  - name: og:url
    content: '/uroborosql-doc/developer_guide/'
---
# 開発者ガイド

uroboroSQLを開発する人向けのガイドです

## ソースコードの取得

[GitHub](https://github.com/future-architect/uroborosql)からソースをクローンする。

```sh
git clone https://github.com/future-architect/uroborosql.git
```

## ソースのビルド

ビルドには[Apache Maven](https://maven.apache.org/)を利用します。

```sh
mvn compile
```

## テスト

テストは[JUnit](http://junit.org/junit4/)で行います。

```sh
mvn test
```

カバレッジは[Jacoco](http://www.eclemma.org/jacoco/)で確認することができます。

```sh
mvn test jacoco:report
```

target/site/jacoco フォルダにjacocoカバレッジレポートが出力されます。

開発を行う際は、Jadocコメントが正しく記載されているようにしてください。  
javadocプラグインでjavadocを生成し、エラーが出力されないことを確認してください。

```sh
mvn javadoc:javadoc
```

## Mavenローカルリポジトリへのインストール

```sh
mvn install
```

## IDE

### Eclipse

クローンしたフォルダをEclipseの既存Mavenプロジェクトとしてインポートしてください。  
MavenのinitializeフェーズでEclipseプロジェクトの文字コードをUTF-8にする設定が入っているので、インポートが完了すれば開発が始められる状態になります。

### Intellij

Import Project でクローンしたフォルダを指定してください。  
Import project from external model でMavenを選択してください。  
プロジェクトが読み込まれると開発が始められる状態になります。

## Continuous Integration

Continuous Integration(CI)は[Travis CI](https://travis-ci.org/future-architect/uroborosql)で行っています。

CIの状況確認は以下で行います。

- [https://travis-ci.org/future-architect/uroborosql](https://travis-ci.org/future-architect/uroborosql)

また、CIと合わせてカバレッジレポートを[Coveralls](https://coveralls.io/github/future-architect/uroborosql)で公開しています。

- [https://coveralls.io/github/future-architect/uroborosql](https://coveralls.io/github/future-architect/uroborosql)

## Issue Management

IssueとPullRequestはGithubの機能を利用しています。  
コメントは英語で記載をお願いします。（Google翻訳がお勧めです）

- [https://github.com/future-architect/uroborosql/issues](https://github.com/future-architect/uroborosql/issues)
- [https://github.com/future-architect/uroborosql/pulls](https://github.com/future-architect/uroborosql/pulls)
