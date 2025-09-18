import { MessageSquare, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { type SummaryData} from "../services/api";

interface StatsOverviewProps {
  data: SummaryData;
}

export default function StatsOverview({ data }: StatsOverviewProps) {

    
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
            <p className="text-2xl font-bold text-gray-900">{data.total_comments.toLocaleString()}</p>
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
            <p className="text-2xl font-bold text-gray-900">{data.subreddit_breakdown.length}</p>
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
            <p className="text-lg font-bold text-gray-900">{data.top_authors[0]?.author || 'N/A'}</p>
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
              {data.top_authors[0]?.avg_score.toFixed(1) || '0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}