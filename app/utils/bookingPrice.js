/**
 * Calculate stay total from RealtyCalendar day entries.
 * discounts: [{ over_length, extra_charge, extra_charge_type: "percent" }]
 * — percent off when nights >= over_length (best match wins).
 */

function parseDateStr(str) {
  if (!str || typeof str !== "string") return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function addDaysStr(dateStr, days) {
  const d = parseDateStr(dateStr);
  if (!d) return null;
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function nightsBetween(beginDate, endDate) {
  const a = parseDateStr(beginDate);
  const b = parseDateStr(endDate);
  if (!a || !b) return 0;
  const diff = Math.round((b.getTime() - a.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

export function pickDiscountPercent(discounts, nights) {
  if (!Array.isArray(discounts) || !nights) return 0;
  let best = 0;
  for (const d of discounts) {
    const over = Number(d?.over_length) || 0;
    if (over <= 0 || nights < over) continue;
    const pct =
      d?.extra_charge_type === "percent" || d?.percent != null
        ? Number(d.extra_charge ?? d.percent) || 0
        : Number(d.extra_charge) || 0;
    if (pct > best) best = pct;
  }
  return best;
}

/**
 * @param {Array} calendar - day entries from API
 * @param {string} beginDate - YYYY-MM-DD check-in
 * @param {string} endDate - YYYY-MM-DD check-out (exclusive for nights)
 * @returns {{ base: number, total: number, discountPercent: number, nights: number } | null}
 */
export function calcStayPrice(calendar, beginDate, endDate) {
  const nights = nightsBetween(beginDate, endDate);
  if (!nights || !Array.isArray(calendar) || !calendar.length) return null;

  const nightEntries = [];
  for (let i = 0; i < nights; i++) {
    const key = addDaysStr(beginDate, i);
    const entry = calendar.find((e) => e?.date === key);
    if (!entry || entry.price == null) return null;
    nightEntries.push(entry);
  }

  let base = 0;
  for (const entry of nightEntries) {
    base += Number(entry.price) || 0;
  }
  if (!base) return null;

  const discounts =
    nightEntries.find((e) => Array.isArray(e?.discounts) && e.discounts.length)
      ?.discounts ?? null;
  const discountPercent = pickDiscountPercent(discounts, nights);
  const total = discountPercent
    ? Math.round(base * (1 - discountPercent / 100))
    : base;

  return { base, total, discountPercent, nights };
}

/**
 * Bookable only when every night of the stay matches a good RC day:
 * available === true, price set, closed_on_arrival !== true.
 * (Any available:false or closed_on_arrival:true → hide villa.)
 */
export function isStayAvailable(calendar, beginDate, endDate) {
  if (!Array.isArray(calendar) || !calendar.length) return false;
  const nights = nightsBetween(beginDate, endDate);
  if (!nights) return false;

  const byDate = new Map(
    calendar.filter((e) => e?.date).map((e) => [e.date, e])
  );

  for (let i = 0; i < nights; i++) {
    const entry = byDate.get(addDaysStr(beginDate, i));
    if (!entry) return false;
    if (entry.available !== true) return false;
    if (entry.price == null) return false;
    if (entry.closed_on_arrival === true) return false;
  }

  const checkIn = byDate.get(beginDate);
  const minStay = Number(checkIn?.min_stay) || 1;
  if (nights < minStay) return false;

  const checkOut = byDate.get(endDate);
  if (checkOut?.closed_on_departure === true) return false;

  return true;
}
