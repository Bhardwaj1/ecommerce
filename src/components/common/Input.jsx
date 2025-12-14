export default function Input(props) {
return (
<input
{...props}
className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
);
}