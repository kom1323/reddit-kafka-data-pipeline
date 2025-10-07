import { type CommentData } from "../services/api";
import { getSentimentColor } from "../services/constants";

interface TrendingCommentsProps {
    data: CommentData;
};



export default function TrendingComments( { data }: TrendingCommentsProps) {

    const comments = data?.comments;
    const truncatedCommentData = comments
        .slice(0, Math.min(10, comments.length))
        .concat(comments.slice(Math.max(10, comments.length - 10)));

     
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Trending Comments
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {truncatedCommentData.map((comment, index) => (
                    <div key={comment.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        {/* Header with ranking */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-medium">
                                    #{index + 1}
                                </span>
                                <span className="text-sm font-medium text-blue-600">r/{comment.subreddit}</span>
                                <span className="text-sm text-gray-500">by u/{comment.author}</span>
                            </div>
                            {comment.score > 0 
                                ? <span className="text-sm font-semibold text-green-600">↑ {comment.score}</span>
                                : <span className="text-sm font-semibold text-red-600">↓ {comment.score}</span>
                            }
                            
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full`} style={{ color: getSentimentColor(comment.sentiment_label) }}>
                                {comment.sentiment_label}
                            </span>
                            <span className="text-xs text-gray-500">
                                {Math.round(comment.sentiment_score * 100)}%
                            </span>
                        </div>
                        {/* Comment body */}
                        <p className="text-gray-700 text-sm leading-relaxed">
                            { comment.body }
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}