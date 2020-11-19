(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{216:function(t,e,a){"use strict";a.r(e);var n=a(3),l=Object(n.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"sqlconfigの生成"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sqlconfigの生成"}},[t._v("#")]),t._v(" SqlConfigの生成")]),t._v(" "),a("p",[a("strong",[t._v("uroboroSQL")]),t._v("ではSqlConfigを生成するタイミングで各種の設定を行うことによりライブラリの動作や実行されるSQLを変更することができます。")]),t._v(" "),a("p",[t._v("シンプルな設定")]),t._v(" "),a("div",{staticClass:"language-java line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// create SqlConfig H2DBのメモリDBに接続する")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SqlConfig")]),t._v(" config "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("UroboroSQL")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("builder")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"jdbc:h2:mem:test;DB_CLOSE_DELAY=-1"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"sa"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('""')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("build")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br")])]),a("p",[a("code",[t._v("UroboroSQL")]),t._v("ビルダー取得API（"),a("code",[t._v("UroboroSQL.UroboroSQLBuilder")]),t._v("）")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("メソッド名")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("説明")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("builder()")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("DB接続設定を行っていないビルダーを取得")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("builder(Connection conn)")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("引数で指定したコネクションでDB接続するビルダーを取得")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("builder(DataSource dataSource)")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("引数で指定したデータソースを使ってDB接続するビルダーを取得")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("builder(String url, String user, String password)")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("引数で指定したDB接続情報を元にDB接続するビルダーを取得")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("builder(String url, String user, String password, String schema)")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("引数で指定したDB接続情報を元にDB接続するビルダーを取得")])])])]),t._v(" "),a("p",[t._v("上記APIで取得した"),a("code",[t._v("UroboroSQL.UroboroSQLBuilder")]),t._v("に対して下記の設定クラスを設定することで、設定変更ができます。")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("設定するクラス")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("説明")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("RouterLink",{attrs:{to:"/configuration/connection-supplier.html#connectionsupplier"}},[t._v("ConnectionSupplier")])],1),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("JDBCコネクション提供クラス")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("RouterLink",{attrs:{to:"/configuration/sql-context-factory.html#sqlcontextfactory"}},[t._v("SqlContextFactory")])],1),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("SQLコンテキスト生成クラス")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("RouterLink",{attrs:{to:"/configuration/sql-agent-factory.html#sqlagentfactory"}},[t._v("SqlAgentFactory")])],1),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("SQL実行クラス("),a("code",[t._v("SqlAgent")]),t._v(")生成クラス")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("RouterLink",{attrs:{to:"/configuration/sql-manager.html#sqlmanager"}},[t._v("SqlManager")])],1),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("SQLファイル管理クラス")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("RouterLink",{attrs:{to:"/configuration/sql-filter-manager.html#sqlfiltermanager"}},[t._v("SqlFilterManager")])],1),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("SQLフィルター管理クラス")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("RouterLink",{attrs:{to:"/configuration/entity-handler.html#entityhandler"}},[t._v("EntityHandler")])],1),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("エンティティ処理クラス")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("RouterLink",{attrs:{to:"/configuration/dialect.html#dialect"}},[t._v("Dialect")])],1),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Database方言を表すクラス")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("a",{attrs:{href:"https://docs.oracle.com/javase/jp/8/docs/api/java/time/Clock.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Clock"),a("OutboundLink")],1)]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("タイムゾーンを使用して現在の時点、日付および時間へのアクセスを提供するクロック")])])])])])}),[],!1,null,null,null);e.default=l.exports}}]);