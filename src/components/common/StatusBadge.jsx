const statusMap = {
  connected: "success",
  good: "success",
  "integrity verified": "success",

  partial: "warning",
  medium: "warning",
  open: "warning",
  monitoring: "warning",

  high: "danger",
  "very high": "danger",
  critical: "danger",
  unpatched: "danger",
  weak: "danger",

  internal: "info",
  internet: "info",

  default: "neutral",
};

function StatusBadge({ status }) {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase();

  const variant = statusMap[normalizedStatus] || statusMap.default;

  return (
    <span className={`status-badge status-badge--${variant}`}>
      {status}
    </span>
  );
}

export default StatusBadge; 