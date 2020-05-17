---
meta:
  - name: og:title
    content: 'uroboroSQLについて'
  - name: og:url
    content: '/uroborosql-doc/about/'
---
# uroboroSQLについて

## GitHub

[https://github.com/future-architect/uroborosql](https://github.com/future-architect/uroborosql)

## リリースノート

| バージョン | リリース日 | 概要                                                                                                                                                              |
| :--------: | :--------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  v0.19.0   | 2020/05/17 | 複数DBへの接続用API追加 / DateTimeApiからString型への変換用ParameterMapper追加 / 一括登録方式の初期値をBULKからBATCHに変更                                        |
|  v0.18.2   | 2020/03/29 | PessimisticLockExceptionの追加                                                                                                                                    |
|  v0.17.1   | 2020/03/16 | バグフィックス (v0.18.1 の修正を v0.17.0へバックポート)                                                                                                           |
|  v0.18.1   | 2020/03/15 | バグフィックス                                                                                                                                                    |
|  v0.18.0   | 2020/03/08 | SqlAgent#savepointScopeメソッド追加 / SqlEntityQuery#selectメソッド, hintメソッド追加 / 式言語としてSpring Expression Language(SpEL)を利用可能に / バグフィックス |
|  v0.17.0   | 2019/12/22 | SqlAgent#truncateメソッドを追加                                                                                                                                   |
|  v0.16.0   | 2019/12/13 | @VersionアノテーションでOptimisticLockSupplierを指定可能に / バグフィックス                                                                                       |
|  v0.15.2   | 2019/12/13 | バグフィックス                                                                                                                                                    |
|  v0.15.1   | 2019/10/16 | バグフィックス                                                                                                                                                    |
|  v0.15.0   | 2019/10/11 | SqlEntityUpdateによる条件指定の複数更新サポート / SqlAgent#updates, SqlAgent#updatesAndReturnの追加による一括更新追加  / バグフィックス                           |
|  v0.14.0   | 2019/09/17 | SqlEntityQueryで悲観ロックのサポート / SqlQuery#one,findOneの追加  / バグフィックス                                                                               |
|  v0.13.0   | 2019/04/26 | REPLで使用しているjLineのバージョンを v2 から v3に変更。また依存関係をオプションに変更 / バグフィックス                                                           |
|  v0.12.1   | 2019/04/12 | バグフィックス                                                                                                                                                    |
|  v0.12.0   | 2019/04/09 | 自動採番カラムを持つエンティティの挿入に対応 / エンティティによる検索で集約関数を提供 / バグフィックス                                                            |
|  v0.11.1   | 2019/03/12 | バグフィックス                                                                                                                                                    |
|  v0.11.0   | 2019/03/11 | エンティティによる検索で抽出条件の指定を可能に                                                                                                                    |
|  v0.10.1   | 2019/02/07 | SqlFluentにsqlIdとparam(String, Supplier)を追加 / バグフィックス                                                                                                  |
|  v0.10.0   | 2019/01/16 | SqlAgent#insertsによる一括INSERT / バグフィックス                                                                                                                 |
|   v0.9.0   | 2019/01/07 | NioSqlManagerのファイル監視を設定可能に / バグフィックス                                                                                                          |
|   v0.8.2   | 2018/05/26 | バグフィックス                                                                                                                                                    |
|   v0.8.1   | 2018/04/26 | バグフィックス                                                                                                                                                    |
|   v0.8.0   | 2018/04/16 | DialectによるDB製品対応 / CLOB/BLOB対応 / NioSqlMager追加 / etc.                                                                                                  |
|   v0.7.0   | 2018/03/10 | バグフィックス                                                                                                                                                    |
|   v0.6.1   | 2018/02/05 | バグフィックス                                                                                                                                                    |
|   v0.6.0   | 2018/01/31 | 自動パラメータバインド関数 API追加　/ バグフィックス                                                                                                              |
|   v0.5.0   | 2017/12/13 | Stream batch API追加　/ SQL内の不要なカンマの除去                                                                                                                 |
|   v0.4.0   | 2017/11/17 | UroboroSQL ビルダーAPI追加 / CaseFormat初期値設定の追加 / etc.                                                                                                    |
|   v0.3.3   | 2017/10/31 | バグフィックス                                                                                                                                                    |
|   v0.3.2   | 2017/10/10 | バグフィックス                                                                                                                                                    |
|   v0.3.1   | 2017/10/02 | バグフィックス                                                                                                                                                    |
|   v0.3.0   | 2017/09/08 | リファクタリング API                                                                                                                                              |
|   v0.2.0   | 2017/05/26 | カバレッジレポート拡張　/ SQL-REPL機能拡張 / ORMapper API　追加                                                                                                   |
|   v0.1.0   | 2017/03/09 | 初版リリース                                                                                                                                                      |

See more info. [Github releases](https://github.com/future-architect/uroborosql/releases)
