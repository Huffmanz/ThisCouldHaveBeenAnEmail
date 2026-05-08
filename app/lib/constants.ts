export type SeniorityLevel = "Junior" | "Mid" | "Senior" | "Exec";

export const SENIORITY_TIERS: Record<SeniorityLevel, { salary: number; label: string }> = {
  Junior: { salary: 65_000, label: "Junior" },
  Mid: { salary: 90_000, label: "Mid" },
  Senior: { salary: 120_000, label: "Senior" },
  Exec: { salary: 200_000, label: "Exec" },
};

export const SENIORITY_ORDER: SeniorityLevel[] = ["Junior", "Mid", "Senior", "Exec"];

export const RECEIPT_ITEMS = [
  { name: "Costco hot dog & soda", price: 1.5 },
  { name: "Lottery ticket", price: 2.0 },
  { name: "Cup of coffee", price: 5.5 },
  { name: "Chipotle burrito", price: 10.5 },
  { name: "Movie ticket", price: 15.0 },
  { name: "Paperback book", price: 16.0 },
  { name: "Cocktail at a bar", price: 18.0 },
  { name: "Pizza delivery", price: 22.0 },
  { name: "Tank of gas", price: 55.0 },
  { name: "Video game", price: 60.0 },
  { name: "Costco membership (year)", price: 65.0 },
  { name: "Spotify Premium (year)", price: 99.0 },

  { name: "AirPods", price: 129.0 },
  { name: "Fancy dinner for two", price: 160.0 },
  { name: "Flight to Vegas", price: 220.0 },
  { name: "Netflix (year)", price: 264.0 },
  { name: "Weekend Airbnb", price: 340.0 },
  { name: "Round-trip flight (domestic)", price: 380.0 },
  { name: "PS5", price: 499.0 },
  { name: "MacBook Air", price: 1_099.0 },
  { name: "Month of rent", price: 1_500.0 },
  { name: "Used car", price: 8_000.0 },
] as const;
