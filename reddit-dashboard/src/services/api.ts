import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 15000,
});


export interface SubredditBreakdown {
  subreddit: string;
  count: number;
}

export interface AuthorBreakdown {
  author: string;
  comment_count: number;
  avg_score: number;
}

export interface SummaryData {
  subreddit_breakdown: SubredditBreakdown[];
  total_comments: number;
  top_authors: AuthorBreakdown[];
}

export interface Comment {
  id: number;
  body: string;
  created_utc: Date;
  subreddit: string;
  score: number;
  author: string;
  sentiment_score: number;
  sentiment_label: string;
} 


export interface CommentData {
  comments: Comment[];
  count: number;
}



export interface SearchData {
  query: string;
  count: number;
  results: Comment[];
}


  export const redditApi = {
    getSummary: async (): Promise<SummaryData> => {
      try {
        const response = await instance.get<SummaryData>('/analytics/summary');
        return response.data;
      }
      catch (error) {
        console.error('Error fetching summary:', error);
        throw error;
      }
    },
    getComments: async (): Promise<CommentData> => {
      try {
        const response = await instance.get<CommentData>('/comments/');
        return response.data;
      } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
      }
    },
    searchComments: async (query: string | null, subredditsList: string[]): Promise<SearchData> => {
      try {
        const subParams = subredditsList.map((name) => `subreddits=${name.slice(2)}`).join('&');
        const response = await instance.get<SearchData>(`/comments/search?q=${query}&${subParams}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching comments In redditApi:', error);
        throw error;
      }
    },

  }
  