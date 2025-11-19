---
head:
  - - meta
    - name: og:title
      content: "uroboroSQLについて"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/about/"
---

# uroboroSQLについて

## GitHub

[https://github.com/future-architect/uroborosql](https://github.com/future-architect/uroborosql)

## リリースノート

| バージョン | リリース日 | 概要                                                                                                                                                                                                    |
| :--------: | :--------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|   v1.0.9   | 2025/11/20 | バグフィックスリリース. SQLServerでDAOインタフェース経由のバッチインサートを行うとJDBCのエラーが発生する不具合の修正                                                                                    |
|   v1.0.8   | 2025/08/19 | 機能拡張リリース. DBコネクションのスキーマ名を固定することでDAO APIの性能改善を行うオプションの追加                                                                                                     |
|   v1.0.7   | 2025/08/05 | 機能拡張リリース. 定数や区分の登録数が多い（数千オーダー）場合にSQL実行に時間がかかる問題を改善。またDBコネクションのスキーマ名やDatabaseMetadataの中の変更されない情報をキャッシュするオプションを追加 |
|   v1.0.5   | 2025/05/04 | 機能拡張リリース. updateChainedメソッド追加                                                                                                                                                             |
|   v1.0.4   | 2025/03/03 | バグフィックスリリース. SQLServerに対してDate型のカラムにnullを指定すると例外が発生する不具合修正                                                                                                       |
|   v1.0.3   | 2024/10/30 | 機能拡張リリース. SqlInfoの内部実装修正（URLの保持）                                                                                                                                                    |
|   v1.0.2   | 2024/10/28 | 機能拡張リリース. ExecutionContext#contextAttrにアクセスするためのAPIをSqlEntityQuery, SqlEntityUpdate, SqlEntityDeleteに追加                                                                           |
|   v1.0.1   | 2024/10/20 | バグフィックスリリース. SqlKindの設定不備修正                                                                                                                                                           |
|   v1.0.0   | 2024/09/26 | uroborosql v1.0.0 メジャーバージョンリリース！                                                                                                                                                          |

See more info. [Github releases](https://github.com/future-architect/uroborosql/releases)
