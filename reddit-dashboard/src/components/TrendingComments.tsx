import { redditApi, type CommentData } from "../services/api";
import { useState, useEffect } from "react";

export default function TrendingComments() {
    const [data, setData] = useState<CommentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await redditApi.getComments();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch summary:', error);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }               
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Trending Comments</h3>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse border border-gray-100 rounded-lg p-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Trending Comments</h3>
                <div className="text-center py-8">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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