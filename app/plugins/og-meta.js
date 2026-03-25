export default defineNuxtPlugin(() => {
  const config = useAppConfig();
  const siteUrl = (config.siteUrl || "").replace(/\/$/, "");

  if (siteUrl && siteUrl !== "https://volga163.ru") {
    useHead({
      meta: [
        { property: "og:url", content: `${siteUrl}/` },
        { property: "og:image", content: `${siteUrl}/og-image.jpg` },
        { name: "twitter:image", content: `${siteUrl}/og-image.jpg` },
      ],
    });
  }
});
