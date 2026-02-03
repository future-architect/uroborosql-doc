---
url: /uroborosql-doc/advanced/update-delegate.md
---

# 更新処理の委譲

Webアプリケーションを作成する場合、以下のような流れで画面からの登録処理を行うことがあります。

1. データ検証（データの存在有無や重複チェック、データの整合性チェックなど）
2. 登録、更新処理

その際、より厳密に一度 「1. データ検証」だけを実施し、問題がなければ再度「1.データ検証」 と 「2.登録、更新処理」 を合わせて処理を行うことがあります。\
この場合 「1.データ検証」だけを行うモードかどうかをフロントエンドから渡し、
それによって 「1. データ検証」 と 「2.登録、更新処理」 を実行するか分岐することになります。

* 個別処理での実装イメージ

```java
if (request.isCheckMode()) {
  // 1. データ検証（データ検証用のQuery発行）
  validateData(request);
} else {
  // 1. データ検証（データ検証用のQuery発行）
  validateData(request);
  // 2. 登録、更新処理
  createData(request);
}
```

このような処理を個別実装で行うと実装漏れが起こりやすく、テストも大変になります。\
`更新処理の委譲` を利用することで、データ検証を行うモードの場合には更新処理をスキップする、といった動作を一律指定することが出来ます。

`更新処理の委譲` を利用する場合、ExecutionContextに委譲用のFunctionを指定します。

* setUpdateDelegate 実装例

```java
SqlUpdate update = agent.update("example/update_product")
  .set("productName", "new_name")
  .set("janCode", "1234567890123")
  .equal("productId", 1);
ExecutionContext ctx = update.context();
ctx.setUpdateDelegate(context -> 2); // 更新の委譲処理。登録する Function は 引数として ExecutionContext を受取り、int（更新件数）を返却する
update.count(); // SQLは発行されず、代わりに委譲用のFunctionが実行され戻り値 2 が返る
```

ExecutionContext#setUpdateDelegate() は通常 [イベントハンドラーの設定](../configuration/event-listener-holder.html#eventlistenerholder-%E3%81%A8-eventsubscriber) と合わせて利用します。

* EventSubscriberでのExecutionContext#setUpdateDelegate()の設定例

```java
/**
 * 更新処理委譲イベントサブスクライバー
 **/
public class UpdateDelegateEventSubscriber extends EventSubscriber {
    @Override
    public void initialize() {
      beforeParseSqlListener(this::onBeforeParseSql);
    }

    /**
     * SQLパース前のイベントを処理する.
     *
     * @param event イベント
     */
    protected void onBeforeParseSql(final BeforeParseSqlEvent event) {
      switch (event.getExecutionContext().getSqlKind()) {
        case INSERT,
             MERGE,
             UPDATE,
             BATCH_INSERT,
             BATCH_UPDATE,
             BULK_INSERT,
             ENTITY_BATCH_INSERT,
             ENTITY_BULK_INSERT,
             ENTITY_INSERT,
             ENTITY_UPDATE -> {
                if (チェックモードなら) {
                  ExecutionContext ctx = event.getExecutionContext();
                  ctx.setUpdateDelegate(context -> 1);
                }
             };
        default -> {}
      }
    }
}
```

* setUpdateDelegateを利用した実装イメージ

```java
// 1. データ検証（データ検証用のQuery発行）
validateData(request);
// 2. 登録、更新処理　（チェックモードの場合はsetUpdateDelegateにより更新SQLの発行が行われない）
createData(request);
```
