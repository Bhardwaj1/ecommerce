import Button from "../common/Button";

export default function Controls() {
  return (
    <div className="flex justify-center gap-4 p-4 bg-gray-800">
      <Button>Mic</Button>
      <Button>Camera</Button>
      <Button className="bg-red-600 hover:bg-red-700">Leave</Button>
    </div>
  );
}
