/** Normalise a /predict response or a history entry into one shape. */
export function normalizeMeal(data, imageUrl) {
  if (!data) return null;
  const foods = (data.foods || []).map((f) => ({
    name: f.name,
    emoji: f.emoji || "🍽️",
    weight: f.weight_g ?? f.weight ?? 0,
    servings: f.servings,
    count: f.count,
    confidence: f.confidence,
    nutrients: f.nutrients || {},
  }));
  return {
    id: data.id,
    timestamp: data.timestamp,
    source: data.detection_source || data.detectionSource,
    foods,
    totals: data.totals || {},
    insights: data.insights || {},
    annotated: data.annotated_image ? `data:image/jpeg;base64,${data.annotated_image}` : null,
    image: imageUrl || (data.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : null),
  };
}
