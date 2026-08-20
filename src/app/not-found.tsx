import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09110e] text-emerald-100 p-4">
      <h1 className="text-4xl font-bold font-mono mb-2">404</h1>
      <p className="text-sm text-slate-400 mb-6">Lost in the forest. Page not found.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
      >
        Return to Island
      </Link>
    </div>
  );
}
