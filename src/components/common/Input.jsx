export default function Input(props) {
  return (
    <input
      {...props}
      className="
        w-full px-4 py-3 rounded-xl
        bg-white/5 text-white
        border border-white/10
        placeholder-gray-400
        focus:outline-none
        focus:ring-2 focus:ring-cyan-400/60
        focus:border-cyan-400/60
        transition duration-200
        hover:border-white/20
      "
    />
  );
}
