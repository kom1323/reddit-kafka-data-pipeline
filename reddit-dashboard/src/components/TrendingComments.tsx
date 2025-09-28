import { type CommentData } from "../services/api";

interface TrendingCommentsProps {
    data: CommentData;
};


export default function TrendingComments( { data }: TrendingCommentsProps) {

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Trending Comments
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {data?.comments.map((comment, index) => (
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
                            <span className="text-sm font-semibold text-green-600">↑ {comment.score}</span>
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