import UrlInput from "./components/UrlInput";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white px-4">
      {/* Header */}
      <div className="text-center pt-16">
        <h1 className="text-5xl font-bold">AI Website Analyzer</h1>
        <p className="text-gray-300 mt-3">
          Analyze SEO , UX & performance using AI
        </p>
      </div>
      {/* Input */}
      <div className="mt-10 flex justify-center">
        <UrlInput />
      </div>
    </main>
  );
}
