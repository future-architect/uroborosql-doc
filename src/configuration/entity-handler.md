---
head:
  - - meta
    - name: og:title
      content: "EntityHandler"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/configuration/entity-handler.html"
---

# EntityHandler

`EntityHandler`はDAOインタフェースを利用したDB操作を行う際に実行するSQLの生成を制御するためのクラスです。  
アプリケーションの要件によって[EntityHandler](https://github.com/future-architect/uroborosql/blob/main/src/main/java/jp/co/future/uroborosql/mapping/EntityHandler.java)インタフェースや[DefaultEntityHandler](https://github.com/future-architect/uroborosql/blob/main/src/main/java/jp/co/future/uroborosql/mapping/DefaultEntityHandler.java)クラスを継承した独自のEntityHandlerを指定することが出来ます。

::: tip
EntityHandlerはDAOインタフェース利用時のみに有効な手段ですが、SQLファイルインタフェースにおいても自動でバインドする場合は、[自動パラメータバインド関数の設定](./sql-context-factory.md#自動パラメータバインド関数の設定)を参照してください。
:::

`EntityHandler`拡張例

```java
public class CustomEntityHandler extends DefaultEntityHandler
  implements EntityHandler<Object> {

  @Override
  public void setInsertParams(final SqlContext context, final Object entity) {
    setEntityModelInsertParams((EntityModel) entity);  // entityがEntityModel型を継承している場合
    super.setInsertParams(context, entity);
  }

  @Override
  public void setUpdateParams(final SqlContext context, final Object entity) {
    setEntityModelUpdateParams((EntityModel) entity);  // entityがEntityModel型を継承している場合
    super.setUpdateParams(context, entity);
  }

  @Override
  public void setBulkInsertParams(final SqlContext context, final Object entity, final int entityIndex) {
    setEntityModelInsertParams((EntityModel) entity);  // entityがEntityModel型を継承している場合
    super.setBulkInsertParams(context, entity, entityIndex);
  }

  private void setEntityModelInsertParams(final EntityModel model) {
    ZonedDateTime now = ZonedDateTime.now();
    model.setCreatedAt(now);
    model.setUpdatedAt(now);
  }

  private void setEntityModelUpdateParams(final EntityModel model) {
    model.setUpdatedAt(ZonedDateTime.now());
  }
}
```

```java
// create SqlConfig
SqlConfig config = UroboroSQL
  .builder(...)
  // EntityHandlerの設定
  .setEntityHandler(new CustomEntityHandler()).build();
```
