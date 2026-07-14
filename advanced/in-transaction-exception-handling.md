---
url: /uroborosql-doc/advanced/in-transaction-exception-handling.md
---

# PostgreSQLのトランザクション内SQLエラー対応

PostgreSQLでは、１つのトランザクション内でSQLエラーが発生した場合、後続するSQL文はすべて無条件でエラーとなります。\
この状態はトランザクションに対して`commit`もしくは`rollback`を実行するまで続きます。

::: warning
エラーが発生している状態で`commit`を実行しても実際には`rollback`されます
:::

これはPostgreSQL固有の動作であり、通常は問題ない動作なのですが、テーブルロックエラーなどリトライ処理を行うケースで問題になります。\
（SQLのリトライについては[SQL実行のリトライ](../configuration/sql-agent-provider.md#sql実行のリトライ-sqlagentprovider-setsqlretrycodelist-setdefaultmaxretrycount-setdefaultsqlretrywaittime)を参照）\
**uroboroSQL**ではリトライ指定のあるSQL実行、かつ、PostgreSQL（より正確には`Dialect#isRollbackToSavepointBeforeRetry()`が`true`の場合）の場合にsavepointを用いた部分ロールバックを行うことでこの問題に対応しています。\
具体的にはリトライ指定のあるSQL実行、かつ、PostgreSQLの場合はSQL実行の直前にリトライ用のsavepointを設定し、SQL実行が成功すればsavepointの解放、SQL実行が失敗した場合はリトライ用のsavepointまでロールバックを行います。

::: tip
リトライ指定のないSQL実行の場合はsavepointの設定は行われません。
:::

リトライ指定のないSQLで上記と同様の動作を行う場合はsavepointScopeを利用して以下のように実装してください。

```java
agent.required(() -> { // トランザクション開始
  agent.savepointScope(() -> {
    // savepointScopeの開始
    agent.update("example/insert_product")
      .param("productId", 1)
      .count();
  });
  agent.savepointScope(() -> {
    // 後続処理
    int count = agent.update("department/insert_department")
      .param("deptNo", 1)
      .param("deptName", "Sales")
      .count();
      ・・・
  });
});
```
