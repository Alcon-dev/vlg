import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: "app",
  // Keep a single public directory at repo root (otherwise Nuxt may look under `srcDir/public`)
  // and assets like `/og-image.jpg` will 404 unless duplicated.
  dir: {
    // Note: `srcDir` is `app`, so `dir.public` is resolved from there.
    // Use `../public` to point at the repo-root `public/`.
    public: "../public",
  },
  compatibilityDate: "2025-10-24",
  future: {
    compatibilityVersion: 3,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "ru",
      },
      title: "Резиденция ВОЛГА — виллы и услуги на Волге",
      meta: [
        {
          charset: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "description",
          content:
            "Виллы на Волге: размещение до 30 гостей, подогреваемый бассейн, повар, фотосессии, экскурсии, питание, праздники, прокат. Бронирование резиденции ВОЛГА.",
        },
        // Open Graph
        { property: "og:type", content: "website" },
        {
          property: "og:title",
          content: "Резиденция ВОЛГА — виллы и услуги на Волге",
        },
        {
          property: "og:description",
          content:
            "Виллы на Волге: размещение до 30 гостей, подогреваемый бассейн, повар, фотосессии, экскурсии, питание, праздники, прокат. Бронирование резиденции ВОЛГА.",
        },
        { property: "og:image", content: "/og-image.jpg" },
        { property: "og:url", content: "https://volga163.ru/" },
        { property: "og:site_name", content: "Резиденция ВОЛГА" },
        { property: "og:locale", content: "ru_RU" },
        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Резиденция ВОЛГА — виллы и услуги на Волге",
        },
        {
          name: "twitter:description",
          content:
            "Виллы на Волге: размещение до 30 гостей, подогреваемый бассейн, повар, фотосессии, экскурсии, питание, праздники, прокат. Бронирование резиденции ВОЛГА.",
        },
        { name: "twitter:image", content: "/og-image.jpg" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  // Use `appConfig` for truly static values.
  // `runtimeConfig` can be overridden by server env vars (e.g. NUXT_PUBLIC_*),
  // which is not desired for this project.
  appConfig: {
    siteUrl: "https://volga163.ru/",
    homeReserveApiUrl: "https://realtycalendar.ru/v2/widget",
    homeReserveApiKey: "HE3NXyOLk4",
    yandexMapsApiKey: "",
    apartmentIds: [323833, 333838],
  },

  alias: {
    "@app": fileURLToPath(new URL("./app", import.meta.url)),
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "@app/assets/scss/colors.scss" as *; @use "@app/assets/scss/mixins.scss" as *;',
        },
      },
    },
  },
  css: ["@app/assets/scss/main.scss"],
  modules: ["@nuxt/eslint"],
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },

  nitro: {
    // Reduce transfer size for JS/CSS/assets served from `.output/public`
    compressPublicAssets: true,
  },

  routeRules: {
    // Cache Nuxt built assets aggressively (hashed filenames)
    "/_nuxt/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },

    // Public assets with stable names
    "/og-image.jpg": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/main-poster.webp": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/favicon.ico": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
  },
});
