---
url: /uroborosql-doc/configuration/execution-context-provider.md
---

# ExecutionContextProvider

SQL構造を表現するクラスである`ExecutionContext`を生成するプロバイダクラスです。生成されるSQLの挙動を変更するための設定が行えます。

::: tip クラス名の変更
uroborosql v1.x で SqlContextFactory から ExecutionContextProviderにクラス名が変更されました。
:::

設定例

```java
// create SqlConfig
SqlConfig config = UroboroSQL
  .builder(...)
  // ExecutionContextProviderの設定
  .setExecutionContextProvider(new ExecutionContextProviderImpl()
    // 定数クラス設定の追加
    .setConstantClassNames(Arrays.asList(TypeConstants.class.getName()))
    // 列挙型パッケージ設定の追加
    .setEnumConstantPackageNames(Arrays.asList(Gender.class.getPackage().getName()))
     // 定数パラメータのプレフィックス指定(初期値 : CLS_)
    .setConstParamPrefix("CLS_")
    // パラメータ変換クラスの登録
    .addBindParamMapper(new CustomBindParamMapper())
    // ResultSetTypeの初期値
    // java.sql.ResultSet.TYPE_FORWARD_ONLY, java.sql.ResultSet.TYPE_SCROLL_INSENSITIVE, java.sql.ResultSet.TYPE_SCROLL_SENSITIVE のいずれか
    .setDefaultResultSetType(ResultSet.TYPE_FORWARD_ONLY)
    // ResultSetConcurrencyの初期値
    // java.sql.ResultSet.CONCUR_READ_ONLY, java.sql.ResultSet.CONCUR_UPDATABLE のいずれか
    .setDefaultResultSetConcurrency(ResultSet.CONCUR_READ_ONLY)
  ).build();
```

## 区分値定数や列挙型の利用 ( `ExecutionContextProvider#setConstantClassNames` /`#setEnumConstantPackageNames`)

これまでSQLの開発では、区分値や定数値などの固定値がマジックナンバーとしてSQL文内に埋め込まれていました。\
しかしマジックナンバーの記述は可読性が悪く仕様変更時の影響調査が困難なため不具合の温床となっていました。

例

```sql
select
 *
from employee
where emp_typ = '05' -- 05:従業員     <-- 従業員の区分が変わったらどうする？
```

**uroboroSQL**はエンタープライズ分野での開発に利用されてきた経験から、SQL文の中でマジックナンバーの代わりに定数や列挙型を利用するための仕組みを提供しています。

区分値定数/列挙型を利用するためには`ExecutionContextProvider`に以下の設定を追加します。

```java
// create SqlConfig
SqlConfig config = UroboroSQL
  .builder(...)
  // ExecutionContextProviderの設定
  .setExecutionContextProvider(new ExecutionContextProviderImpl()
    // 定数クラス設定の追加
    .setConstantClassNames(Arrays.asList(TypeConstants.class.getName()))
    // 列挙型パッケージ設定の追加
    .setEnumConstantPackageNames(Arrays.asList(Gender.class.getPackage().getName()))
     // 定数パラメータのプレフィックス指定(初期値 : CLS_)
    .setConstParamPrefix("CLS_")
  ).build();
```

定数クラス : TypeConstants.javaの実装例

```java
/**
 * 区分値定数クラス
 */
public final class TypeConstants {
  private TypeConstants() {}

  /** 区分種別：口座種別区分  区分種別番号：0035 */
  public static final String ACCOUNT_TYP = "0035";
  /** 区分種別：口座種別区分  区分値：普通  区分値番号：1 */
  public static final String ACCOUNT_TYP_SAVING = "1";
  /** 区分種別：口座種別区分  区分値：当座  区分値番号：2 */
  public static final String ACCOUNT_TYP_CHECKING = "2";
  /** 区分種別：口座種別区分  区分値：定期  区分値番号：3 */
  public static final String ACCOUNT_TYP_FIXED_DEPOSIT = "3";
  /** 区分種別：実行区分  区分種別番号：0052 */
  public static final String ISSUE_TYP = "0052";
  /** 区分種別：実行区分  区分値：未実行  区分値番号：1 */
  public static final String ISSUE_TYP_UNISSUED = "1";
  /** 区分種別：実行区分  区分値：実行済  区分値番号：2 */
  public static final String ISSUE_TYP_OUTSTANDING = "2";
}

/**
 * システム定数
 */
public final class Consts {
  private Consts() {}

  public static final class CommonValue {
    private CommonValue() {}

    /** 業務日付（オンライン） */
    public static final String ONLINE_DATE = "1";

    /** 業務日付（バッチ） */
    public static final String BATCH_DATE = "2";

    /** SQL上でのフラグ表現（TRUE=1） */
    public static final String FLAG_ON = "1";
    /** SQL上でのフラグ表現（FALSE=0） */
    public static final String FLAG_OFF = "0";
    /** 日付ALL0 */
    public static final String ZERO_DATE = "00000000";
    /** 日付最小値 */
    public static final String MIN_DATE = "19000101";
    /** 日付最大値 */
    public static final String MAX_DATE = "99991231";
  }
}
```

列挙型 : Gender.javaの実装例

```java
/**
 * 性別を表す列挙型
 */
public enum Gender {
  MALE("M"), FEMALE("F"), OTHER("O");

  private final String label;

  private Gender(String label) {
    this.label = label;
  }

  @Override
  public String toString() {
    return label;
  }
}
```

このように区分値定数や列挙型を定数パラメータとして登録しておくことで、SQL文の中で定数名が利用できるようになります。

定数パラメータを利用する場合、以下の命名ルールに従ってパラメータを指定します。

| パターン                    | 書式                                                                                                     |
| :-------------------------- | :------------------------------------------------------------------------------------------------------- |
| 定数                        | \[定数パラメータプレフィックス]\[定数フィールド名大文字]                                                   |
| 定数(Innerクラスがある場合) | \[定数パラメータプレフィックス]\[Innerクラス名大文字スネークケース]\_\[Innerクラス内定数フィールド名大文字] |
| 列挙型                      | \[定数パラメータプレフィックス]\[列挙型名大文字]\_\[列挙子名大文字]                                         |

::: tip
※定数パラメータプレフィックスの初期値は `CLS_`となっています。\
`ExecutionContextProvider#setConstParamPrefix()`で変更することが可能です。
:::

実際に使用する際はSQL文の中で置換文字列として以下のように指定します

* /\*#\[定数パラメータプレフィックス]\[定数フィールド名大文字]\*/
* /\*#\[定数パラメータプレフィックス]\[Innerクラス名大文字スネークケース]\_\[Innerクラス内定数フィールド名大文字]\*/
* /\*#\[定数パラメータプレフィックス]\[列挙型名大文字]\_\[列挙子名大文字]\*/

または

* /\*$\[定数パラメータプレフィックス]\[定数フィールド名大文字]\*/
* /\*$\[定数パラメータプレフィックス]\[Innerクラス名大文字スネークケース]\_\[Innerクラス内定数フィールド名大文字]\*/
* /\*$\[定数パラメータプレフィックス]\[列挙型名大文字]\_\[列挙子名大文字]\*/

という風に使用します。

::: tip
定数や列挙型の値は固定値なので生成されるSQLは毎回同じ値になり、SQL文解析処理によるCPU負荷を考慮する必要はありません。
:::

区分の例

```sql
select
 *
from account
where account_typ = /*#CLS_ACCOUNT_TYP_SAVING*/'1' -- 1:普通口座
```

定数の例

```sql
select
   emp.emp_no    as  emp_no
,  emp.first_name  as  first_name
,  emp.last_name  as  last_name
,  emp.birth_date  as  birth_date
,  emp.gender    as  gender
from
  employee  emp
where
  emp.birth_date    !=  /*#CLS_COMMON_VALUE_ZERO_DATE*/'00000000'  -- 定数パラメータの指定
```

列挙型の例

```sql
select
   emp.emp_no    as  emp_no
,  emp.first_name  as  first_name
,  emp.last_name  as  last_name
,  emp.birth_date  as  birth_date
,  emp.gender    as  gender
from
  employee  emp
where
  emp.gender    =  /*#CLS_GENDER_FEMALE*/'F'  -- 列挙型定数パラメータの指定
```

定数パラメータは条件分岐の中で使用することもできます。

```sql
select
   emp.emp_no    as  emp_no
,  emp.first_name  as  first_name
,  emp.last_name  as  last_name
,  emp.birth_date  as  birth_date
,  emp.gender    as  gender
from
  employee  emp
/*IF gender == CLS_GENDER_MALE or gender == CLS_GENDER_FEMALE */
where
  emp.gender    =  /*#CLS_GENDER_FEMALE*/'F'  -- 列挙型定数パラメータの指定
/*END*/
```

## バインドパラメータ変換クラスの設定 ( `ExecutionContextProvider#addBindParamMapper` )&#x20;

SQLを実行する際、独自に作成したクラスをバインドしたい場合があります。
そういったケースに対応できるよう**uroboroSQL**ではバインドパラメータをJDBCが受け入れられる型に変換するためのクラスを
設定することが出来ます。

バインドパラメータ変換クラスの例

```java
// Nameクラスに対するバインドパラメータ変換クラス
public class CustomBindParamMapper implements BindParameterMapper<Name> {
  @Override
  public Object toJdbc(Name original, Connection connection,
    BindParameterMapperManager parameterMapperManager) {
    return original.toString();
  }
}

// バインドパラメータに設定するドメインクラス
public class Name {
  private final String firstName;
  private final String lastName;

  public Name(String firstName, String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @Override
  public String toString() {
    return this.firstName + " " + this.lastName;
  }
}
```

`ExecutionContextProvider`の設定

```java
// create SqlConfig
SqlConfig config = UroboroSQL
.builder(...)
// ExecutionContextProviderの設定
.setExecutionContextProvider(new ExecutionContextProviderImpl()
  // パラメータ変換クラスの登録
  .addBindParamMapper(new CustomBindParamMapper())
).build();
```

バインドパラメータ設定例

```java
Name name = new Name("Bob", "Smith");
agent.update("insert_user").param("name", name).count();
```

## java.sql.ResultSetの挙動設定&#x20;

検索SQLの発行で取得する`java.util.ResultSet`の挙動を変更することができます。

```java
// create SqlConfig
SqlConfig config = UroboroSQL
  .builder(...)
  // ExecutionContextProviderの設定
  .setExecutionContextProvider(new ExecutionContextProviderImpl()
    // ResultSetTypeの初期値
    // java.sql.ResultSet.TYPE_FORWARD_ONLY, java.sql.ResultSet.TYPE_SCROLL_INSENSITIVE, java.sql.ResultSet.TYPE_SCROLL_SENSITIVE のいずれか
    .setDefaultResultSetType(ResultSet.TYPE_FORWARD_ONLY)
    // ResultSetConcurrencyの初期値
    // java.sql.ResultSet.CONCUR_READ_ONLY, java.sql.ResultSet.CONCUR_UPDATABLE のいずれか
    .setDefaultResultSetConcurrency(ResultSet.CONCUR_READ_ONLY)
  ).build();
```

### カーソル型の初期値（`DefaultResultSetType`）

`java.sql.ResultSet`のカーソルの型を指定します。
| 型 | 説明 | 初期値 |
| :----------------------------------------- | :--------------------------------------------------------------------------------- | :----: |
| java.sql.ResultSet#TYPE\_FORWARD\_ONLY | カーソルは最初から最後まで順方向にしか移動できません。 | ◯ |
| java.sql.ResultSet#TYPE\_SCROLL\_INSENSITIVE | カーソルは順方向・逆方向いずれにも移動可能です。ただし他による変更を反映しません。 | |
| java.sql.ResultSet#TYPE\_SCROLL\_SENSITIVE | カーソルは順方向・逆方向いずれにも移動可能です。また他による変更も反映します。 | |

### 変更可能性の初期値（`DefaultResultSetConcurrency`）

`java.sql.ResultSet`の変更可能性を指定します。
| 型 | 説明 | 初期値 |
| :---------------------------------- | :----------------------------------------------------------------------------------- | :----: |
| java.sql.ResultSet.CONCUR\_READ\_ONLY | カーソルはデータの読み出ししかサポートしません。 | ◯ |
| java.sql.ResultSet.CONCUR\_UPDATABLE | カーソルは変更可能です。カーソルを用いたデータの挿入・変更・削除がサポートされます。 | |
