---
url: /uroborosql-doc/advanced/sql-coverage.md
---

# SQLカバレッジ

これまでアプリケーション上の条件分岐はカバレッジツールを利用して網羅率を確認することができました。\
しかし、SQL文の条件分岐は実際にその分岐が通っているかどうかを確認する手段がなく、リリース後に初めて通った条件で不具合を発生させることがありました。\
この問題を解決するために**uroboroSQL**では、SQL文の条件分岐を集計してカバレッジレポートを行う機能を提供します。

SQLカバレッジは**uroboroSQL**を利用するアプリケーションの起動時オプションに

```md
-Duroborosql.sql.coverage=true
```

を追加することで有効になります。\
SQLカバレッジを有効にするとアプリケーションが実行している間に実行されるSQLについて、カバレッジ情報が収集されます。\
カバレッジ情報の収集結果は標準では`target/coverage/sql-cover.xml`に出力されます。\
このファイルの場所や名前を変更したい場合は、起動時オプションに

```md
-Duroborosql.sql.coverage.file=[出力ファイルパス]
```

を指定してください。

出力された`sql-cover.xml`をJenkinsのCobertura pluginなどのXMLレポートとして読み込むとSQLファイルのカバレッジレポートが参照できるようになります。

![カバレッジレポート例](/assets/cobertura.CekyfXBT.png "Jenkins Cobertura Report"){width=600px}

またより、**uroboroSQL**のみでHTMLレポートを出力することができるようになりました。\
起動時オプションに

```md
-Duroborosql.sql.coverage=jp.co.future.uroborosql.coverage.reports.html.HtmlReportCoverageHandler
```

を指定することで本機能を利用することができます。

カバレッジ情報はデフォルトでは`target/coverage/sql`フォルダ配下に出力されます。\
出力先フォルダを変更した場合は、起動時オプションに

```md
-Duroborosql.sql.coverage.dir=[出力フォルダパス]
```

を指定してください。

出力されたレポートのサンプルは下記を参照してください。

## サマリーページ

![HTML Coverage Report Summary](/assets/html_coverage_report_summary.Tyh867tK.png){width=800px}

## 詳細ページ

![HTML Coverage Report](/assets/html_coverage_report.RQGV3Ebh.png){width=800px}

出力サンプル
