export default function Button({ children, onClick, disabled, className = "", variant = "primary" }) {
  const variants = {
    primary: "btn-primary text-white font-semibold",
    ghost: "border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white transition-all duration-200",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-xl text-sm tracking-wide
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}