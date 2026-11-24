/**
 * Format a numeric value as Indian Rupee currency in Lakhs / Crores.
 * e.g. 7240000 → "₹72.4L", 13500000 → "₹1.35Cr"
 */
export function formatCurrency(value) {
  if (value == null) return "—";
  const abs = Math.abs(value);
  if (abs >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (abs >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Format a value as full Indian Rupee currency.
 * e.g. 5000000 → "₹50,00,000"
 */
export function formatCurrencyFull(value) {
  if (value == null) return "—";
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Format a number with Indian locale grouping.
 */
export function formatNumber(value) {
  if (value == null) return "—";
  return value.toLocaleString("en-IN");
}

/**
 * Format a number as a percentage string.
 * e.g. 17.5 → "17.5%"
 */
export function formatPercentage(value) {
  if (value == null) return "—";
  return `${value}%`;
}

/**
 * Get the CSS class modifier for a risk level string.
 */
export function riskVariant(risk) {
  if (!risk) return "neutral";
  const r = risk.toLowerCase();
  if (r === "very high" || r === "critical") return "danger";
  if (r === "high") return "danger";
  if (r === "medium") return "warning";
  if (r === "low") return "success";
  return "neutral";
}

/**
 * Get the CSS class modifier for a vulnerability status.
 */
export function statusVariant(status) {
  if (!status) return "neutral";
  const s = status.toLowerCase();
  if (s === "unpatched") return "danger";
  if (s === "open") return "warning";
  if (s === "monitoring") return "info";
  if (s === "patched" || s === "resolved") return "success";
  return "neutral";
}

/**
 * Get the CSS class modifier for a control status.
 */
export function controlStatusVariant(status) {
  if (!status) return "neutral";
  const s = status.toLowerCase();
  if (s === "good") return "success";
  if (s === "partial") return "warning";
  if (s === "weak") return "danger";
  return "neutral";
}
