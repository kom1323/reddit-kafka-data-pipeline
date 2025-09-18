import { type SummaryData} from "../services/api";
import SubredditList from "./SubredditList";
import TopAuthorsList from "./TopAuthorsList";

interface SummaryWidgetProps {
    data: SummaryData;
}

export default function SummaryWidget({ data }: SummaryWidgetProps) {
    return (
        <div className="space-y-6">
            {/* Summary Stats Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{data.total_comments.toLocaleString()}</div>
                        <div className="text-blue-100">Total Comments</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{data.subreddit_breakdown.length}</div>
                        <div className="text-blue-100">Active Subreddits</div>
                    </div>
                </div>
            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopAuthorsList topAuthors={data.top_authors} />
                <SubredditList subreddits={data.subreddit_breakdown} />
            </div>
        </div>
    );
}