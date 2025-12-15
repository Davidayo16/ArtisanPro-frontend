// src/utils/formatArtisanPrice.js
export const formatArtisanPrice = (services = []) => {
  if (!services || services.length === 0) return "Price on request";

  const prices = services
    .map((s) => {
      if (!s) return null;
      const { pricingType, fixedPrice, hourlyRate, priceRange } = s;

      if (pricingType === "fixed" && fixedPrice)
        return { type: "fixed", value: fixedPrice };
      if (pricingType === "hourly" && hourlyRate)
        return { type: "hourly", value: hourlyRate };
      if (pricingType === "range" && priceRange?.min && priceRange?.max)
        return { type: "range", min: priceRange.min, max: priceRange.max };
      return null;
    })
    .filter(Boolean);

  if (prices.length === 0) return "Custom quote";

  const minPrice = Math.min(
    ...prices.map((p) => (p.type === "range" ? p.min : p.value))
  );

  if (prices.length === 1) {
    const p = prices[0];
    if (p.type === "fixed") return `₦${p.value.toLocaleString()}`;
    if (p.type === "hourly") return `₦${p.value.toLocaleString()}/hr`;
    if (p.type === "range")
      return `₦${p.min.toLocaleString()} - ₦${p.max.toLocaleString()}`;
  }

  return `From ₦${minPrice.toLocaleString()}`;
};
