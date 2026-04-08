import { AnalysisResult } from "../types/analysis";
type Props = {
  mobile: AnalysisResult["mobile"];
};
export default function MobileCard({ mobile }: Props) {
  return (
    <div className="bg-white/10 p-4 rounded">
      <h2 className="text-xl font-bold">Mobile</h2>
      <p>{mobile.status}</p>
    </div>
  );
}
