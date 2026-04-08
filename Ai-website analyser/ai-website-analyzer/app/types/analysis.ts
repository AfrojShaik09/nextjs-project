export type AnalysisResult = {
  title: string;
  description: string;
  headings: string[];
  imageCount: number;
  screenshot: string;
  seo: {
    titleScore: number;
    descScore: number;
    headingScore: number;
    imageScore: number;
    total: number;
  };
  mobile: {
    hasViewport: boolean;
    status: string;
  };
  performance: {
    imageCount: number;
    largeImages: number;
    suggestion: string;
  };
  ai: {
    seo?: string[];
    ux?: string[];
    performance?: string[];
    improvements?: string[];
    betterMetaDescription?: string;
  };
};
