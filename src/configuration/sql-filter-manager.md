---
head:
  - - meta
    - name: og:title
      content: "SqlFilterManager"
  - - meta
    - name: og:url
      content: "/uroborosql-doc_v0.x/configuration/sql-filter-manager.html"
---

# SqlFilterManager

## SQLフィルター

**uroboroSQL**ではSQLの実行を行う一連の処理の流れの中にいくつかの拡張ポイントを設けており、この拡張ポイントに処理を追加することで、共通的なSQL文の加工や検索結果の記録といった様々な拡張を行うことができるように設計されています。

SQL処理の拡張はSqlFilterインタフェースを実装したクラスを作成し登録することで行います。  
SqlFilterインタフェースには以下のメソッドが定義されています。

| SqlFilterメソッド名 | 説明                                           |
| :------------------ | :--------------------------------------------- |
| initialize          | SqlFilterの初期化を行う                        |
| doTransformSql      | 変換前のSQLに対して加工を行う                  |
| doParameter         | バインドパラメータの加工を行う                 |
| doOutParameter      | ストアドプロシージャのOutParameterの加工を行う |
| doPreparedStatement | PreparedStatementの加工を行う                  |
| doCallableStatement | CallableStatementの加工を行う                  |
| doQuery             | 検索処理結果の加工を行う                       |
| doUpdate            | 更新処理結果の加工を行う                       |
| doBatch             | バッチ処理結果の加工を行う                     |
| doProcedure         | Procedure呼出処理結果の加工を行う              |

**uroboroSQL**には標準でいくつかのSqlFilterの実装が含まれています。

| クラス名                                             | 説明                                                                                                              |
| :--------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| jp.co.future.uroborosql.filter.DebugSqlFilter        | SqlFilterの動作を理解するためのサンプル。各拡張ポイントで呼び出されるメソッドでログを出力します。                 |
| jp.co.future.uroborosql.filter.DumpResultSqlFilter   | 検索結果を表形式でログ出力するSQLフィルター。SqlREPLで使用しています。                                            |
| jp.co.future.uroborosql.filter.WrapContextSqlFilter  | SQL文の前後に文字列を追加するSQLフィルター。ページングや検索件数の上限設定に使用します。                          |
| jp.co.future.uroborosql.filter.SecretColumnSqlFilter | 指定した特定のカラムのみ暗号化を行うSQLフィルター。パスワードや機密情報を暗号化してDBに格納するために使用します。 |
| jp.co.future.uroborosql.filter.AuditLogSqlFilter     | 監査記録を取得するためのSQLフィルター。                                                                           |

SQLフィルターを利用するためには、SqlConfig生成時にSqlFilterManagerの設定を追加して利用するSQLフィルターの登録を行ってください。  
SQLフィルターは複数登録することができます。複数登録した場合は登録した順にSQLフィルターが処理されます。

```java
// create SqlConfig
SqlConfig config = UroboroSQL
  .builder(...)
  // SqlFilterManagerの設定
  .setSqlFilterManager(new SqlFilterManagerImpl()
    // DumpResultSqlFilterの登録
    .addSqlFilter(new DumpResultSqlFilter())
    // WrapContextSqlFilterの登録
    .addSqlFilter(new WrapContextSqlFilter("",
      "LIMIT /*$maxRowCount*/10 OFFSET /*$startRowIndex*/0",
      ".*FOR\\sUPDATE.*"))
  ).build();
```

独自にSqlFilterを作成する場合は、`jp.co.future.uroborosql.filter.AbstractSqlFilter`を継承し、必要に応じてメソッドをオーバーライドしてください。

```java
public class CustomSqlFilter extends AbstractSqlFilter {

    // 途中略

    @Override
    public ResultSet doQuery(SqlContext sqlContext, PreparedStatement preparedStatement, ResultSet resultSet) {
        // フィルター処理の実装
    }
}
```
