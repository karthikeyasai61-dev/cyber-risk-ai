function Toast({ title, message }) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <div className="toast-title">{title}</div>
      <p className="toast-message">{message}</p>
    </div>
  );
}

export default Toast;