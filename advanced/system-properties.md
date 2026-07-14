---
url: /uroborosql-doc/advanced/system-properties.md
---

# システムプロパティ

**uroboroSQL**ではシステムプロパティを指定することで動作を変更することができます。

| プロパティ名                        | 説明                                                                                                                                                                                                                                                 | 初期値                          |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------ |
| uroborosql.sql.coverage             | SQLカバレッジを出力するかどうかのフラグ。`true`の場合はSQLカバレッジを出力します。文字列として`jp.co.future.uroborosql.coverage.CoverageHandler`インタフェースの実装クラスが設定された場合はそのクラスを利用してカバレッジの収集を行います。 | なし                            |
| uroborosql.sql.coverage.file        | 指定されたPATH(ファイル)に SQLカバレッジのCobertura形式のxmlレポートを出力します。                                                                                                                                                                   | ./target/coverage/sql-cover.xml |
| uroborosql.sql.coverage.dir         | 指定されたPATH(フォルダ)にSQLカバレッジのHTMLレポートを出力します。                                                                                                                                                                                  | ./target/coverage/sql           |
| uroborosql.entity.cache.size        | Entityクラス情報のキャッシュサイズを指定します。キャッシュサイズを超えるEntityクラスの読み込みがあった場合は古い情報から破棄されます。                                                                                                           | 30                              |
| uroborosql.use.qualified.table.name | DAOインタフェースで生成するSQLにスキーマ名で修飾したテーブル名を出力(`true`)するか、テーブル名のみを出力(`false`)するかを指定                                                                                                                        | true                            |
