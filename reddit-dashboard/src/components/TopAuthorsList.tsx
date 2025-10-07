
interface TopAuthor {
    author: string;
    comment_count: number;
    avg_score: number;
    authorSubreddits: Set<string>;
}

interface TopAuthorsListProps {
    topAuthors: TopAuthor[];
}

export default function TopAuthorsList({ topAuthors }: TopAuthorsListProps) {
    const getBadgeColor = (index: number) => {
        switch (index) {
            case 0: return 'bg-yellow-500'; 
            case 1: return 'bg-gray-400';   
            case 2: return 'bg-amber-600';  
            default: return 'bg-blue-500'; 
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Top Authors
            </h3>
            <div className="space-y-3">
                {topAuthors.map((author, index) => (
                    <div
                        key={author.author ?? index}
                        className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs ${getBadgeColor(index)} text-white px-2 py-1 rounded-full font-medium`}>
                                        #{index + 1}
                                    </span>
                                    <span className="font-medium text-gray-700">u/{author.author}</span>
                                </div>


                                <div className="mt-1 flex flex-wrap gap-2">
                                    {[...(author.authorSubreddits ?? new Set<string>())].map((sub) => (
                                        <span
                                            key={sub}
                                            className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full border border-indigo-200"
                                        >
                                            r/{sub}
                                        </span>
                                    ))}
                                </div>
                            </div>


                            <div className="text-right self-center">
                                <div className="text-sm font-medium text-gray-800">
                                    {author.comment_count} comments
                                </div>
                                <div className="text-xs text-gray-500">
                                    avg score: {Math.round(author.avg_score * 10) / 10}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}