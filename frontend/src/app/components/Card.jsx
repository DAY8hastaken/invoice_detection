// Reusable Card component
export default function Card({ children, className = "", glow = false, style = {} }) {
  return (
    <div
      className={`card${glow ? " card-glow" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}