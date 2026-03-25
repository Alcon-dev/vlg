import attractionsJson from "@app/data/attractions.json";

const imageModules = import.meta.glob(
  "@app/assets/img/sections/about/attractions/**/*.png",
  { eager: true, query: "?url", import: "default" }
);

function resolveImageUrl(relativePath) {
  const key = Object.keys(imageModules).find((k) => k.endsWith(relativePath));
  return key ? imageModules[key] : "";
}

export const attractions = attractionsJson.map((item) => ({
  title: item.title,
  description: item.description,
  distance: item.distance,
  images: item.images.map((img) => ({
    src: resolveImageUrl(typeof img === "string" ? img : img.src),
    size: typeof img === "object" && img.size ? img.size : "medium",
  })),
}));
