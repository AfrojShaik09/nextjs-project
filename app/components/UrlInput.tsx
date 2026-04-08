"use client";

import { useState } from "react";

type AnalysisResult = {
  title: string;

  description: string;

  seoScore: number;

  screenshot: string;

  ai: {
    improvements: string[];
  };
};

export default function UrlInput() {
  const [url, setUrl] = useState("");

  const [result, setResult] = useState<AnalysisResult | null>(null);

  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!url) return;

    let finalUrl = url;

    if (!url.startsWith("http")) {
      finalUrl = "https://" + url;
    }

    setLoading(true);

    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",

        body: JSON.stringify({ url: finalUrl }),
      });

      const data = await res.json();

      setResult(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Input Box */}
      <div className="flex gap-2 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL..."
          className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-300"
        />
        <button
          onClick={analyze}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* Loading */}

      {loading && (
        <div className="mt-6 text-center text-gray-300 animate-pulse">
          Analyzing website... 🚀
        </div>
      )}

      {/* Result */}

      {result && (
        <div className="mt-8 space-y-6">
          {/* Score Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-center">
            <h2 className="text-xl mb-2">SEO Score</h2>
            <p className="text-5xl font-bold text-blue-400">
              {result.seoScore}
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl">
            <p>
              <b>Title:</b> {result.title}
            </p>
            <p className="mt-2">
              <b>Description:</b> {result.description}
            </p>
          </div>

          {/* AI Suggestions */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-2">AI Improvements</h3>
            <ul className="list-disc ml-5 space-y-1">
              {result.ai?.improvements?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Screenshot */}

          {result.screenshot && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
              <img
                src={`data:image/png;base64,${result.screenshot}`}
                alt="preview"
                className="rounded-lg w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
