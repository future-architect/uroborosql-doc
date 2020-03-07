'use strict'

module.exports = {
  base: process.env.VUEPRESS_BASE || '/uroborosql-doc/',
  title: 'uroboroSQL',
  description: 'uroboroSQLはJava製のシンプルなSQL実行ライブラリです',
  serviceWorker: false,
  markdown: {
    // 行番号。表示すると狭いので削除したほうがいいならこの記述を削除
    lineNumbers: true,
    config: md => {
      md.use(require('markdown-it-task-lists'))
      md.use(require('markdown-it-mermaid').default)
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:description', content: 'uroboroSQLDeveloper-oriented and SQL centric database access library.' }],
    ['meta', { name: 'og:image', content: 'https://future-architect.github.io/uroborosql-doc/images/logo.png' }]
  ],
  plugins: [
    ['@vuepress/google-analytics', {
      ga: 'UA-93486523-1'
    }]
  ],
  locales: {
    '/': {
      lang: 'ja'
    }
  },
  evergreen: true,
  themeConfig: {
    logo: '/images/logo.png',
    repo: 'https://github.com/future-architect/uroborosql',
    docsRepo: 'https://github.com/future-architect/uroborosql-doc',
    docsDir: 'src',
    editLinks: true,
    lastUpdated: true,
    searchMaxSuggestions: 15,
    sidebarDepth: 2,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting_started/' },
      { text: '基本操作', link: '/basics/' },
      { text: '設定', link: '/configuration/' },
      { text: '高度な操作', link: '/advanced/' },
      { text: 'Developer Tools', link: '/developer_tools/' }
    ],
    sidebar: [
      {
        title: 'Why uroboroSQL',
        collapsable: true,
        children: [
          '/why_uroborosql/',
        ]
      },
      {
        title: 'Getting Started',
        collapsable: true,
        children: [
          '/getting_started/',
          '/getting_started/sql-file-access',
          '/getting_started/entity-access',
          '/getting_started/sql-repl',
        ]
      },
      {
        title: '前提知識',
        collapsable: true,
        children: [
          '/background/',
          '/background/el',
        ]
      },
      {
        title: '基本操作',
        collapsable: true,
        children: [
          '/basics/',
          '/basics/sql-file-api',
          '/basics/entity-api',
          '/basics/transaction',
        ]
      },
      {
        title: '設定',
        collapsable: true,
        children: [
          '/configuration/',
          '/configuration/connection-supplier',
          '/configuration/sql-context-factory',
          '/configuration/sql-agent-factory',
          '/configuration/sql-manager',
          '/configuration/sql-filter-manager',
          '/configuration/entity-handler',
          '/configuration/dialect',
        ]
      },
      {
        title: '高度な操作',
        collapsable: true,
        children: [
          '/advanced/',
        ]
      },
      '/developer_tools/',
      '/developer_guide/',
      '/license/',
      '/about/',
    ]
  }
}