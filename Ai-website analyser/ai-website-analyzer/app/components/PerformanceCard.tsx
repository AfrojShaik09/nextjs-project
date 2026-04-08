import { AnalysisResult } from "../types/analysis";
type Props = {
  performance: AnalysisResult["performance"];
};
export default function PerformanceCard({ performance }: Props) {
  return (
    <div className="bg-white/10 p-4 rounded">
      <h2 className="text-xl font-bold">Performance</h2>
      <p>Images: {performance.imageCount}</p>
      <p>{performance.suggestion}</p>
    </div>
  );
}
