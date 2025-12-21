import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig as defineConfigBase } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import markdownItTaskLists from "markdown-it-task-lists";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getLinkItem(link) {
  let filePath = path.join(__dirname, "..", link).replace(/\.html$/, ".md");
  if (filePath.endsWith("/") || filePath.endsWith("\\")) {
    filePath = path.join(filePath, "index.md");
  }
  const text = parseMarkdown(filePath).title;
  return { text, link };
}

/** @type {import("vitepress").DefaultTheme.Sidebar} */
const links = {
  "/": [
    {
      text: "Why uroboroSQL",
      collapsed: true,
      items: [getLinkItem("/why_uroborosql/")],
    },
    {
      text: "Getting Started",
      collapsed: true,
      items: [
        getLinkItem("/getting_started/"),
        getLinkItem("/getting_started/sql-file-access.html"),
        getLinkItem("/getting_started/entity-access.html"),
        getLinkItem("/getting_started/sql-repl.html"),
      ],
    },
    {
      text: "前提知識",
      collapsed: true,
      items: [getLinkItem("/background/"), getLinkItem("/background/el.html")],
    },
    {
      text: "基本操作",
      collapsed: true,
      items: [
        getLinkItem("/basics/"),
        getLinkItem("/basics/sql-file-api.html"),
        getLinkItem("/basics/entity-api.html"),
        getLinkItem("/basics/transaction.html"),
      ],
    },
    {
      text: "設定",
      collapsed: true,
      items: [
        getLinkItem("/configuration/"),
        getLinkItem("/configuration/connection-supplier.html"),
        getLinkItem("/configuration/sql-agent-provider.html"),
        getLinkItem("/configuration/execution-context-provider.html"),
        getLinkItem("/configuration/sql-resource-manager.html"),
        getLinkItem("/configuration/event-listener-holder.html"),
        getLinkItem("/configuration/dialect.html"),
      ],
    },
    {
      text: "高度な操作",
      collapsed: true,
      items: [getLinkItem("/advanced/")],
    },
    getLinkItem("/developer_tools/"),
    getLinkItem("/developer_guide/"),
    getLinkItem("/license/"),
    getLinkItem("/about/"),
  ],
};

/**
 * @typedef {import('vitepress').UserConfig<import('vitepress').DefaultTheme.Config>} VitepressConfig
 */
/**
 * @param {VitepressConfig} config config
 * @returns {VitepressConfig} config
 */
function defineConfig(config) {
  return withMermaid(defineConfigBase(config));
}

export default defineConfig({
  title: "uroboroSQL",
  description: "uroboroSQLはJava製のシンプルなSQL実行ライブラリです",
  outDir: path.join(__dirname, "../../docs"),
  ignoreDeadLinks: "localhostLinks",
  markdown: {
    lineNumbers: true,
    config(md) {
      md.use(markdownItTaskLists);
    },
  },
  locales: {
    root: {
      lang: "ja",
    },
  },
  head: [
    ["link", { rel: "icon", href: "/uroborosql-doc/icon.png" }],
    ["meta", { name: "og:type", content: "website" }],
    [
      "meta",
      {
        name: "og:description",
        content:
          "uroboroSQLDeveloper-oriented and SQL centric database access library.",
      },
    ],
    [
      "meta",
      {
        name: "og:image",
        content:
          "https://future-architect.github.io/uroborosql-doc/images/logo.png",
      },
    ],
  ],
  srcExclude: ["./README.md"],
  base: "/uroborosql-doc/",
  themeConfig: {
    siteTitle: "", // ロゴがタイトルなのでテキストのタイトルは必要ありません。
    logo: "images/logo.png",
    footer: {
      copyright: `MIT Licensed | ©2018-${new Date().getFullYear()} Future Corporation. All rights reserved.`,
    },
    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },
    editLink: {
      pattern:
        "https://github.com/future-architect/uroborosql-doc/edit/main/src/:path",
    },
    outline: {
      level: "deep",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting_started/" },
      { text: "基本操作", link: "/basics/" },
      { text: "設定", link: "/configuration/" },
      { text: "高度な操作", link: "/advanced/" },
      { text: "Developer Tools", link: "/developer_tools/" },
      {
        text: "Old Version",
        link: "https://future-architect.github.io/uroborosql-doc_v0.x/",
      },
    ],

    sidebar: links,

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/future-architect/uroborosql",
      },
    ],
  },
});

function parseMarkdown(filePath) {
  const result = {
    title: "",
  };
  const contents = fs.readFileSync(filePath, "utf8");
  let markdownContents = contents;
  const frontmatterMatch = /^---([\s\S]+?)---/u.exec(contents);
  if (frontmatterMatch) {
    // eslint-disable-next-line prefer-destructuring
    const frontmatter = frontmatterMatch[1];
    const title = /(?:^|\n)title\s*:\s*([^\n]+)\s*\n/u.exec(frontmatter);
    if (title) {
      // eslint-disable-next-line prefer-destructuring
      result.title = title[1];
    }
    markdownContents = contents.slice(frontmatterMatch[0].length);
  }
  if (!result.title) {
    const h1Match = /(?:^|\n)#\s+([^\n]+)\n/u.exec(markdownContents);
    if (h1Match) {
      // eslint-disable-next-line prefer-destructuring
      const title = h1Match[1];
      result.title = title
        .replace(/`[^`]*`|\\.|<[^>]+>/gu, (m) => {
          if (m.startsWith("<")) return "";
          const base = m.startsWith("\\") // escape
            ? m.slice(1)
            : m.slice(1, -1);
          return base.replace(/</gu, "&lt;").replace(/>/gu, "&gt;");
        })
        .trim();
    }
  }

  return result;
}
