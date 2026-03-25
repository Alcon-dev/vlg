import { store } from "@app/store";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(store);
  const config = useAppConfig();
  const rawIds = config.apartmentIds;
  const apartmentIds =
    typeof rawIds === "string"
      ? rawIds
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      : Array.isArray(rawIds)
        ? rawIds
        : [];
  store.commit("setApiConfig", {
    homeReserveApiUrl: config.homeReserveApiUrl,
    homeReserveApiKey: config.homeReserveApiKey,
    apartmentIds,
  });
});
