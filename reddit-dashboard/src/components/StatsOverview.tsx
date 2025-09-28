import { MessageSquare, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { type Comment} from "../services/api";

interface StatsOverviewProps {
  data: Comment[];
}

export default function StatsOverview({ data }: StatsOverviewProps) {

  const totalComments = data.length;
  const uniqueSubreddits = new Set(data.map(comment => comment.subreddit)).size;
    

  const authorCounts = data.reduce((counts, comment) => {
    counts[comment.author] = (counts[comment.author] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const topAuthor = Object.entries(authorCounts)
  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  const topAuthorComments = data.filter(comment => comment.author === topAuthor);
  const topAuthorAvgScore = topAuthorComments.length > 0
    ? topAuthorComments.reduce((sum, comment) => sum + comment.score, 0) / topAuthorComments.length
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Comments Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Comments</p>
            <p className="text-2xl font-bold text-gray-900">{totalComments}</p>
          </div>
        </div>
      </div>

      {/* Subreddits Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Subreddits</p>
            <p className="text-2xl font-bold text-gray-900">{uniqueSubreddits}</p>
          </div>
        </div>
      </div>

      {/* Top Author Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Top Author</p>
            <p className="text-lg font-bold text-gray-900">{topAuthor|| 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Average Score Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Avg Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {topAuthorAvgScore.toFixed(1) || '0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}