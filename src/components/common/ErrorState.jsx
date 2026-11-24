import Button from "./Button";

function ErrorState({
  title = "Unable to load this section",
  message = "Something prevented this information from loading. Please try again.",
  onRetry,
}) {
  return (
    <section className="error-state" role="alert">
      <h3 className="error-state-title">{title}</h3>

      <p className="error-state-text">{message}</p>

      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </section>
  );
}

export default ErrorState;