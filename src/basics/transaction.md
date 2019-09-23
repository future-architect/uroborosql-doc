---
meta:
  - name: og:title
    content: 'トランザクション'
  - name: og:url
    content: '/uroborosql-doc/basics/transaction.html'
---
# トランザクション

**uroboroSQL**ではローカルトランザクションを提供します。  
トランザクションを利用することで、エラー発生時でも一部のデータだけ登録を成功させるといった細かな制御ができるようになります。

## トランザクションの開始と終了

**uroboroSQL**で提供するトランザクションのレベルは以下の3つです

|トランザクションタイプ|トランザクション有り|トランザクションなし|
|:-------------------|:-----------------|:------------------|
|required|トランザクション内で処理を実行|新たなトランザクションを開始して処理を実行|
|requiresNew|既存のトランザクションを停止し、新たなトランザクションを開始して処理を実行。<br>トランザクションが終了すると停止していたトランザクションを再開させる|新たなトランザクションを開始して処理を実行|
|notSupported|既存のトランザクションを停止し、トランザクション外で処理を実行。<br>処理が終了すると停止していたトランザクションを再開させる|トランザクション外で処理を実行|

`SqlAgent`インタフェースにトランザクションタイプに応じたメソッドが提供されており、そのメソッドを呼び出すことでトランザクションの開始と終了を制御します。

```java
agent.required(() -> {
  // トランザクション開始
  agent.updateWith("insert into employee (emp_no) values (/*emp_no*/1001)")
    .param("emp_no", 1)
    .count();

  agent.requiresNew(() -> {
    // 新しい トランザクション開始
    agent.updateWith("insert into department (dept_no, dept_name) values (/*dept_no*/1111, /*dept_name*/'Sales')")
      .param("dept_no", 2)
      .param("dept_name", "export")
      .count();
    // 新しい トランザクション終了 commit
  });
  // トランザクション終了 commit
});
```

::: tip
設定によりDB更新処理の実行をトランザクション内で行うことを強制することができます。詳しくは
[DB更新処理をトランザクション内のみに強制](../configuration/sql-agent-factory.md#db更新処理をトランザクション内のみに強制)を参照してください。
:::

## コミットとロールバック

トランザクションのlambda式が正常に終了すればトランザクションはコミットされます。  
トランザクションのlambda式が例外をスローした場合はトランザクションをロールバックします。  
明示的にコミットを行う場合は`SqlAgent#commit()`を呼び出します。  
例外をスローせずに明示的にロールバックを行う場合は`SqlAgent#setRollbackOnly()`を呼び出します。

```java
agent.required(() -> {
  // トランザクション開始
  agent.updateWith("insert into employee (emp_no) values (/*emp_no*/1001)")
    .param("emp_no", 1)
    .count();

  // 新しい トランザクション開始
  agent.requiresNew(() -> {
    agent.updateWith("insert into department (dept_no, dept_name) values (/*dept_no*/1, /*dept_name*/'')")
      .param("dept_no", 2)
      .param("dept_name", "Production")
      .count();
    // 明示的なcommit
    agent.commit();

    agent.updateWith("insert into department (dept_no, dept_name) values (/*dept_no*/1, /*dept_name*/'')")
      .param("dept_no", 3)
      .param("dept_name", "export")
      .count();
    // 明示的なrollback
    agent.setRollbackOnly();
    // 新しい トランザクション終了
  });
  // トランザクション終了 commit
});
```

## セーブポイント

トランザクション内にセーブポイントを設けることで、トランザクション内の特定の操作のみ取り消すといった細かな制御ができます。

```java
agent.required(() -> {
  // トランザクション開始
  agent.update("employee/insert_employee")
    .param("emp_no", 1001)
    .count();

  // セーブポイント(名前:sp)の設定
  agent.setSavepoint("sp");
  agent.update("employee/insert_employee")
    .param("emp_no", 1002)
    .count();

  assertThat(agent.query("employee/select_employee").collect().size(), 2);

  // 最後のinsertを取消(セーブポイント(名前:sp)までロールバック)
  agent.rollback("sp");

  assertThat(agent.query("employee/select_employee").collect().size(), 1);
});
```

::: tip
PostgreSQLについては、自動的にセーブポイントを利用したトランザクションの部分ロールバックに対応しています。
詳細は、[PostgreSQLのトランザクション内SQLエラー対応](../advanced/README.md#postgresqlのトランザクション内sqlエラー対応)を参照してください。
:::

## エラーハンドリング

**uroboroSQL**からSQLを実行した際にSQLExceptionがスローされると、
そのSQLExceptionを内部に保持する`UroborosqlSQLException`が呼び出し元に返却されます。  
`UroborosqlSQLException`は`java.lang.RuntimeException`を継承しているため明示的なキャッチは不要です。

呼出元のアプリケーションで明示的にエラーハンドリングを行う場合は、try-catchで`UroborosqlSQLException`をキャッチすることで、
例外発生時の挙動を制御することができます。

エラーハンドリングの例

```java
SqlConfig config = UroboroSQL.builder(...).build();

try (SqlAgent agent = config.agent()) {
  // INSERT文の実行
  // insert into product (product_id) values (/*product_id*/0);
  agent.update("example/insert_product")
    .param("product_id", 1)
    .count();
} catch (UroborosqlSQLException ex) {
  // SQLExceptionが発生した際に行う処理を実装
  throw new Exception("exception occured. ex=" + ex.getCause().getMessage(), ex);
}
```
