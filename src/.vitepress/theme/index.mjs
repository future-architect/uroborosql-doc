import DefaultTheme from "vitepress/theme";
import "./style.css";
import CopyOrDownloadAsMarkdownButtons from "vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue";

/**
 * @typedef {import('vitepress').EnhanceAppContext} EnhanceAppContext
 */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // register your global components
    app.component(
      "CopyOrDownloadAsMarkdownButtons",
      CopyOrDownloadAsMarkdownButtons,
    );
  },
};
