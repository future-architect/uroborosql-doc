---
head:
  - - meta
    - name: og:title
      content: "Dialect"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/configuration/dialect.html"
---

# Dialect

複数のDBを対象とするアプリケーションを作成する場合、DB毎のSQL文法の差異を吸収するため
アプリケーションで対象DBを判定し実行するSQLファイルを切り替える、といった対応が必要になります。
**uroboroSQL**では、こういったDB毎のSQL文法の差異に対応するため、`Dialect`という仕組みを提供しています。

::: tip Dialectの自動判別
`Dialect`は接続したDBから取得できる情報を元に自動で判別される為、通常は変更する必要はありません。
:::

現在、標準で以下のDBに対するDialectが提供されています。

| DB名                 | Dialect                                                                                                                                            |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| H2 DB                | [H2Dialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/H2Dialect.java)               |
| Microsoft SQL Server | [MsSqlDialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/MsSqlDialect.java)         |
| MySQL                | [MySqlDialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/MySqlDialect.java)         |
| MariaDB 5            | [MariaDb5Dialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/MariaDb5Dialect.java)   |
| MariaDB 10           | [MariaDb10Dialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/MariaDb10Dialect.java) |
| Oracle10g以下        | [Oracle10Dialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/Oracle10Dialect.java)   |
| Oracle11g            | [Oracle11Dialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/Oracle11Dialect.java)   |
| Oracle12c            | [Oracle12Dialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/Oracle12Dialect.java)   |
| Oracle18c            | [Oracle18Dialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/Oracle18Dialect.java)   |
| Oracle19c            | [Oracle19Dialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/Oracle19Dialect.java)   |
| Oracle21c            | [Oracle21Dialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/Oracle21Dialect.java)   |
| Oracle23ai以上       | [Oracle23Dialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/Oracle23Dialect.java)   |
| Postgresql           | [PostgresqlDialect](https://github.com/future-architect/uroborosql/blob/main/src/main/java/jp/co/future/uroborosql/dialect/PostgresqlDialect.java) |
| その他               | [DefaultDialect](https://github.com/future-architect/uroborosql/blob/master/src/main/java/jp/co/future/uroborosql/dialect/DefaultDialect.java)     |

::: warning
該当するDBが見つからない場合は`DefaultDialect`が適用されます
:::

## カスタムDialectの登録

標準でサポートしている上記のDB以外に接続し、`DefaultDialect`と違う動作をさせたい場合は、対象のDBに対する`Dialect`クラスを作成して**uroboroSQL**に登録する必要があります。

`Dialect`の登録には、Javaの [java.util.ServiceLoader](https://docs.oracle.com/javase/jp/8/docs/api/java/util/ServiceLoader.html)を利用します。

最初に対象のDB（ここではSQLiteとする）に対する`Dialect`クラスを作成します。

```java
package foo.bar.dialect;

public class SqliteDialect extends AbstractDialect {
  /**
   * コンストラクタ
   */
  public SqliteDialect() {
    super();
  }

  @Override
  public String getDatabaseName() {
    return "SQLite";  // 対象DBの製品名を特定するための文字列を返す
  }

  // supportsXXXメソッド、isXXXメソッド、getXXXメソッドを必要に応じて実装
}
```

`Dialect`インタフェースで提供すべきメソッドは以下になります。

| メソッド名                                                                             | 戻り値        | 説明                                                                                         |
| :------------------------------------------------------------------------------------- | :------------ | :------------------------------------------------------------------------------------------- |
| supportsBulkInsert()                                                                   | boolean       | `BULK INSERT`をサポートするかどうか                                                          |
| supportsEntityBulkUpdateOptimisticLock()                                               | boolean       | Entityバルクアップデートでの楽観ロックチェックをサポートしているか                           |
| supportsUpdateChained() <Badge text="1.0.5+"/>                                         | boolean       | 複数SQLを指定された順で1つにつなげて更新処理を実行できるかどうか                             |
| supportsLimitClause()                                                                  | boolean       | `LIMIT`句をサポートするかどうか                                                              |
| supportsOptimizerHints() <Badge text="0.18.0+"/>                                       | boolean       | オプティマイザーヒントをサポートするかどうか                                                 |
| supportsNullValuesOrdering()                                                           | boolean       | `SELECT`句の`ORDER BY`でNULL値の順序を指定できるか（NULLS FIRST/LAST）                       |
| supportsIdentity()                                                                     | boolean       | データベースのIDカラムを使用したID自動採番をサポートしているか                               |
| supportsSequence()                                                                     | boolean       | データベースのシーケンスを使用したID自動採番をサポートしているか                             |
| supportsForUpdate()                                                                    | boolean       | 明示的な行ロックをサポートしているか                                                         |
| supportsForUpdateNoWait()                                                              | boolean       | 明示的な行ロック（待機なし）をサポートしているか                                             |
| supportsForUpdateWait()                                                                | boolean       | 明示的な行ロック（待機あり）をサポートしているか                                             |
| supportsBatchGeneratedKeys() <Badge text="1.0.9+"/>                                    | boolean       | バッチ処理での自動生成キーの取得をサポートしているか                                         |
| needsStrictSqlTypeForNullSetting() <Badge text="1.0.4+"/>                              | boolean       | カラムにNULLを設定する際、カラムの厳密なSQLTypeを指定する必要があるか                        |
| isRemoveTerminator()                                                                   | boolean       | 実行するSQLに記述されている終端文字(`;`)を削除するかどうか                                   |
| isRollbackToSavepointBeforeRetry()                                                     | boolean       | リトライする前に設定したSavepointまでロールバックするかどうか                                |
| getSequenceNextValSql(String sequenceName)                                             | String        | シーケンスを取得するためのSQL文を取得する                                                    |
| getLimitClause(long limit, long offset)                                                | String        | `LIMIT`句（と`OFFSET`句）を取得する                                                          |
| escapeLikePattern(CharSequence pattern)                                                | String        | `LIKE`演算子のパターン文字列をエスケープする                                                 |
| getJavaType(JDBCType jdbcType, String jdbcTypeName)                                    | JavaType      | 引数で渡ってきたJavaTypeを変換したJavaTypeを取得する。（DB固有のJava型変換を行う場合に実装） |
| getJavaType(int jdbcType, String jdbcTypeName)                                         | JavaType      | 引数で渡ってきたJavaTypeを変換したJavaTypeを取得する。（DB固有のJava型変換を行う場合に実装） |
| getDatabaseName()                                                                      | String        | データベースを判別するための文字列を取得する                                                 |
| getDatabaseType()                                                                      | String        | データベースの種別を表す名前を取得する                                                       |
| getEscapeChar()                                                                        | char          | `LIKE`句で指定するエスケープキャラクタを取得する                                             |
| addForUpdateClause(StringBuilder sql, ForUpdateType forUpdateType, int waitSeconds)    | StringBuilder | `FOR UPDATE`句の文字列をSQLに追加する                                                        |
| addOptimizerHints(StringBuilder sql, List&lt;String&gt; hints) <Badge text="0.18.0+"/> | StringBuilder | 引数で渡したSQLにオプティマイザーヒントを付与する                                            |
| getModLiteral(final String dividend, final String divisor) <Badge text="0.17.0+"/>     | StringBuilder | 乗除を行うためのSQL文字列を取得する                                                          |
| getPessimisticLockingErrorCodes() <Badge text="0.18.2+"/>                              | Set\<String\> | 悲観ロックのErrorCode もしくは SqlStateを取得する                                            |

`Dialect`インタフェースのデフォルト実装や`AbstractDialect`クラスを参考に、上記のメソッドのうち変更が必要なメソッドの実装を行ってください。

次に**uroboroSQL**を利用するアプリケーションのクラスパス上に以下のファイル名のファイルを作成します。

```txt
META-INF
  └─services
      └─jp.co.future.uroborosql.dialect.Dialect
```

最後に作成した`jp.co.future.uroborosql.dialect.Dialect`ファイルの中に作成した`Dialect`のクラス名（FQDN名）を記述します。

```md
foo.bar.dialect.SqliteDialect
```

アプリケーションで`jp.co.future.uroborosql.dialect.Dialect`が`ServiceLoader`経由で読み込まれれば登録した`SqliteDialect`が利用可能になります。
