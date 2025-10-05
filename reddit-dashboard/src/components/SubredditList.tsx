interface Subreddit {
    subreddit: string;
    commentCount: number;
    sentimentPercentage?: number;
    sentimentLabel?: string;
}


interface SubredditBreakdownProp {
    subreddits: Subreddit[];
}

export default function SubredditList({ subreddits }: SubredditBreakdownProp) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Subreddit Breakdown
            </h3>
            <div className="space-y-3 flex-1 overflow-auto">
                {subreddits.map((sub, index) => (
                    <div 
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex-1">
                            <span className="font-medium text-gray-700">r/{sub.subreddit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded-full">
                                {sub.commentCount} comments
                            </span>
                            {sub.sentimentLabel && (
                                <span className={`text-sm px-2 py-1 rounded-full ${
                                    sub.sentimentLabel === 'POSITIVE' ? 'bg-green-100 text-green-700' :
                                    sub.sentimentLabel === 'NEGATIVE' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {sub.sentimentPercentage}% {sub.sentimentLabel}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}