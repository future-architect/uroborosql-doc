---
url: /uroborosql-doc/why_uroborosql.md
---

# uroboroSQLとは

**uroboroSQL**は2Way-SQLが利用可能なJava製のシンプルなSQL実行ライブラリです。

[フューチャーアーキテクト]社内にて、2006-2007年頃に[S2Dao]を参考に開発され、プロジェクトで実際に利用されて現在まで改善が続けられてきました。社内ではWebアプリケーションフレームワークや各種設計開発支援ツールと連携・統合される形で利用されています。

とはいえ、社内で秘伝のタレ化していることは否めず、開発フェーズでは開発パートナーさんからも「ググれない」から使い方がわからないいう声もちらほら。だったらOSS化してしまえということのが公開のきっかけです。

## uroboroSQLを使う理由

JavaからRDBにアクセスするとき、Java標準のJPA(Java Persistence API)の実装である[EclipseLink]、[OpenJPA]はもとより、歴史のあるORMとして[Hibernate]、[MyBatis]、[Spring Data JDBC]といったグローバルで使われているものもありますし、日本でよく使われてきた[S2Dao]、[S2JDBC]、[DBflute]、[Doma]といったものもあります。

こういった数多のDB系ライブラリ・フレームワークの中で解決したい領域もそれぞれですが、**uroboroSQL**は主にSQL中心の設計コンセプトを採用しています。Javaを中心に考えてSQLを組み立てるという思想ではなく、SQLに足りないところをJavaで補うという思想です。

これはエンタープライズシステムにおいて、ORマッパーやクエリビルダでは実装しきれない、hint句による実行計画の指定や分析関数の利用など複雑かつDBプロダクト依存のSQLを使う場合に有効と考えています。

そのため、**uroboroSQL**はSQLは2Way-SQL方式で記述ができるものの、ORMでよくあるエンティティクラスとリレーションをたどって遅延ロードして子エンティティを取得するなどの機能は有していません。（単純なエンティティクラスへのマッピングは提供しています）

その分、エンタープライズで培われたノウハウとして、区分値サポート、リトライ、イベントハンドリングによるカスタマイズなどの機能を充実させています。また、2Way-SQLのIF分岐に対してカバレッジを取れるようにするという、品質視点での機能があるのも特徴です。

それが**uroboroSQL**の最大の関心事なのです。

## Further Reading

[フューチャーアーキテクト]: https://www.future.co.jp/architect/

[S2Dao]: http://s2dao.seasar.org/ja/

[EclipseLink]: https://www.eclipse.org/eclipselink/

[OpenJPA]: http://openjpa.apache.org/

[Hibernate]: https://hibernate.org/

[MyBatis]: http://www.mybatis.org/mybatis-3/ja/index.html

[Spring Data JDBC]: https://spring.io/projects/spring-data-jdbc#overview

[S2JDBC]: http://s2container.seasar.org/2.4/ja/s2jdbc.html

[DBFlute]: http://dbflute.seasar.org/

[Doma]: https://doma.readthedocs.io/en/stable/
