---
layout: home
title: uroboroSQL,
hero:
  name: uroboroSQL
  text: '<span style="white-space: nowrap">Java製のシンプルな<wbr>SQL実行ライブラリ</span>'
  image:
    src: https://future-architect.github.io/uroborosql-doc/images/logo.png
    alt: uroboroSQL
  actions:
    - theme: brand
      text: Why uroboroSQL
      link: ./why_uroborosql/
features:
  - title: 2Way-SQL with Coverage
    details: ORマッパー、クエリビルダならJavaコードでカバレッジが取れるのに、2Way-SQLで分岐を使った場合にはカバレッジが取れず本番環境で意図しないSQLが・・・。uroboroSQLではテスト実行時にカバレッジ取得用のログを出力・解析することにより、カバレッジレポートを出力することが可能です。
  - title: REPL搭載
    details: SQLファイルを修正するたびにコンパイルしてテスト実行するのに時間がかかる・・・。他のORマッパーやSQLフレームワークでイライラしていた経験はありませんか？uroboroSQLではREPLを搭載。SQLを修正してすぐにIDE等のコンソールからコマンドでコンパイルなしで実行、即デバッグができます。
  - title: 区分値サポート
    details: 2Way-SQLのライブラリを使用していると、それぞれのSQLで区分値や定数などをいちいちパラメータに指定するのがわずらわしいと思ったことはありませんか？エンタープライズで使われてOSS化したuroboroSQLでは、SQLファイルの中で定数クラスや列挙体を指定することにより、呼び出し時の実装をシンプルにします。
head:
  - - meta
    - name: og:title
      content: "uroboroSQL"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/"
---

![GitHub stars](https://img.shields.io/github/stars/future-architect/uroborosql.svg?style=social&label=Stars)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/jp.co.future/uroborosql/badge.svg?style=plastic)](https://maven-badges.herokuapp.com/maven-central/jp.co.future/uroborosql)
[![Javadocs](https://www.javadoc.io/badge/jp.co.future/uroborosql.svg)](https://www.javadoc.io/doc/jp.co.future/uroborosql)
