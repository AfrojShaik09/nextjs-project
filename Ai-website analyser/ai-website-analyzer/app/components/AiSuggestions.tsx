import { AnalysisResult } from "../types/analysis";

type Props = {
  ai: AnalysisResult["ai"];
};

export default function AiSuggestions({ ai }: Props) {
  return (
    <div className="bg-white/10 p-4 rounded">
      <h2 className="text-xl font-bold">AI Suggestions</h2>
      <ul>
        {ai?.improvements?.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
