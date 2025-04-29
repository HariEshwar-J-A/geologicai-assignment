export default function Spinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
