"use client";

import { useState } from "react";

import { AnalysisResult } from "../types/analysis";

import SeoCard from "../components/SeoCard";

import MobileCard from "../components/MobileCard";

import PerformanceCard from "../components/PerformanceCard";

import AiSuggestions from "../components/AiSuggestions";

import ScreenshotPreview from "../components/ScreenshotPreview";

export default function UrlInput() {
  const [url, setUrl] = useState("");

  const [result, setResult] = useState<AnalysisResult | null>(null);

  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!url) return;

    setLoading(true);

    setResult(null);

    const res = await fetch("/api/analyze", {
      method: "POST",

      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    setResult(data);

    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Input */}
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          className="flex-1 px-4 py-2 text-black rounded"
        />
        <button onClick={analyze} className="bg-blue-600 px-4 py-2 rounded">
          Analyze
        </button>
      </div>

      {loading && <p className="mt-4">Analyzing...</p>}

      {result && (
        <div className="mt-6 space-y-4">
          <SeoCard seo={result.seo} />
          <MobileCard mobile={result.mobile} />
          <PerformanceCard performance={result.performance} />
          <AiSuggestions ai={result.ai} />
          <ScreenshotPreview screenshot={result.screenshot} />
        </div>
      )}
    </div>
  );
}
