
interface Subreddit {
    subreddit: string;
    commentCount: number;
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
                        <span className="font-medium text-gray-700">r/{sub.subreddit}</span>
                        <span className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded-full">
                            {sub.commentCount} comments
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}