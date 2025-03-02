---
head:
  - - meta
    - name: og:title
      content: "エンティティクラスを使用したDBアクセス"
  - - meta
    - name: og:url
      content: "/uroborosql-doc_v0.x/getting_started/entity-access.html"
---

# エンティティクラスを使用したDBアクセス

**uroboroSQL**ではSQLファイルを使用したDBアクセスの他にエンティティクラスを使用したDBアクセスも提供しています。（[EntityApiSample.java](https://github.com/future-architect/uroborosql-sample/blob/main/src/main/java/jp/co/future/uroborosql/sample/EntityApiSample.java)を参照）

## エンティティクラスを使用した検索

エンティティクラスを使用した検索を行う際は、`SqlAgent#query(エンティティクラス)`メソッドを使用して**SqlEntityQuery**を取得し、バインドパラメータの設定や検索の実行を行います。

**SqlEntityQuery**では検索結果をいくつかの形式で取得することができます。

| メソッド                 | 説明                                                                                                             |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------- |
| SqlEntityQuery#collect() | 検索結果を`List<エンティティクラス>`の形式で取得する                                                             |
| SqlEntityQuery#stream()  | 検索結果を`java.util.Stream`の形式で取得する                                                                     |
| SqlEntityQuery#first()   | 検索結果の１件目を取得する。戻り値は`Optional`                                                                   |
| SqlEntityQuery#one()     | 検索結果の１件目を取得する。検索結果が複数件になる場合は`DataNonUniqueException`をスローする。戻り値は`Optional` |

まずはテーブルに紐づくエンティティクラスを作成します。

- Department.java

```java
package jp.co.future.uroborosql.sample.entity;

import jp.co.future.uroborosql.enums.GenerationType;
import jp.co.future.uroborosql.mapping.annotations.GeneratedValue;
import jp.co.future.uroborosql.mapping.annotations.Id;
import jp.co.future.uroborosql.mapping.annotations.Table;
import jp.co.future.uroborosql.mapping.annotations.Version;

/**
 * Entity that can be mapped to department table
 */
@Table(name = "department")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long deptNo;

    private String deptName;

    @Version
    private long lockVersion;

    public long getDeptNo() {
        return this.deptNo;
    }

    public void setDeptNo(final long deptNo) {
        this.deptNo = deptNo;
    }

    public String getDeptName() {
        return this.deptName;
    }

    public void setDeptName(final String deptName) {
        this.deptName = deptName;
    }

    public long getLockVersion() {
        return this.lockVersion;
    }

    public void setLockVersion(final long lockVersion) {
        this.lockVersion = lockVersion;
    }

    @Override
    public String toString() {
        return "Department [deptNo=" + this.deptNo + ", deptName=" + this.deptName + ", lockVersion="
                + this.lockVersion + "]";
    }
}
```

`@Table`アノテーションをクラスに指定することでテーブルとの紐づけを行います。上記の場合はdepartmentテーブルと紐づけています。  
エンティティクラスの詳細については[DAOインタフェース](../basics/entity-api.md#daoインタフェース)を参照してください。

この`Department`クラスを使用した検索は以下のようになります。

```java
// no parameter : バインドパラメータ指定なしで検索
List<Department> deps1 = agent.query(Department.class)
    .collect();
// add bind parameter : バインドパラメータを設定して検索
List<Department> deps2 = agent.query(Department.class)
    .equal("deptNo", 1)
    .collect();
```

検索結果の各行が`Department`クラスのインスタンスとして取得出来ます。

## エンティティクラスを使用した行挿入

エンティティクラスを使用してテーブルに行挿入を行うことが出来ます。行挿入を行う場合は`SqlAgent#insert(エンティティクラスインスタンス)`メソッドを使用します。

```java
Department dept = new Department();
dept.setDeptName("production");
// insert entity : 行挿入
int count = agent.insert(dept);
```

## エンティティクラスを使用した行更新

エンティティクラスを使用してテーブルの行更新を行うことが出来ます。行更新を行う場合は`SqlAgent#update(エンティティクラスインスタンス)`メソッドを使用します。

```java
Department dept = agent.query(Department.class)
    .first().orElseThrow(UroborosqlRuntimeException::new);
dept.setDeptName("R&D");
// update entity : 行更新
int count = agent.update(dept);
```

## エンティティクラスを使用した行削除

エンティティクラスを使用してテーブルの行削除を行うことが出来ます。行更新を行う場合は`SqlAgent#delete(エンティティクラスインスタンス)`メソッドを使用します。

```java
Department dept = agent.query(Department.class)
    .first().orElseThrow(UroborosqlRuntimeException::new);
// delete entity : 行削除
int count = agent.delete(dept);
```

エンティティクラスを使用したDBアクセスの詳細については[DAOインタフェース](../basics/entity-api.md#daoインタフェース)を参照してください。

**uroboroSQL**ではこれらの基本的な操作のほか、バッチ処理やトランザクション処理なども行うことができます。
詳細については[基本操作](../basics/)を参照してください。
