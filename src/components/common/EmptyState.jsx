import Button from "./Button";

function EmptyState({
  title = "Nothing to display",
  message = "There is currently no information available for this view.",
  actionLabel,
  onAction,
}) {
  return (
    <section className="empty-state" aria-live="polite">
      <h3 className="empty-state-title">{title}</h3>

      <p className="empty-state-text">{message}</p>

      {actionLabel && onAction ? (
        <Button onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </section>
  );
}

export default EmptyState;