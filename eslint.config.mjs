import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";

export default withNuxt(
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...pluginPrettier.configs.recommended.rules,
      "vue/multi-word-component-names": "off",
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },
  eslintConfigPrettier
);
