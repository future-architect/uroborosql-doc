---
url: /uroborosql-doc/background/el.md
---

# 式言語

**uroboroSQL**では、条件分岐に式言語を利用することができます。\
利用可能な式言語は以下の２つになります。

* [Spring Expression Language(SpEL)](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#expressions) &#x20;
* [OGNL](https://github.com/jkuhnert/ognl)

利用する式言語の切替は依存関係ライブラリの指定により行ってください。\
依存関係ライブラリの指定については[環境設定](../getting_started/index.md#ビルドツールの設定)を参照してください。

条件分岐の評価式として使用する場合、評価結果が真偽値(true/false)になるように記述してください。

## Spring Expression Language(SpEL)

以下に式言語としてSpring Expression Language(SpEL)を利用する場合の基本文法を提示します。\
SpEL文法の詳細は[こちら](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#expressions-language-ref)を参照してください。

### リテラル(SpEL)

以下のリテラルが使用できます。

* 文字列はシングルクォートで囲む。シングルクォート自体を使用する場合はシングルクォートを２つ重ねる('')
* 数字や真偽値、nullはそのまま記述

### 演算子(SpEL)

以下の演算子が使用できます。

### 算術演算子(SpEL)

* e1 + e2 (足し算)
* e1 - e2 (引き算)
* e1 \* e2 (掛け算)
* e1 / e2, e1 div e2 (割り算)
* e1 % e2, e1 mod e2 (余り)

### 比較演算子(SpEL)

* e1 eq e2, e1 == e2 (等しい)
  * e1・e2のいずれかがnullの場合、両方ともnullの時のみe1とe2は等しい
  * e1・e2が同じオブジェクトの場合、またはequals()メソッドにより等しいと判断される場合、e1とe2は等しい
  * e1・e2が数値の場合、倍精度浮動小数点数が等しい時のみe1とe2は等しい
  * その以外の場合、e1とe2は等しくない
* e1 ne e2, e1 != e2 (等しくない)
* e1 lt e2, e1 < e2 (小なり)
* e1 le e2, e1 <= e2 (小なりイコール)
* e1 gt e2, e1 > e2 (大なり)
* e1 ge e2, e1 >= e2 (大なりイコール)

### 論理演算子(SpEL)

* e1 or e2 (論理和)
* e1 and e2 (論理積)
* not e, ! e (論理否定)

### 連結演算子(SpEL)

* e1 + e2 (文字列連結)

### その他の演算子(SpEL)

* instanceof (型判定)
  * ex) 'xyz' instanceof T(int) // false T() はタイプ（型）を表す
* matches (正規表現)
  * ex) '5.00' matches '^\[0-9]{2}$' // false

### メソッド・フィールドの呼び出し(SpEL)

以下のようにメソッド・フィールドの呼び出しができます。

* e.method(args) (メソッドの呼び出し)
* e.property (フィールドの呼び出し)
* T(type).staticMethod(args) (staticメソッドの呼び出し)

## OGNL

以下に式言語としてOGNLを利用する場合の基本文法を提示します。\
OGNL文法の詳細は[こちら](https://commons.apache.org/proper/commons-ognl/language-guide.html)を参照してください。

### リテラル(OGNL)

以下のリテラルが使用できます。

* “a”(java.lang.String)
* 'a'(char)
* 1(int)
* 1L(long)
* 0.1F(float)
* 0.1D(double)
* 0.1B(java.math.BigDecimal)
* 1H(java.math.BigInteger)
* true, false(Boolean)
* null

### 演算子(OGNL)

以下の演算子が使用できます。

### 算術演算子(OGNL)

* e1 + e2 (足し算)
* e1 - e2 (引き算)
* e1 \* e2 (掛け算)
* e1 / e2 (割り算)
* e1 % e2 (余り)

### 比較演算子(OGNL)

* e1 eq e2, e1 == e2 (等しい)
  * e1・e2のいずれかがnullの場合、両方ともnullの時のみe1とe2は等しい
  * e1・e2が同じオブジェクトの場合、またはequals()メソッドにより等しいと判断される場合、e1とe2は等しい
  * e1・e2が数値の場合、倍精度浮動小数点数が等しい時のみe1とe2は等しい
  * その以外の場合、e1とe2は等しくない
* e1 neq e2, e1 != e2 (等しくない)
* e1 lt e2, e1 < e2 (小なり)
* e1 lte e2, e1 <= e2 (小なりイコール)
* e1 gt e2, e1 > e2 (大なり)
* e1 gte e2, e1 >= e2 (大なりイコール)

### 論理演算子(OGNL)

* e1 or e2, e1 || e2 (論理和)
* e1 and e2, e1 && e2 (論理積)
* not e, ! e (論理否定)

### 連結演算子(OGNL)

* e1 + e2 (文字列連結)

### メソッド・フィールドの呼び出し(OGNL)

以下のようにメソッド・フィールドの呼び出しができます。

* e.method(args) (メソッドの呼び出し)
* e.property (フィールドの呼び出し)

## SqlFunction(SF)

**uroboroSQL**では評価式を利用する際、標準で`SqlFunction`（SF）を使用することができます。
評価式と合わせて`SqlFunction`クラスのメソッドを呼び出すことができます。

* 評価式で使用する場合

```sql
/*IF SF.isNotEmpty(emp_no)*/
  -- emp_noが null または 空 でない場合に処理される
/*END*/
```

* バインドパラメータと合わせて使用する場合

```sql
emp_name like /*SF.contains(emp_name)*/'' escape '$'
-- emp_name=Bobの場合、 emp_name like %Bob% escape '$' となる
```

* `SqlFunction`が提供するメソッドの一覧

| メソッド名                                           | 戻り値   | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :--------------------------------------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SF.isEmpty(Object obj)                               | boolean  | 指定したオブジェクトが空であること判定する。指定したオブジェクトがOptional型の場合は、その中身を評価する。 では、従来の文字列中心の判定仕様を見直し、List型などのコレクションを含む文字列以外のオブジェクトについても一貫した空判定が行われるように仕様を変更している。判定の詳細は[Javadoc](https://www.javadoc.io/doc/jp.co.future/uroborosql/latest/jp/co/future/uroborosql/utils/SqlFunction.html)のisEmptyメソッドを参照のこと。        |
| SF.isNotEmpty(Object obj)                            | boolean  | 指定したオブジェクトが空でないことを判定する。指定したオブジェクトがOptional型の場合は、その中身を評価する。 では、従来の文字列中心の判定仕様を見直し、List型などのコレクションを含む文字列以外のオブジェクトについても一貫した非空判定が行われるように仕様を変更している。判定の詳細は[Javadoc](https://www.javadoc.io/doc/jp.co.future/uroborosql/latest/jp/co/future/uroborosql/utils/SqlFunction.html)のisNotEmptyメソッドを参照のこと。 |
| SF.isBlank(Object obj)                               | boolean  | 指定したオブジェクトの文字列表現が空、もしくは空白であること判定する                                                                                                                                                                                                                                                                                                                                                                                                         |
| SF.isNotBlank(Object obj)                            | boolean  | 指定したオブジェクトの文字列表現が空、もしくは空白でないこと判定する                                                                                                                                                                                                                                                                                                                                                                                                         |
| SF.trim(Object obj)                                  | String   | 文字列の前後の空白を除去する。nullを渡した場合は結果もnullとなる                                                                                                                                                                                                                                                                                                                                                                                                             |
| SF.trimToEmpty(Object obj)                           | String   | 文字列の前後の空白を除去する。nullを渡した場合は空文字となる                                                                                                                                                                                                                                                                                                                                                                                                                 |
| SF.left(String str, int len)                         | String   | 文字列の先頭から指定した文字数の文字列を取得する                                                                                                                                                                                                                                                                                                                                                                                                                             |
| SF.right(String str, int len)                        | String   | 文字列の最後から指定した文字数の文字列を取得する                                                                                                                                                                                                                                                                                                                                                                                                                             |
| SF.mid(String str, int pos, int len)                 | String   | 文字列の指定した位置から指定した文字数の文字列を取得する                                                                                                                                                                                                                                                                                                                                                                                                                     |
| SF.rightPad(String str, int size)                    | String   | 文字列の末尾に空白を埋めて指定された長さにする                                                                                                                                                                                                                                                                                                                                                                                                                               |
| SF.rightPad(String str, int size, char padChar)      | String   | 文字列の末尾に指定した埋め込み文字を埋めて指定された長さにする                                                                                                                                                                                                                                                                                                                                                                                                               |
| SF.leftPad(String str, int size)                     | String   | 文字列の先頭に空白を埋めて指定された長さにする                                                                                                                                                                                                                                                                                                                                                                                                                               |
| SF.leftPad(String str, int size, char padChar)       | String   | 文字列の先頭に指定した埋め込み文字を埋めて指定された長さにする                                                                                                                                                                                                                                                                                                                                                                                                               |
| SF.split(String str)                                 | String\[] | 文字列を空白で区切って配列に格納する。nullが入力された場合はnullを返す                                                                                                                                                                                                                                                                                                                                                                                                       |
| SF.split(String str, char separatorChar)             | String\[] | 文字列を指定した区切り文字で区切って配列に格納する。nullが入力された場合はnullを返す                                                                                                                                                                                                                                                                                                                                                                                         |
| SF.split(String str, String separatorChars, int max) | String\[] | 文字列を指定した区切り文字で区切って配列に格納する。nullが入力された場合はnullを返す                                                                                                                                                                                                                                                                                                                                                                                         |
| SF.capitalize(String str)                            | String   | 文字列の先頭文字を大文字にする                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| SF.uncapitalize(String str)                          | String   | 文字列の先頭を小文字にする                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| SF.startsWith(CharSequence text)                     | String   | 指定されたテキストで始まるLIKE句用の検索文字列を生成する。引数のテキストはエスケープ処理される                                                                                                                                                                                                                                                                                                                                                        |
| SF.contains(CharSequence text)                       | String   | 指定されたテキストを含むLIKE句用の検索文字列を生成する。引数のテキストはエスケープ処理される                                                                                                                                                                                                                                                                                                                                                          |
| SF.endsWith(CharSequence text)                       | String   | 指定されたテキストで終わるLIKE句用の検索文字列を生成する。数のテキストはエスケープ処理される                                                                                                                                                                                                                                                                                                                                                          |
