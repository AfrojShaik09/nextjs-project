import UrlInput from "./components/UrlInput";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white p-6">
      <h1 className="text-4xl font-bold text-center">AI Website Analyzer</h1>
      <div className="mt-8 flex justify-center">
        <UrlInput />
      </div>
    </main>
  );
}
