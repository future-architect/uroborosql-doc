---
head:
  - - meta
    - name: og:title
      content: "2WaySQL"
  - - meta
    - name: og:url
      content: "/uroborosql-doc_v0.x/background/"
---

# 2WaySQL

**uroboroSQL**の基本操作について説明する前に**uroboroSQL**を利用する上で必要になる項目について説明します。

## 2WaySQLとは

2WaySQLは普通のSQL文をファイルに保存したものです。そのままSQLクライアントツールで実行することもできますし、**uroboroSQL**で読み込んで実行することも出来ます。  
（２つの実行方法があることから**2Way**SQLと呼ばれます）

## バインドパラメータ (`/* */`)

SQLにバインドするパラメータを `/*parameter name*/`の形式で指定することができます。

```sql
select
  *
from
  department
where
  dept_no    =  /*dept_no*/10
AND  dept_name  =  /*dept_name*/'Sales'
```

上の例では、`/*dept_no*/`, `/*dept_name*/` がバインドパラメータで、**uroboroSQL**から実行される際はこの部分が`?`に置き換わり、後ろの`10`や`'Sales'`が削除されます。

```sql
select
  *
from
  department
where
  dept_no    =  ?/*dept_no*/
and  dept_name  =  ?/*dept_name*/
```

### IN句の利用方法

List型の値をIN句のバインドパラメータとして指定することもできます。
::: warning
IN句にバインドパラメータを指定する場合、バインドパラメータの後ろに`()`を記述する必要があります。
:::

```sql
select
  *
from
  employee  emp
where
/*IF gender_list != null*/
and  emp.gender  in  /*gender_list*/('M')
/*END*/
```

上の例に`gender_list`として{"M", "F"}を指定すると以下のように変換されます。

```sql
select
  *
from
  employee  emp
where
/*IF gender_list != null*/
and  emp.gender  in  (?, ?)/*gender_list*/
/*END*/
```

### LIKE句の利用方法

LIKE句に対してバインドパラメータを使用する場合は、以下のように[StringFunction](./el.md#stringfunction-sf)を使って記述してください。

```sql
select
  *
from
  employee  emp
where
/*IF first_name != null*/
and  emp.first_name like /*SF.contains(first_name)*/'' escape /*#ESC_CHAR*/'$'
/*END*/
/*IF last_name != null*/
and  emp.last_name  like /*SF.startsWith(last_name)*/'' escape /*#ESC_CHAR*/'$'
/*END*/
```

上の例で、バインドパラメータ `first_name`に`a`, `last_name`に`D`を指定した場合は以下のようになります。

```sql
select
  *
from
  employee  emp
where
    emp.first_name like '%a%' escape '$'
and emp.last_name  like 'D%' escape '$'
/*END*/
```

上の例で、ワイルドカードを含む例としてバインドパラメータ `first_name`に`a%`, `last_name`に`D_`を指定した場合は以下のようになります。

```sql
select
  *
from
  employee  emp
where
    emp.first_name like '%a$%%' escape '$' -- %がエスケープされる
and emp.last_name  like 'D$_%' escape '$'  -- _がエスケープされる
/*END*/
```

::: tip
ワイルドカード（`%`や`_`）を含む文字列がバインドパラメータに指定された場合でも、[StringFunction](./el.md#stringfunction-sf)を利用することで文字列のエスケープ処理が適切に行われます。
:::

::: warning
エスケープキャラクタ（上記の例では`$`）はDB毎の設定（[Dialect](../configuration/dialect.md#dialect)）によって変わります。  
現在の設定では、Oracleの場合は`\`, その他のDBでは`$`となります。  
`\`や`$`のかわりに`/*#ESC_CHAR*/`と記載することでDB毎の設定を気にせずにエスケープ文字を指定することができます。<Badge text="0.14.0+" vertical="middle"/>
:::

## バインド出来るパラメータの型

バインドパラメータに指定できるJava型は以下になります。

- プリミティブ型とそのラッパー型（ただし char と java.lang.Character は除く）
- java.math.BigDecimal
- java.math.BigInteger
- java.lang.String
- byte[]
- java.sql.Date
- java.sql.Time
- java.sql.Timestamp
- java.sql.Array
- java.sql.Ref
- java.sql.Blob
- java.sql.Clob
- java.sql.SQLXML
- java.sql.Struct
- 列挙型(enum)
- java.util.Date
- java.util.Optional
- java.util.OptionalInt
- java.util.OptionalLong
- java.util.OptionalDouble
- java.time.LocalDateTime
- java.time.OffsetDateTime
- java.time.ZonedDateTime
- java.time.LocalDate
- java.time.LocalTime
- java.time.OffsetTime
- java.time.Year
- java.time.YearMonth
- java.time.MonthDay
- java.time.Month
- java.time.DayOfWeek

## 置換文字列 (`/*$ */` , `/*# */`)

置換文字列を使うとSQLを動的に変更することができます。

置換文字列は `/*$parameter name*/` もしくは `/*#parameter name*/`と記述します。  
 `/*#parameter name*/` と記述した場合は、置換文字列の前後を`'`(シングルクォート)で囲みます。

```sql
select
  *
from    /*$table_name*/
where
  gender  =  /*#gender*/
```

上の例では、`table_name`や`gender`に設定した値でSQLが置換されます。

- `table_name`に`employee`, `gender`に`M`を設定した場合

```sql
select
  *
from  employee
where
  gender  =  'M'
```

という風に置換されたSQLが実行されることになります。

::: danger 注意
置換文字列はSQLインジェクションなど脆弱性の原因となる可能性があります。十分に注意を払ったうえで利用してください
:::

::: tip
置換文字列はSQLインジェクションを防ぐため、変換の際にシングルクォート`'`を`''`にエスケープします
:::

::: warning
置換文字列はバインドパラメータとしてではなく実行されるSQLを構築する時点で置換される点に注意してください。  
データベースによってはSQL文が動的に変わることで解析結果のキャッシュが適用されず、  
解析処理が都度実行されることでCPUに負荷をかける可能性があります。
:::

## 条件分岐 ( `/*IF*/`, `/*ELIF*/`, `/*ELSE*/`, `/*END*/` )

`/*IF*/`, `/*ELIF*/`, `/*ELSE*/`, `/*END*/` を使用してSQLを動的に変更することができます。

### 記述方法

```sql
/*IF [評価式]*/
-- IFの評価式が真の場合に適用されるSQL
/*ELIF [評価式]*/
-- ELIFの評価式が真の場合に適用されるSQL
/*ELSE*/
-- IF,ELIFの評価式が偽の場合に適用されるSQL
/*END*/
```

`/*IF*/`, `/*ELIF*/`の評価式として式言語を利用します。
（ 式言語の説明は[こちら](./el.md#式言語) )  
また、標準でSF関数(*S*tring *F*unction)を使うことができます。

```sql
select
  *
from
  employee  emp
where
/*IF SF.isNotEmpty(birth_date_from) and SF.isNotEmpty(birth_date_to)*/
and  emp.birth_date  between  /*birth_date_from*/'1990-01-01'  and  /*birth_date_to*/'1999-12-31'
/*ELIF SF.isNotEmpty(birth_date_from)*/
and  emp.birth_date  >=    /*birth_date_from*/'1990-01-01'
/*ELIF SF.isNotEmpty(birth_date_to)*/
and  emp.birth_date  <    /*birth_date_to*/'1999-12-31'
/*ELSE*/
/*END*/
```

上の例ではIFの評価式として`SF.isNotEmpty()`を使用してバインドパラメータが`null`または`""`でないことを評価しています。

::: tip 評価式に渡されるバインドパラメータの型
[バインド出来るパラメータの型](#バインド出来るパラメータの型) にもあるようにバインドパラメータには色々なJava型のオブジェクトを設定することができます。  
評価式の中ではバインドパラメータをオブジェクトとして扱うことができます。  
例えば、バインドパラメータ `now_date` に LocalDate型のオブジェクト `java.time.LocalDate.now()` をバインドした場合、評価式の中では  
`/*IF now_date != null and now_date.getMonth().getValue() == 3 */ -- 現在の月が3月だったら`  
のようなLocalDate型のインスタンスメソッドを呼び出した結果で評価を行うことが出来ます。  
上記の場合、式言語のプロパティアクセスを利用して  
`/*IF now_date != null and now_date.month.value == 3 */ -- 現在の月が3月だったら`  
という書き方も出来ます。
:::

バインドパラメータとして`birth_date_from`に`2000-01-01`, `birth_date_to`に`2010-12-31`を指定した場合、生成されるSQLは以下のようになります。

```sql
select
  *
from
  employee  emp
where
  emp.birth_date  between  ?/*birth_date_from*/  and  ?/*birth_date_to*/
```

最後にバインドパラメータが評価され、実行されるSQLが以下になります。

```sql
select
  *
from
  employee  emp
where
  emp.birth_date  between  '2000-01-01'/*birth_date_from*/  and  '2010-12-31'/*birth_date_to*/
```

ここで`emp.birth_date`の前にあった`and`が消えていることに注目してください。
::: tip
**uroboroSQL**では動的SQLを生成する際、WHERE句の後ろに`and`や`or`が来る場合はそれを削除してSQL文として正しい状態にします
:::

ただし、上の加工前SQLのようにSQL文として不正な状態になってしまうのでSQLクライアントツールからは実行できないという欠点もあります。  
このようにSQL文として不正になることを防ぐために、WHERE句のあとに他に影響を与えない評価を入れる方法があります。

```sql
select
  *
from
  employee  emp
where
  1        =    1  // <-- 必ずtrueとなる評価を入れる
/*IF SF.isNotEmpty(birth_date_from) and SF.isNotEmpty(birth_date_to)*/
and  emp.birth_date  between  /*birth_date_from*/'1990-01-01'  and  /*birth_date_to*/'1999-12-31'
/*ELIF SF.isNotEmpty(birth_date_from)*/
and  emp.birth_date  >=    /*birth_date_from*/'1990-01-01'
/*ELIF SF.isNotEmpty(birth_date_to)*/
and  emp.birth_date  <    /*birth_date_to*/'1999-12-31'
/*ELSE*/
/*END*/
```

## 範囲の有効化 ( `/*BEGIN*/`, `/*END*/` )

`/*BEGIN*/`, `/*END*/` で囲まれた範囲は、その中の`/*IF*/`, `/*ELIF*/`のうち、どれか1つでも真(true)になった場合に出力されます。  
範囲内の全ての評価式が偽（false）の場合、`/*BEGIN*/`, `/*END*/` で囲まれた範囲は出力されません。

```sql
select
  *
from
  employee  emp
/*BEGIN*/
where
/*IF SF.isNotEmpty(first_name)*/
and  emp.first_name  =  /*first_name*/'Bob'
/*END*/
/*IF SF.isNotEmpty(last_name)*/
and  emp.last_name  =  /*last_name*/'Smith'
/*END*/
/*END*/
```

上の例で、バインドパラメータ `first_name`に`Willson`, `last_name`に`null`を指定した場合は以下のようになります。

```sql
select
  *
from
  employee  emp
where
  emp.first_name  =  ?/*first_name*/
```

バインドパラメータ `first_name`, `last_name`ともに`null`を指定した場合は以下のようになります。

```sql
select
  *
from
  employee  emp
```

`/*BEGIN*/`,`/*END*/`で囲まれた`where`が出力されていないことがわかります。

## 不要なカンマの除去

IF分岐を使って動的なSQLを構築する場合、カンマの有無が問題になる場合があります。  
以下のSQLを例として説明します。

```sql
select
/*IF detail*/
,  first_name
,  last_name
,  birth_date
,  gender
/*END*/
,  emp_no
from
  employee  emp
order by
/*IF detail*/
,  birth_date
/*END*/
,  emp_no
```

ここでバインドパラメータ`detail`に`true`を指定した場合、生成されるSQLは以下になります。

```sql
select
,  first_name
,  last_name
,  birth_date
,  gender
,  emp_no
from
  employee  emp
order by
,  birth_date
,  emp_no
```

このSQLでは`select`の直後や`order by`の直後にカンマが出現しておりSQL文として不正であるため、SQLの実行に失敗します。  
これを避けるため**uroboroSQL**では、生成後のSQLに含まれる不要なカンマを除去するようになっています。

実際に生成されるSQLは以下になります。

```sql
select
  first_name     -- 先頭のカンマが除去される
,  last_name
,  birth_date
,  gender
,  emp_no
from
  employee  emp
order by
  birth_date     -- 先頭のカンマが除去される
,  emp_no
```

カンマが除去されるのは、以下の予約語の直後にカンマが出現した場合です（大文字小文字の区別無し）。

- SELECT
- ORDER BY
- GROUP BY
- (
- SET
