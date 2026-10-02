import { MACRO_COLORS } from "../theme/theme";

export const NUTRIENTS = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbs", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
  { key: "fiber", label: "Fiber", unit: "g" },
  { key: "sugar", label: "Sugar", unit: "g" },
  { key: "sodium", label: "Sodium", unit: "mg" },
  { key: "cholesterol", label: "Cholesterol", unit: "mg" },
].map((n) => ({ ...n, color: MACRO_COLORS[n.key] }));

export const NUTRIENT_BY_KEY = Object.fromEntries(NUTRIENTS.map((n) => [n.key, n]));

export const DEFAULT_GOALS = {
  calories: 2000,
  protein: 80,
  carbs: 250,
  fat: 70,
  fiber: 25,
  sugar: 30,
  sodium: 2000,
  cholesterol: 300,
};

export const fmt = (n, digits = 0) => {
  const v = Number(n) || 0;
  return v.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 });
};

export const pct = (value, goal) => (goal > 0 ? Math.round(((Number(value) || 0) / goal) * 100) : 0);

export function scoreMeta(score) {
  if (score == null) return { label: "—", color: "#94a3b8" };
  if (score >= 75) return { label: "Great choice", color: "#16a34a" };
  if (score >= 55) return { label: "Balanced", color: "#65a30d" };
  if (score >= 40) return { label: "Occasional treat", color: "#f59e0b" };
  return { label: "Indulgent", color: "#ef4444" };
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary", hint: "Little or no exercise", factor: 1.2 },
  { value: "light", label: "Light", hint: "Exercise 1–3 days/week", factor: 1.375 },
  { value: "moderate", label: "Moderate", hint: "Exercise 3–5 days/week", factor: 1.55 },
  { value: "active", label: "Active", hint: "Hard exercise 6–7 days/week", factor: 1.725 },
  { value: "very_active", label: "Very active", hint: "Physical job + training", factor: 1.9 },
];

export const GOAL_TYPES = [
  { value: "lose", label: "Lose weight", delta: -450 },
  { value: "maintain", label: "Maintain", delta: 0 },
  { value: "gain", label: "Build muscle", delta: 300 },
];

/** Mifflin–St Jeor based daily targets. */
export function suggestGoals({ age, height, weight, gender, activityLevel }, goalType = "maintain") {
  if (!age || !height || !weight) return null;
  const base = 10 * weight + 6.25 * height - 5 * age + (gender === "female" ? -161 : gender === "male" ? 5 : -78);
  const factor = ACTIVITY_LEVELS.find((a) => a.value === activityLevel)?.factor ?? 1.375;
  const delta = GOAL_TYPES.find((g) => g.value === goalType)?.delta ?? 0;
  const calories = Math.round((base * factor + delta) / 50) * 50;
  const protein = Math.round(weight * (goalType === "gain" ? 1.8 : goalType === "lose" ? 1.6 : 1.2));
  const fat = Math.round((calories * 0.28) / 9);
  const carbs = Math.max(50, Math.round((calories - protein * 4 - fat * 9) / 4));
  return {
    calories: Math.max(1200, calories),
    protein,
    carbs,
    fat,
    fiber: Math.round((calories / 1000) * 14),
    sugar: Math.round((calories * 0.1) / 4), // WHO: <10% of energy
    sodium: 2000,
    cholesterol: 300,
  };
}

export function relativeDay(iso) {
  const d = new Date(iso);
  const today = new Date();
  const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(today) - start(d)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return d.toLocaleDateString(undefined, { weekday: "long" });
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: d.getFullYear() === today.getFullYear() ? undefined : "numeric" });
}

export const timeOf = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export function mealLabel(iso) {
  const h = new Date(iso).getHours();
  if (h >= 5 && h < 11) return "Breakfast";
  if (h >= 11 && h < 16) return "Lunch";
  if (h >= 16 && h < 19) return "Snack";
  return "Dinner";
}
