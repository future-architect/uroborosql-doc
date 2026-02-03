---
url: /uroborosql-doc/basics/transaction.md
---

# トランザクション

**uroboroSQL**ではローカルトランザクションを提供します。\
トランザクションを利用することで、エラー発生時でも一部のデータだけ登録を成功させるといった細かな制御ができるようになります。

## トランザクションの開始と終了 ( `SqlAgent#required` /`#requiredNew` /`#notSupported` )

**uroboroSQL**で提供するトランザクションのレベルは以下の3つです

| トランザクションタイプ | トランザクション有り                                                                                                                                 | トランザクションなし                       |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------- |
| required               | トランザクション内で処理を実行                                                                                                                       | 新たなトランザクションを開始して処理を実行 |
| requiresNew            | 既存のトランザクションを停止し、新たなトランザクションを開始して処理を実行。トランザクションが終了すると停止していたトランザクションを再開させる | 新たなトランザクションを開始して処理を実行 |
| notSupported           | 既存のトランザクションを停止し、トランザクション外で処理を実行。処理が終了すると停止していたトランザクションを再開させる                         | トランザクション外で処理を実行             |

`SqlAgent`インタフェースにトランザクションタイプに応じたメソッドが提供されており、そのメソッドを呼び出すことでトランザクションの開始と終了を制御します。

```java
agent.required(() -> {
  // トランザクション開始
  agent.updateWith("insert into employee (emp_no) values (/*empNo*/1001)")
    .param("empNo", 1)
    .count();

  agent.requiresNew(() -> {
    // 新しい トランザクション開始
    agent.updateWith("insert into department (dept_no, dept_name) values (/*deptNo*/1111, /*deptName*/'Sales')")
      .param("deptNo", 2)
      .param("deptName", "export")
      .count();
    // 新しい トランザクション終了 commit
  });
  // トランザクション終了 commit
});
```

::: tip
設定によりDB更新処理の実行をトランザクション内で行うことを強制することができます。詳しくは
[DB更新処理をトランザクション内のみに強制](../configuration/sql-agent-provider.md#db更新処理をトランザクション内のみに強制)を参照してください。
:::

## コミットとロールバック ( `SqlAgent#commit` /`#setRollbackOnly` )

トランザクションのlambda式が正常に終了すればトランザクションはコミットされます。\
トランザクションのlambda式が例外をスローした場合はトランザクションをロールバックします。\
明示的にコミットを行う場合は`SqlAgent#commit()`を呼び出します。\
例外をスローせずに明示的にロールバックを行う場合は`SqlAgent#setRollbackOnly()`を呼び出します。

```java
agent.required(() -> {
  // トランザクション開始
  agent.updateWith("insert into employee (emp_no) values (/*empNo*/1001)")
    .param("empNo", 1)
    .count();

  // 新しい トランザクション開始
  agent.requiresNew(() -> {
    agent.updateWith("insert into department (dept_no, dept_name) values (/*deptNo*/1, /*deptName*/'')")
      .param("deptNo", 2)
      .param("deptName", "Production")
      .count();
    // 明示的なcommit
    agent.commit();

    agent.updateWith("insert into department (dept_no, dept_name) values (/*deptNo*/1, /*deptName*/'')")
      .param("deptNo", 3)
      .param("deptName", "export")
      .count();
    // 明示的なrollback
    agent.setRollbackOnly();
    // 新しい トランザクション終了
  });
  // トランザクション終了 commit
});
```

## セーブポイント ( `SqlAgent#setSavepoint` /`#rollback` /`#releaseSavepoint`)

トランザクション内にセーブポイントを設けることで、トランザクション内の特定の操作のみ取り消すといった細かな制御ができます。

```java
agent.required(() -> {
  // トランザクション開始
  agent.update("employee/insert_employee")
    .param("empNo", 1001)
    .count();

  // セーブポイント(名前:sp)の設定
  agent.setSavepoint("sp");
  agent.update("employee/insert_employee")
    .param("empNo", 1002)
    .count();

  assertThat(agent.query("employee/select_employee").collect().size(), 2);

  // 最後のinsertを取消(セーブポイント(名前:sp)までロールバック)
  agent.rollback("sp");

  assertThat(agent.query("employee/select_employee").collect().size(), 1);
});
```

### セーブポイントスコープ(`SqlAgent#savepointScope`)&#x20;

`SqlAgent#savepointScope()` を使用して、より確実にsavepointの制御を行うことができます。

```java
// SqlAgent#savepointScope()を使ったsavepointの実装
agent.required(() -> {
  // トランザクション開始
  agent.update("employee/insert_employee")
    .param("empNo", 1001)
    .count();

  // セーブポイントスコープの開始
  agent.savepointScope(() -> {
    agent.update("employee/insert_employee")
      .param("empNo", 1002)
      .count();

    assertThat(agent.query("employee/select_employee").collect().size(), 2);
    // savepointScope内の処理を取り消す場合は例外をスローする
    throw new UroborosqlRuntimeException();
  })
  assertThat(agent.query("employee/select_employee").collect().size(), 1);
});
```

::: tip
PostgreSQLについては、自動的にセーブポイントを利用したトランザクションの部分ロールバックに対応しています。
詳細は、[PostgreSQLのトランザクション内SQLエラー対応](../advanced/index.md#postgresqlのトランザクション内sqlエラー対応)を参照してください。
:::

## AutoCommitスコープ(`SqlAgent#autoCommitScope`)&#x20;

トランザクション制御を行うアプリケーションで `uroborosql` を利用する場合、`SqlAgent#required` などを使ったトランザクションスコープによりコミットを制御するため、
`java.sql.Connection` の自動コミット・モードを `無効(false)` にします。

しかしDBの種類によっては特定のコマンドを発行する際、自動コミット・モードを `有効(true)` にして発行を行う必要があります。

::: tip 自動コミット・モードを有効にする必要のあるコマンド
例えば postgresqlの `vacuum` コマンドはトランザクション制御下では実行できないため、自動コミット・モードを有効にする必要があります
:::

こういったケースを実現する場合、  までは以下のような実装が必要でした。

```java
agent.required(() -> {
  // トランザクション開始
  // AutoCommitの開始
  try {
    agent.getConnection().setAutoCommit(true);
  } catch (SQLException ex) {
    throw new IllegalStateException(ex);
  }

  agent.update("employee/insert_employee")
    .param("empNo", 1001)
    .count(); // この段階で更新がコミットされる

  // AutoCommitの終了
  try {
    agent.getConnection().setAutoCommit(false);
  } catch (SQLException ex) {
    throw new IllegalStateException(ex);
  }

  assertThat(agent.query("employee/select_employee").collect().size(), 1);
});
```

上記の実装では、自動コミット・モードの切替えを try-catch で囲む必要があり記述が冗長でした。

&#x20;からは SqlAgent#autoCommitScope() を使って自動コミット・モードの切替えができるようになりました。

```java
// SqlAgent#autoCommitScope()を使った実装
agent.required(() -> {
  // トランザクション開始
  // AutoCommitの開始
  agent.autoCommitScope(() -> {
    agent.update("employee/insert_employee")
      .param("empNo", 1001)
      .count(); // この段階で更新がコミットされる

    assertThat(agent.query("employee/select_employee").collect().size(), 1);
    // 例外をスローしてもコミット済みなので追加したレコードは消えない
    throw new UroborosqlRuntimeException();
  });
  // AutoCommitの終了
  assertThat(agent.query("employee/select_employee").collect().size(), 1);
});
```

## エラーハンドリング ( `UroborosqlSQLException` )

**uroboroSQL**からSQLを実行した際にSQLExceptionがスローされると、
そのSQLExceptionを内部に保持する`UroborosqlSQLException`が呼び出し元に返却されます。\
`UroborosqlSQLException`は`java.lang.RuntimeException`を継承しているため明示的なキャッチは不要です。

呼出元のアプリケーションで明示的にエラーハンドリングを行う場合は、try-catchで`UroborosqlSQLException`をキャッチすることで、
例外発生時の挙動を制御することができます。

エラーハンドリングの例

```java
SqlConfig config = UroboroSQL.builder(...).build();

try (SqlAgent agent = config.agent()) {
  // INSERT文の実行
  // insert into product (product_id) values (/*productId*/0);
  agent.update("example/insert_product")
    .param("productId", 1)
    .count();
} catch (UroborosqlSQLException ex) {
  // SQLExceptionが発生した際に行う処理を実装
  throw new Exception("exception occured. ex=" + ex.getCause().getMessage(), ex);
}
```
