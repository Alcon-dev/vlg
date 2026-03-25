import reviewsJson from "@app/data/reviews.json";

const avatarModules = import.meta.glob(
  "@app/assets/img/sections/about/reviews-avatars/**/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

function resolveAvatarUrl(filename) {
  const key = Object.keys(avatarModules).find((k) => k.endsWith(filename));
  return key ? avatarModules[key] : "";
}

export const reviews = reviewsJson.map((item) => ({
  avatar: resolveAvatarUrl(item.avatar),
  name: item.name,
  stars: item.stars,
  date: item.date,
  guest: item.guest ?? false,
  stayInfo: item.stayInfo,
  text: item.text,
}));
