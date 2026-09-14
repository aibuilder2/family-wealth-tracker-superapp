export type PredictionDirection = "up" | "down" | "neutral";

export interface AIPrediction {
  id: string;
  symbol: string;
  companyName: string;
  predictionDate: string;
  technicalScore: number;
  fundamentalScore: number;
  sentimentScore: number;
  overallScore: number;
  direction: PredictionDirection;
  confidencePct: number;
  supportLevel: number;
  resistanceLevel: number;
  reasoning: string;
  patternDetected: string;
  dataSourceLinks: string[];
}

export interface PredictionResult {
  predictionId: string;
  actualDirection: PredictionDirection;
  actualChangePct: number;
  wasCorrect: boolean;
  resultDate: string;
}

export interface AccuracyStats {
  totalPredictions: number;
  correctPredictions: number;
  accuracyPct: number;
  avgConfidence: number;
  period: "7d" | "30d" | "90d";
}

export interface Top5Daily {
  date: string;
  predictions: AIPrediction[];
  generatedAt: string;
}
