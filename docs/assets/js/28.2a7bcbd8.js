(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{62:function(t,s,a){"use strict";a.r(s);var e=a(0),n=Object(e.a)({},function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"sql-repl"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sql-repl","aria-hidden":"true"}},[t._v("#")]),t._v(" SQL-REPL")]),t._v(" "),a("p",[t._v("ここまではJavaアプリケーションから"),a("strong",[t._v("uroboroSQL")]),t._v("を利用する場合の説明でした。\n"),a("strong",[t._v("uroboroSQL")]),t._v("にはもう一つ特徴的な機能として、SQLを対話しながら実行するための "),a("strong",[t._v("REPL(Read-Eval-Print Loop)")]),t._v(" 機能を提供しています。")]),t._v(" "),a("p",[t._v("今度はこの"),a("strong",[t._v("REPL")]),t._v("機能を利用してみましょう。")]),t._v(" "),a("h2",{attrs:{id:"replの利用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#replの利用","aria-hidden":"true"}},[t._v("#")]),t._v(" REPLの利用")]),t._v(" "),a("p",[a("strong",[t._v("REPL")]),t._v("を起動するためには"),a("code",[t._v("jp.co.future.uroborosql.client.SqlREPL")]),t._v("クラスを実行する必要があります。\nサンプルアプリケーションで"),a("code",[t._v("SqlREPL")]),t._v("クラスを実行するためには以下のコマンドを実行します。")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("mvn -PREPL\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("実行すると以下のようにタイトル表示とコマンド説明、設定値の情報が表示され、そのあとコマンド入力状態になります。")]),t._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("Not found: /Users/hoshi-k/src/git/uroborosql/uroborosql-doc-github/docs/getting_started/repl/prompt.sh")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"})]),a("p",[a("strong",[t._v("REPL")]),t._v("を立ち上げた状態では接続したDB（H2DB メモリDB）には何もない状態なので、まずはテーブルを作成します。\nサンプルアプリケーションで利用できるSQLファイルを確認しましょう。")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("uroborosql "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" list"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Enter"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("と入力してください。")]),t._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("Not found: /Users/hoshi-k/src/git/uroborosql/uroborosql-doc-github/docs/getting_started/repl/list.sh")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"})]),a("p",[t._v("ロード済みのSQLファイルの"),a("code",[t._v("SQL名")]),t._v("がわかります。\nテーブルを作成するために"),a("code",[t._v("ddl/create_tables")]),t._v("を実行します。\n"),a("code",[t._v("ddl/create_tables")]),t._v("はDDLなので実行するためには"),a("code",[t._v("update")]),t._v("コマンドを使用します。")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("uroborosql "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Tab"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("と入力してください。")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("uroborosql "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" update\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("という風に"),a("code",[t._v("u")]),t._v("に一致するコマンドがコード補完されます。")]),t._v(" "),a("div",{staticClass:"tip custom-block"},[a("p",[a("strong",[t._v("REPL")]),t._v("では"),a("code",[t._v("[Tab]")]),t._v("を押下することでコマンドや"),a("code",[t._v("SQL名")]),t._v("、バインドパラメータなどが必要に応じでコード補完されます。")])]),t._v(" "),a("p",[t._v("続いて")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("uroborosql "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" update d"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Tab"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("と入力してください。"),a("br"),t._v("\n今度は"),a("code",[t._v("ddl")]),t._v("に一致する"),a("code",[t._v("SQL名")]),t._v("の候補が表示されます。")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("uroborosql "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" update d\nddl/create_tables   department/insert_department   department/select_department\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br")])]),a("p",[t._v("この状態で"),a("code",[t._v("[Tab]")]),t._v("を入力することで候補を選択することが出来ます。"),a("br"),t._v(" "),a("code",[t._v("ddl/create_tables")]),t._v("を選択して"),a("code",[t._v("[Enter]")]),t._v("を入力すると以下のようになります。")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("uroborosql "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" update ddl/create_tables\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("もう一度"),a("code",[t._v("[Enter]")]),t._v("を入力するとSQLが実行されます。")]),t._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("Not found: /Users/hoshi-k/src/git/uroborosql/uroborosql-doc-github/docs/getting_started/repl/create_tables.sql")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"})]),a("p",[a("code",[t._v("ddl/create_tables")]),t._v("が実行され、DBにテーブルが作成されました。\n続いて初期データを投入しましょう。")]),t._v(" "),a("p",[a("code",[t._v("setup/insert_data")]),t._v("を実行します。")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("uroborosql "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" update setup/insert_data"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Enter"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("Not found: /Users/hoshi-k/src/git/uroborosql/uroborosql-doc-github/docs/getting_started/repl/insert_data.sql")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"})]),a("p",[t._v("これでテーブルに初期データが挿入されました。\nでは、挿入したデータを検索してみましょう。")]),t._v(" "),a("p",[t._v("検索を行う場合は"),a("code",[t._v("query")]),t._v("コマンドを使用します。\n"),a("code",[t._v("query")]),t._v("の後に実行する"),a("code",[t._v("SQL名")]),t._v("を指定します。")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("uroborosql "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" query department/select_department"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Enter"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("Not found: /Users/hoshi-k/src/git/uroborosql/uroborosql-doc-github/docs/getting_started/repl/select_department_1.sql")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"})]),a("p",[t._v("ここではバインドパラメータを指定しなかったため、絞込み条件のないSQLが実行され検索結果として4件のデータが取得できました。")]),t._v(" "),a("p",[a("strong",[t._v("REPL")]),t._v("では上の結果のように、")]),t._v(" "),a("ul",[a("li",[t._v("実行するSQL")]),t._v(" "),a("li",[t._v("バインドパラメータ")]),t._v(" "),a("li",[t._v("SQL文の中の評価式とその評価結果")]),t._v(" "),a("li",[t._v("検索結果")]),t._v(" "),a("li",[t._v("実行時間")])]),t._v(" "),a("p",[t._v("が表示されるので、SQLがどういう風に実行され、どういう値が取得できるのかが良く分かるようになっています。")]),t._v(" "),a("p",[t._v("次にバインドパラメータを指定して検索してみましょう。")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("uroborosql "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" query department/select_department "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("deptNo")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Enter"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("Not found: /Users/hoshi-k/src/git/uroborosql/uroborosql-doc-github/docs/getting_started/repl/select_department_2.sql")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"})]),a("p",[a("code",[t._v("deptNo")]),t._v("に"),a("code",[t._v("1")]),t._v("を指定して検索しています。\nこの時、SQL文の評価式である/*IF SF.isNotEmpty(deptNo)*/が"),a("code",[t._v("true")]),t._v("となりSQLのwhere句に"),a("code",[t._v("dept_no")]),t._v("の条件が追加されバインドパラメータがバインドされます。"),a("br"),t._v("\nその結果、検索結果は1件になっています。")]),t._v(" "),a("p",[t._v("このように"),a("code",[t._v("SQL名")]),t._v("の後ろに"),a("code",[t._v("バインドパラメータ名")]),t._v("="),a("code",[t._v("値")]),t._v("という形でバインドパラメータを記述することでバインドパラメータを指定してSQLを実行することができます。")]),t._v(" "),a("p",[t._v("バインドパラメータが複数ある場合は"),a("code",[t._v("バインドパラメータ名1")]),t._v("="),a("code",[t._v("値1")]),t._v(" "),a("code",[t._v("バインドパラメータ名2")]),t._v("="),a("code",[t._v("値2")]),t._v(" ... という風に各パラメータの間を空白で区切って指定してください。")]),t._v(" "),a("ul",[a("li",[t._v("バインドパラメータを複数指定する例")])]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("uroborosql "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" query department/select_department "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("deptNo")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("deptName")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("sales"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Enter"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("Not found: /Users/hoshi-k/src/git/uroborosql/uroborosql-doc-github/docs/getting_started/repl/select_department_3.sql")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"})]),a("p",[a("strong",[t._v("REPL")]),t._v("を終了する場合はコマンド"),a("code",[t._v("quit")]),t._v(",もしくは"),a("code",[t._v("exit")]),t._v("を入力してください。")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[t._v("uroborosql "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" quit"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Enter"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\nSQL REPL end.\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br")])]),a("p",[t._v("終了メッセージが表示されてREPLが終了します。")]),t._v(" "),a("p",[a("strong",[t._v("REPL")]),t._v("には他にも以下のコマンドがあります。")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("コマンド")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("説明")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("query")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("検索SQLを実行します")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("update")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("更新SQL（insert/update/delete）やDDLを実行します")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("view")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("SQL名で指定したSQLの内容を表示します")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("list")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("使用可能なSQL名の一覧を表示します")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("history")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("実行したコマンドの履歴を表示します")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("driver")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("使用可能なJDBCドライバーの一覧を表示します")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("desc")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("指定したテーブルの定義情報を表示します")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("generate")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("指定したテーブルに対するselect/insert/update/deleteを行うSQLを生成します")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("cls")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("コンソール画面のクリア")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("exit")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("REPLを終了します")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("help")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("利用できるコマンドの説明を表示します")])])])]),t._v(" "),a("h2",{attrs:{id:"replの設定"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#replの設定","aria-hidden":"true"}},[t._v("#")]),t._v(" REPLの設定")]),t._v(" "),a("p",[t._v("さて、ここまでREPLの操作を説明してきましたが、DB接続情報やSQLファイルの場所はどこで指定していたのでしょうか。\n実は"),a("code",[t._v("jp.co.future.uroborosql.client.SqlREPL")]),t._v("を実行する際、引数としてプロパティファイルを指定します。このプロパティファイルにDB接続情報やSQLファイルの場所などREPLを実行するのに必要な情報が記載されています。")]),t._v(" "),a("p",[t._v("pom.xmlのREPL実行部分")]),t._v(" "),a("div",{staticClass:"language-xml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-xml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("plugin")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("groupId")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("org.codehaus.mojo"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("groupId")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("artifactId")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("exec-maven-plugin"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("artifactId")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("executions")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("execution")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("id")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("repl"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("id")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("goals")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("goal")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("java"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("goal")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("goals")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("configuration")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("workingDirectory")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("${basedir}"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("workingDirectory")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("mainClass")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("jp.co.future.uroborosql.client.SqlREPL"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("mainClass")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("arguments")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n          "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("argument")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("REPL/repl.properties"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("argument")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("arguments")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("configuration")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("phase")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("process-test-classes"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("phase")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("execution")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("executions")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("plugin")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br"),a("span",{staticClass:"line-number"},[t._v("14")]),a("br"),a("span",{staticClass:"line-number"},[t._v("15")]),a("br"),a("span",{staticClass:"line-number"},[t._v("16")]),a("br"),a("span",{staticClass:"line-number"},[t._v("17")]),a("br"),a("span",{staticClass:"line-number"},[t._v("18")]),a("br"),a("span",{staticClass:"line-number"},[t._v("19")]),a("br"),a("span",{staticClass:"line-number"},[t._v("20")]),a("br")])]),a("p",[t._v("初期設定ではプロパティファイルの場所は"),a("code",[t._v("REPL/repl.properties")]),t._v("になっています。")]),t._v(" "),a("ul",[a("li",[t._v("REPL/repl.properties")])]),t._v(" "),a("div",{staticClass:"language-properties line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-properties"}},[a("code",[a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("db.url")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[t._v("jdbc:h2:file:./target/db/repldb;")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("db.user")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[t._v("sa")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("db.password")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("sql.additionalClassPath")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[t._v("${user.home}/.m2/repository/com/h2database/h2/1.4.192/h2-1.4.192.jar")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br")])]),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("プロパティ名")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("説明")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("db.url")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("DB接続URL")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("db.user")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("DB接続ユーザ")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("db.password")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("DB接続パスワード")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("sql.additionalClassPath")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[a("strong",[t._v("REPL")]),t._v("起動時に起動時クラスパス以外でクラスパスに追加する場所。"),a("code",[t._v(";")]),t._v("で区切ることで複数指定可。SQLファイルのルート（sqlフォルダの親フォルダ）をクラスパスに追加することで、自動的にSQLファイルがロードされます。合わせて接続するDBのJDBCドライバを含むJarを指定することで動的にJDBCドライバを読み込みます。")])])])]),t._v(" "),a("p",[t._v("このプロパティファイルを変更することでいろいろなDBに接続することができるようになります。")]),t._v(" "),a("p",[t._v("これまで見てきたように"),a("strong",[t._v("REPL")]),t._v("を利用することで簡単にSQL実行や動作確認ができるので、SQL開発には欠かせないツールになります。\n色々なSQLを記述して"),a("strong",[t._v("REPL")]),t._v("で試してみてください。")]),t._v(" "),a("p",[t._v("これで "),a("em",[t._v("Getting Started")]),t._v(" は終了です。")]),t._v(" "),a("p",[a("strong",[t._v("uroboroSQL")]),t._v("で使用するSQLの文法や基本的な操作については"),a("a",{attrs:{href:"../basics"}},[t._v("基本操作")]),t._v("を参照してください。")])])},[],!1,null,null,null);s.default=n.exports}}]);