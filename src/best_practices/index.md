---
head:
  - - meta
    - name: og:title
      content: "ベストプラクティス"
  - - meta
    - name: og:url
      content: "/uroborosql-doc/best_practices/"
---

# ベストプラクティス

**uroboroSQL** を使用してSQLを実行する際のベストプラクティスについて説明します。

1. [ResultSetの扱いによるメモリ効率の差異](#_1-resultsetの扱いによるメモリ効率の差異-collect-streamの違い)
2. [SELECT-INSERTやSELECT-UPDATEの実装方式の違い](#_2-select-insertやselect-updateの実装方式の違い)
3. [バッチ処理とバルク処理の違い](#_3-バッチ処理とバルク処理の違い)
4. [バッチ件数による性能の違い](#_4-バッチ件数による性能の違い)

## 1. ResultSetの扱いによるメモリ効率の差異(collect, streamの違い)

**uroboroSQL** では、検索結果の取得方法として `collect()` と `stream()` の2つのメソッドが提供されています。これらは内部的なResultSetの処理方法が異なり、メモリ使用量に大きな影響を与えます。

### collect()メソッドの特徴

`collect()` メソッドは、検索結果を **すべてメモリ上に読み込んでからList形式で返却** します。

```java
// すべての検索結果をメモリに読み込む
List<Product> products = agent.query(Product.class)
    .collect();
```

**メモリ使用の特徴:**

- 検索結果の全レコードが一度にメモリ上に展開される
- 返却されたListは検索後も保持され続ける
- 大量データの検索では OutOfMemoryError のリスクがある

**適している場面:**

- 検索結果が少量(〜100件程度)の場合
- 検索結果を複数回参照する必要がある場合
- 検索結果をソートや加工してから利用する場合

### stream()メソッドの特徴

`stream()` メソッドは、検索結果を **1件ずつ逐次的に処理するStream形式で返却** します。

```java
// 検索結果を1件ずつストリーム処理
agent.query(Product.class)
    .stream()
    .forEach(product -> processProduct(product)); // 1件ずつ処理
```

**メモリ使用の特徴:**

- 検索結果を1件ずつメモリに読み込み、処理後は破棄される
- 常に処理中の1件分のメモリしか使用しない
- 大量データでも安定したメモリ使用量を維持できる

**適している場面:**

- 検索結果が大量(100件以上)の場合
- 検索結果を1回だけ順次処理する場合
- メモリ使用量を抑制したい場合

### メモリ効率の比較

10万件のデータを処理する場合の違いを例に説明します。

**collect()を使用した場合:**

```java
// 10万件すべてがメモリに読み込まれる
List<Product> products = agent.query(Product.class)
    .collect();  // メモリ: 10万件分のオブジェクト

// 処理中もリスト全体がメモリに残る
for (Product product : products) {
    processProduct(product);
}
// 処理後もGCされるまでメモリに残る
```

**stream()を使用した場合:**

```java
// 1件ずつ処理され、処理後は解放される
agent.query(Product.class)
    .stream()
    .forEach(product -> processProduct(product));  // メモリ: 常に1件分のみ
// 処理完了後は自動的に解放される
```

### 推奨事項

- **小〜中規模のデータ(〜100件)**: `collect()` を使用して可読性とシンプルさを優先
- **大規模データ(100件以上)**: `stream()` を使用してメモリ効率を優先
- **件数が不明な場合**: `stream()` を使用して安全性を優先

特に大量データを扱うバッチ処理では、`stream()` の使用が必須となります。

## 2. SELECT-INSERTやSELECT-UPDATEの実装方式の違い

SELECT-INSERTやSELECT-UPDATEは、あるテーブルから取得したデータを別のテーブルに挿入または更新する処理です。  
**uroboroSQL** では以下の3つの実装方式があり、それぞれパフォーマンス特性が異なります。  
（以下ではSELECT-INSERTを例に解説します）

### 方式1: SQLによるSELECT-INSERT（最も高速）

データベースエンジン内で完結するため、最も高速に処理できます。

```sql
-- sample/insert_target_tables.sql
insert
into
	target_table
(
	col1
,	col2
,	col3
)
select
	col1	as	col1
,	col2	as	col2
,	col3	as	col3
from
	source_table	st
where
	st.condition	=	/*condition*/''
```

```java
// SQL内でSELECTとINSERTを同時に実行
int count = agent.update("sample/insert_target_tables")
    .param("condition", conditionValue)
    .count();
```

**特徴:**

- データベース内で処理が完結し、ネットワーク転送が不要
- トランザクション管理がシンプル
- 大量データでも高速に処理可能
- Javaアプリケーション側でのデータ加工ができない

**パフォーマンス:** ★★★★★（最速）

**適している場面:**

- データの加工が不要な単純なコピー処理
- 大量データ（数万件以上）の一括転送
- データベース間の同期処理

### 方式2: バッチ処理によるSELECT-INSERT（推奨）

検索結果をバッチでまとめてINSERTします。データ加工とパフォーマンスのバランスが良い方式です。

```java
// SELECTした結果をバッチINSERT
agent.inserts(agent.query(SourceEntity.class) // 検索結果のStreamをTargetEntityに変換しながらバッチインサートのパラメータとして渡す
    .stream()
    .map(sourceEntity -> {
        // データ加工が可能
        TargetEntity targetEntity = new targetEntity();
        targetEntity.setCol1(sourceEntity.getCol1());
        targetEntity.setCol2(transform(sourceEntity.getCol2())); // 加工処理
        targetEntity.setCol3(sourceEntity.getCol3());
        return targetEntity;
    }));
```

**特徴:**

- Javaコード内でデータ加工が可能
- バッチサイズ単位でまとめてINSERTされる（デフォルト1,000件）
- `stream()` を使用することでメモリ効率が良い
- ネットワーク転送は発生するが、バッチ化により最小化

**パフォーマンス:** ★★★★☆（高速）

**適している場面:**

- データの加工や変換が必要な場合
- ビジネスロジックを適用する必要がある場合
- 中〜大規模データ（数千〜数十万件）の処理

### 方式3: forループによる1件ずつINSERT（非推奨）

検索結果を1件ずつ個別にINSERTします。最も遅い方式です。

```java
// SELECTした結果を1件ずつINSERT
agent.query(SourceEntity.class)
    .stream()
    .forEach(sourceEntity -> {
        // データ加工が可能
        TargetEntity target = new TargetEntity();
        target.setCol1(sourceEntity.getCol1());
        target.setCol2(transform(sourceEntity.getCol2())); // 加工処理
        target.setCol3(sourceEntity.getCol3());

        agent.insert(target);
    });
```

**特徴:**

- 1件ごとにSQL実行とネットワーク転送が発生
- データベースへの負荷が高い
- トランザクション処理のオーバーヘッドが大きい
- `collect()` を使用する場合はメモリ使用量も大きい

**パフォーマンス:** ★☆☆☆☆（低速）

**適している場面:**

- ほぼ適している場面はない（レガシーコードの互換性維持など特殊な場合のみ）

### パフォーマンス比較

10万件のデータをSELECT-INSERTする場合の目安:

| 方式                      | 処理時間の目安 | ネットワーク転送                                    | メモリ使用量        |
| ------------------------- | -------------- | --------------------------------------------------- | ------------------- |
| 方式1: SQL内SELECT-INSERT | 1-2秒          | なし                                                | 最小                |
| 方式2: バッチ処理         | 5-10秒         | バッチ単位で発生（バッチサイズ:1,000の場合、100回） | 小（streamの場合）  |
| 方式3: 1件ずつINSERT      | 数分〜         | 10万回発生                                          | 大（collectの場合） |

### 推奨事項

- **データ加工が不要な場合**: 方式1（SQL内SELECT-INSERT）を使用
- **データ加工が必要な場合**: 方式2（バッチ処理）を使用
- **方式3は原則使用しない**: パフォーマンスが著しく低下するため避ける

特に大量データを扱う場合は、方式1または方式2を選択し、必ず `stream()` を使用してメモリ効率を確保してください。

## 3. バッチ処理とバルク処理の違い

**uroboroSQL** では、複数件のデータを効率的に登録・更新する方法として **バッチ処理** と **バルク処理** の2つが提供されています。  
これらは似ているように見えますが、内部動作とパフォーマンス特性が大きく異なります。

### バッチ処理の特徴

バッチ処理は、JDBCの `PreparedStatement.addBatch() や PreparedStatement.executeBatch()` を使用して、**更新コマンドと複数のパラメータ値のセットをまとめてデータベースに送信** する方式です。

```java
// バッチINSERT（DAO API）
Stream<Employee> employees = agent.query(Employee.class).stream();
agent.inserts(employees);

// バッチINSERT（SQLファイル API）
Stream<Product> products = agent.query(Product.class).stream();
agent.batch("example/insert_product")
    .paramStream(products)
    .count();
```

**内部動作:**

1. PreparedStatementを1つ作成
2. パラメータをバインドして `addBatch()` でバッファに追加
3. バッチサイズ（デフォルト1,000件）に達したら `executeBatch()` で一括実行
4. 全データ処理が完了するまで繰り返し

**特徴:**

- データベースへの送信回数が大幅に削減される
- ネットワークオーバーヘッドが最小化される
- 大量データ（数千〜数十万件）の処理に適している
- メモリ使用量が安定している

**パフォーマンス:** ★★★★★（大量データで高速）

### バルク処理の特徴

バルク処理は、**1つのINSERT文で複数行を同時に登録** する方式です。

```java
// バルクINSERT（DAO API）
Stream<Employee> employees = agent.query(Employee.class).stream();
agent.inserts(employees, InsertsType.BULK);
```

生成されるSQL:

```sql
insert
into
    employee
(
    col1
,   col2
,   col3
)
values
    (?, ?, ?)
,   (?, ?, ?)
,   (?, ?, ?)  -- 3行分を1つのINSERT文で
```

**内部動作:**

1. 複数件のデータを登録するINSERT文を生成（デフォルト10件ずつ）
2. 単一のSQL文として実行
3. 全データ処理が完了するまで繰り返し

**特徴:**

- 1回のSQL実行で複数件のデータを登録
- **一度に登録するデータ件数を増やすとSQL文が巨大化し、SQL文の生成コストも増加する**
- データベースによってはSQL文の長さ制限に抵触する可能性がある
- パース時間やメモリ消費が増加する
- DBの種類によってはバルクINSERTに対応していない場合がある（例: Oracle21c まで）

**パフォーマンス:** ★★★☆☆（少量データでは高速、大量データでは不適）

### バッチ処理とバルク処理の使い分け

| 項目               | バッチ処理                          | バルク処理                       |
| ------------------ | ----------------------------------- | -------------------------------- |
| 適切なデータ件数   | 数百件〜                            | **数十件まで**                   |
| SQL実行回数        | バッチサイズ単位（例: 1,000件ごと） | バッチサイズ単位（例: 10件ごと） |
| メモリ使用量       | 安定                                | データ量に比例して増加           |
| SQL文のサイズ      | 固定                                | データ量に比例して増加           |
| ネットワーク転送量 | 最小                                | 少量                             |

### 推奨事項

- **原則バッチ処理を使用**
- 処理時間の高速化が必要で、計測によりバッチ処理よりもバルク処理のほうが早く、かつ、メモリやCPU使用量の増加を許容できる場合のみバルク処理を採用する

::: danger **重要な注意点**

バルク処理は便利ですが、**データ件数が数十件を超える場合は使用しないでください**  
SQL文が巨大化することで以下の問題が発生する可能性があります:

- データベースのSQL文長制限に抵触（例: MySQLの `max_allowed_packet` 制限）
- パース時間の増加によるパフォーマンス低下
- メモリ使用量の急増
- ネットワーク転送時のタイムアウト

大量データの処理では、必ずバッチ処理を選択してください。
:::

## 4. バッチ件数による性能の違い

バッチ処理やバルク処理では、実行時にインサート条件としてバッチサイズを指定することで何件ごとにデータベースへ送信するかを制御できます。このバッチサイズの設定値によって処理性能が大きく変わります。

### バッチサイズの指定方法

```java
// DAO APIの場合
// バッチサイズを指定（デフォルトは1,000件）
agent.inserts(employees, (ctx, count, row) -> count == 500);  // 500件ごとに送信するようInsertConditionを指定

// SQLファイル APIの場合
agent.batch("example/insert_product")
    .paramStream(products)
    .by((ctx, row) -> ctx.batchCount() == 500)  // 500件ごとに送信
    .count();
```

### バッチサイズによる性能の違い

バッチサイズが小さすぎる場合と大きすぎる場合、それぞれ異なる問題が発生します。

**バッチサイズが小さい場合（例: 10件）:**

```java
// 10件ごとに送信
agent.inserts(employees, (ctx, count, row) -> count == 10);
```

- データベースへの送信回数が増加
- ネットワークオーバーヘッドが大きくなる
- 全体の処理時間が増加

**バッチサイズが大きい場合（例: 10,000件）:**

```java
// 10,000件ごとに送信
agent.inserts(employees, (ctx, count, row) -> count == 10000);
```

- 1回の送信データ量が増加
- PreparedStatementにバインドパラメータを格納するバッファの格納量が増えることでメモリ使用量が増加
- データベースのバッファサイズを超える可能性
- ネットワークタイムアウトのリスク増加

### 最適なバッチサイズ

10万件のデータをINSERTする場合の処理時間の目安  
**（DBの性能やネットワーク環境により大きく変わるため、あくまで目安として参照してください）**

| バッチサイズ | 処理時間の目安 | データベース送信回数 | 特徴                           |
| -----------: | -------------- | -------------------: | ------------------------------ |
|         10件 | 30-40秒        |             10,000回 | 送信回数が多すぎて非効率       |
|        100件 | 12-15秒        |              1,000回 | やや送信回数が多い             |
|      1,000件 | 5-10秒         |                100回 | **バランスが良い（推奨）**     |
|      5,000件 | 6-12秒         |                 20回 | メモリ使用量増加、効果は限定的 |
|     10,000件 | 7-15秒         |                 10回 | メモリ使用量大、リスク増加     |

### 推奨事項

- **デフォルト値（1,000件）を使用**: ほとんどのケースで最適なパフォーマンスを発揮
- **特殊な要件がある場合のみ調整**:
  - メモリが非常に限られている環境: 500件程度に削減
  - 高速ネットワーク環境で超大量データ: 2,000-5,000件に増加

::: danger **調整する場合は必ず計測する**
バッチ処理やバルク処理の処理時間は環境によって最適値が異なるため、**必ず**実測して効果を確認したうえで変更すること
:::
