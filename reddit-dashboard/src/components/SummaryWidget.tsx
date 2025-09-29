import { type Comment} from "../services/api";
import SubredditList from "./SubredditList";
import TopAuthorsList from "./TopAuthorsList";

interface SummaryWidgetProps {
    data: Comment[];
}

export default function SummaryWidget({ data }: SummaryWidgetProps) {
    const totalComments = data.length;
    const uniqueSubreddits = new Set(data.map(comment => comment.subreddit))
    
    const topComments = data.sort((a: Comment, b: Comment) => b.score - a.score).slice(0, 10);
    const avgScore = data.reduce((sum, comment) => sum + comment.score, 0) / data.length;


    const authorCounts = data.reduce((counts, comment) => {
        counts[comment.author] = (counts[comment.author] || 0) + 1;
        return counts;
    }, {} as Record<string, number>);

    const topAuthorsList = Object.entries(authorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)  // Get top 10 authors
        .map(([author, count]) => {
            const authorComments = data.filter(comment => comment.author === author);
            const avgScore = authorComments.reduce((sum, comment) => sum + comment.score, 0) / authorComments.length;
    
            return {
            author: author,
            comment_count: count,
            avg_score: avgScore
            };
        });

    const subredditsCount = data.reduce((counts, comment) => {
        counts[comment.subreddit] = (counts[comment.subreddit] || 0) + 1;
        return counts;
    }, {} as Record<string, number>); 

    const subredditsList = Object.entries(subredditsCount)
        .sort(([,a], [, b]) => b - a)
        .map(([subreddit, count]) => ({
            subreddit: subreddit,
            commentCount: count
        }));


    return (
        <div className="space-y-6">
            {/* Summary Stats Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{totalComments}</div>
                        <div className="text-blue-100">Total Comments</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{uniqueSubreddits.size}</div>
                        <div className="text-blue-100">Active Subreddits</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{topComments[0]?.score || 0}</div>
                        <div className="text-blue-100">Top Comment Score</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{avgScore.toFixed(1)}</div>
                        <div className="text-blue-100">Average Score</div>
                    </div>
                </div>
            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopAuthorsList topAuthors={topAuthorsList} />
                <SubredditList subreddits={subredditsList} />
            </div>
        </div>
    );
}