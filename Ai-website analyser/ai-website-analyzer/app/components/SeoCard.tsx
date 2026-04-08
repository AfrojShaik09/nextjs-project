import { AnalysisResult } from "../types/analysis";

type Props = {
  seo: AnalysisResult["seo"];
};

export default function SeoCard({ seo }: Props) {
  return (
    <div className="bg-white/10 p-4 rounded">
      <h2 className="text-xl font-bold">SEO Score: {seo?.total ?? 0}</h2>
      <p>Title: {seo.titleScore}</p>
      <p>Description: {seo.descScore}</p>
      <p>Headings: {seo.headingScore}</p>
      <p>Images: {seo.imageScore}</p>
    </div>
  );
}
