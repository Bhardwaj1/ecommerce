export default function Loader({ fullScreen = false }) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" : "py-10"
      }`}
    >
      <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
