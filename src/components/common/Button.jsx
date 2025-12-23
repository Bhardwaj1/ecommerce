export default function Button({
  children,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`
        relative flex items-center justify-center gap-2
        px-4 py-2 rounded-lg
        bg-blue-600 hover:bg-blue-700 transition
        ${loading || disabled ? "opacity-70 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
