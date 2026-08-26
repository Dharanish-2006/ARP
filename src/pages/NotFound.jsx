import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center container-wide text-center">
      <h1 className="text-6xl font-bold text-[#1a5aa0] mb-4">404</h1>
      <p className="text-xl text-[#4a4a4a] mb-6">Page not found</p>
      <Link to="/" className="px-6 py-3 bg-[#1a5aa0] text-white rounded hover:bg-[#154a82] transition-colors">
        Go Home
      </Link>
    </div>
  );
}
