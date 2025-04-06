// app/page.js
import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white text-black">
      <h1 className="text-4xl font-bold mb-6">Welcome to Retriever's Essentials</h1>
      <p className="text-lg text-center max-w-xl mb-6">
        Your campus food pantry – supporting UMBC students with free food essentials.
      </p>
      <div className="flex gap-4">
        <Link href="/available-items" className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300">
          View Available Items
        </Link>
        <Link href="/signin" className="border border-black px-4 py-2 rounded hover:bg-black hover:text-white">
          Sign In
        </Link>
      </div>
    </main>
  );
}
