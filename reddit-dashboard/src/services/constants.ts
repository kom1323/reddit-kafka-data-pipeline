// src/services/constants.ts
export const SENTIMENT_COLORS = {
  'Very Negative': '#ff4b5c', // deep red (red-700)
  Negative:        '#ff7b72', // red (red-500)
  Neutral:         '#6ba8ff', // soft blue (blue-300)
  Positive:        '#4ade80', // green (green-400)
  'Very Positive': '#2ee59d', // deep green (green-600)
} as const;

export type SentimentLabel = keyof typeof SENTIMENT_COLORS;


export const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
        case 'very negative':
            return SENTIMENT_COLORS['Very Negative'];
        case 'negative':
            return SENTIMENT_COLORS.Negative;
        case 'neutral':
            return SENTIMENT_COLORS.Neutral;
        case 'positive':
            return SENTIMENT_COLORS.Positive;
        case 'very positive':
            return SENTIMENT_COLORS['Very Positive'];
        default:
            return SENTIMENT_COLORS.Neutral;
    }
};
 