---
meta:
  - name: og:title
    content: 'OGNL式言語'
  - name: og:url
    content: '/uroborosql-doc/background/ognl.html'
---
# OGNL式言語

**uroboroSQL**では、条件分岐の式として[OGNL式言語](https://github.com/jkuhnert/ognl)を利用することができます。  
条件分岐の評価式として使用する場合、評価結果が真偽値(true/false)になるように記述してください。

以下にOGNLの基本文法を提示します。
OGNL文法の詳細は[こちら](https://commons.apache.org/proper/commons-ognl/language-guide.html)を参照してください。

## リテラル

以下のリテラルが使用できます。

- “a”(java.lang.String)
- 'a'(char)
- 1(int)
- 1L(long)
- 0.1F(float)
- 0.1D(double)
- 0.1B(java.math.BigDecimal)
- 1H(java.math.BigInteger)
- true, false(Boolean)
- null

## 演算子

以下の演算子が使用できます。

## 算術演算子

- e1 + e2(足し算)
- e1 - e2 (引き算)
- e1 * e2 (掛け算)
- e1 / e2 (割り算)
- e1 % e2 (余り)

## 比較演算子

- e1 eq e2, e1 == e2 (等しい)  
  - e1・e2のいずれかがnullの場合、両方ともnullの時のみe1とe2は等しい
  - e1・e2が同じオブジェクトの場合、またはequals()メソッドにより等しいと判断される場合、e1とe2は等しい
  - e1・e2が数値の場合、倍精度浮動小数点数が等しい時のみe1とe2は等しい
  - その以外の場合、e1とe2は等しくない
- e1 neq e2, e1 != e2 (等しくない)
- e1 lt e2, e1 < e2 (小なり)
- e1 lte e2, e1 <= e2 (小なりイコール)
- e1 gt e2, e1 > e2 (大なり)
- e1 gte e2, e1 >= e2 (大なりイコール)

## 論理演算子

- e1 or e2, e1 || e2 (論理和)
- e1 and e2, e1 && e2 (論理積)
- not e, ! e (論理否定)

## 連結演算子

- e1 + e2 (文字列連結)

## メソッド・フィールドの呼び出し

以下のようにメソッド・フィールドの呼び出しができます。

- e.method(args) (メソッドの呼び出し)
- e.property (フィールドの呼び出し)

## StringFunction(SF)

**uroboroSQL**ではOGNL式を利用する際、標準で`StringFunction`（SF）を使用することができます。
OGNL式と合わせて`StringFunction`クラスのメソッドを呼び出すことができます。

- 評価式で使用する場合

```sql
/*IF SF.isNotEmpty(emp_no)*/
  -- emp_noが null または "" でない場合に処理される
/*END*/
```

- バインドパラメータと合わせて使用する場合

```sql
emp_name like /*SF.contains(emp_name)*/'' escape '$'
-- emp_name=Bobの場合、 emp_name like %Bob% escape '$' となる
```

- `StringFunction`が提供するメソッドの一覧

|メソッド名|戻り値|説明|
|:--------|:--------|:--------|
|SF.isEmpty(String str)|booean|対象文字列が空文字であること判定する|
|SF.isNotEmpty(String str)|boolean|対象文字列が空文字でないことを判定する|
|SF.isBlank(String str)|boolean|対象文字列が空文字、もしくは空白であること判定する|
|SF.isNotBlank(String str)|boolean|対象文字列が空文字、もしくは空白でないこと判定する|
|SF.trim(String str)|String|文字列の前後の空白を除去する。nullを渡した場合は結果もnullとなる|
|SF.trimToEmpty(String str)|String|文字列の前後の空白を除去する。nullを渡した場合は空文字となる|
|SF.left(String str, int len)|String|文字列の先頭から指定した文字数の文字列を取得する|
|SF.right(String str, int len)|String|文字列の最後から指定した文字数の文字列を取得する|
|SF.mid(String str, int pos, int len)|String|文字列の指定した位置から指定した文字数の文字列を取得する|
|SF.rightPad(String str, int size)|String|文字列の末尾に空白を埋めて指定された長さにする|
|SF.rightPad(String str, int size, char padChar)|String|文字列の末尾に指定した埋め込み文字を埋めて指定された長さにする|
|SF.leftPad(String str, int size)|String|文字列の先頭に空白を埋めて指定された長さにする|
|SF.leftPad(String str, int size, char padChar)|String|文字列の先頭に指定した埋め込み文字を埋めて指定された長さにする|
|SF.split(String str)|String[]|文字列を空白で区切って配列に格納する。nullが入力された場合はnullを返す|
|SF.split(String str, char separatorChar)|String[]|文字列を指定した区切り文字で区切って配列に格納する。nullが入力された場合はnullを返す|
|SF.split(String str, String separatorChars, int max)|String[]|文字列を指定した区切り文字で区切って配列に格納する。nullが入力された場合はnullを返す|
|SF.capitalize(String str)|String|文字列の先頭文字を大文字にする|
|SF.uncapitalize(String str)|String|文字列の先頭を小文字にする|
|SF.startsWith(CharSequence text)|String|指定されたテキストで始まるLIKE句用の検索文字列を生成する。引数のテキストはエスケープ処理される <Badge text="0.12.0+"/>|
|SF.contains(CharSequence text)|String|指定されたテキストを含むLIKE句用の検索文字列を生成する。引数のテキストはエスケープ処理される <Badge text="0.12.0+"/>|
|SF.endsWith(CharSequence text)|String|指定されたテキストで終わるLIKE句用の検索文字列を生成する。数のテキストはエスケープ処理される <Badge text="0.12.0+"/>|
