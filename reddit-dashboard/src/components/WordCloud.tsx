import { type Comment } from "../services/api";

interface WordCloudProps {
  data: Comment[];
}



// Common words to filter out (stop words)
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "all", "am", "an", "and", 
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", 
  "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", 
  "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", 
  "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", 
  "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", 
  "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", 
  "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", 
  "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", 
  "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", 
  "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", 
  "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", 
  "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", 
  "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", 
  "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", 
  "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", 
  "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", 
  "you're", "you've", "your", "yours", "yourself", "yourselves",
]);


function normalizeWord(word: string): string {
    let w = word;
  
    // Strip possessive 's (dog's -> dog)
    if (w.endsWith("'s") || w.endsWith("’s")) {
      w = w.slice(0, -2);
    }

    // Strip possessive 's (dogs' -> dog)
    if (w.endsWith("s'") || w.endsWith("s’")) {
        w = w.slice(0, -2);
      }
  
    // Strip plural s (dogs -> dog), avoid chopping short words like "is"
    else if (w.endsWith("s") && w.length > 3) {
      w = w.slice(0, -1);
    }
  
    // Strip past-tense -ed (walked -> walk)
    if (w.endsWith("ed") && w.length > 4) {
      w = w.slice(0, -2);
    }
  
    return w;
  }

function countUniqueWords(data: Comment[]): Map<string, number> {
  const wordCounts = new Map<string, number>();
  
  for (let comment of data) {
    if (!comment.body) continue;

    const text = comment.body;

    // Convert to lowercase and remove punctuation
    const cleanedText = text.toLowerCase().replace(/[.,!?;:"'()]/g, '');
  
    // Use a regex to split by one or more whitespace characters and remove nonrelevant words
    const words = cleanedText.split(/\s+/).filter(word => 
      word.length > 3 && !STOP_WORDS.has(word)
    );
  
    for (const word of words) {
      const stemmedWord = normalizeWord(word);
      wordCounts.set(stemmedWord, (wordCounts.get(stemmedWord) || 0) + 1);
    }
  }
 
  return wordCounts;
}

export default function WordCloud({ data }: WordCloudProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Trending Words</h3>
        <div className="flex items-center justify-center h-[400px] text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  // Process words and their frequencies
  const wordMap = countUniqueWords(data);
  const words = Array.from(wordMap.entries())
    .map(([text, value]) => ({ text, value }))
    .filter(item => item.value > 1) 
    .sort((a, b) => b.value - a.value)
    .slice(0, 34); 

  if (words.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Trending Words</h3>
        <div className="flex items-center justify-center h-[400px] text-gray-500">
          Not enough data to generate word cloud
        </div>
      </div>
    );
  }

  // Calculate max frequency for scaling
  const maxFrequency = Math.max(...words.map(w => w.value));

  // Define a set of colors to distribute among words
  const colors = [
    'bg-blue-100 text-blue-700 hover:bg-blue-200',
    'bg-green-100 text-green-700 hover:bg-green-200',
    'bg-purple-100 text-purple-700 hover:bg-purple-200',
    'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    'bg-pink-100 text-pink-700 hover:bg-pink-200',
    'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
    'bg-red-100 text-red-700 hover:bg-red-200',
    'bg-orange-100 text-orange-700 hover:bg-orange-200',
    'bg-teal-100 text-teal-700 hover:bg-teal-200',
    'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
  ];

  const getFontSize = (frequency: number) => {
    // Scale font size based on word frequency relative to max frequency
    const ratio = frequency / maxFrequency;
    if (ratio > 0.8) return "text-2xl font-bold";
    if (ratio > 0.6) return "text-xl font-bold";
    if (ratio > 0.4) return "text-lg";
    if (ratio > 0.2) return "text-base";
    return "text-sm";
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Trending Words</h3>
      <div className="flex-1 overflow-visible mt-7">
        <div className="flex flex-wrap gap-2 justify-center content-start">
          {words.map((word, index) => (
            <span
              key={index}
              className={`
                ${colors[index % colors.length]}
                ${getFontSize(word.value)}
                inline-block rounded-full px-3 py-0.5 m-0.5
                transition-all duration-300 hover:scale-110 cursor-pointer
              `}
              style={{
                transform: `rotate(${Math.random() * 16 - 8}deg)`,
              }}
            >
              {word.text}
              <span className="ml-1 text-xs opacity-60">
                {word.value}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}