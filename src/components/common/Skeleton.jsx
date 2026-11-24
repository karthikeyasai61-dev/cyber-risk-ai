function Skeleton({ lines = 3, className = "" }) {
  return (
    <div
      className={`surface surface-padding ${className}`.trim()}
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="loading-skeleton skeleton-line"
        />
      ))}
    </div>
  );
}

export default Skeleton;