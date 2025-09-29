import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchInterface() {

    const [searchQuery, setSearchQuery] = useState("");
    const [subredditInput, setSubredditInput] = useState("");
    const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([])


    const addSubreddit = () => {
        if (!subredditInput.trim()) return;
        const subreddit = subredditInput.startsWith("r/") ? subredditInput : `r/${subredditInput}`;
        if (!selectedSubreddits.includes(subreddit)) {
            setSelectedSubreddits([...selectedSubreddits, subreddit]);
        }
        setSubredditInput("");
    }

    const removeSubreddit = (subreddit: string) => {
        setSelectedSubreddits(selectedSubreddits.filter(name => name !== subreddit));
    }


    const navigate = useNavigate();
    const onSearchHandler = () => {
        const params = new URLSearchParams();
        params.set('query', searchQuery);
        if(selectedSubreddits.length > 0) {
            params.set('subreddits', selectedSubreddits.join(','));
        }
        navigate(`/results?${params.toString()}`);
    }

    

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="w-5 h-5 text-primary-foreground">📊</span>
                            </div>
                            <h1 className="text-xl font-bold gradient-text">Reddit Analytics Dashboard</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">
                        Analyze Reddit <span className="gradient-text">Comments</span>
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Discover insights from Reddit comments. Search for keywords, filter by subreddits, 
                        and get analytics on user engagement and sentiment.
                    </p>

                    {/* Search Interface */}
                    <div className="max-w-2xl mx-auto">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Enter a topic to analyze (e.g., artificial intelligence, bitcoin, climate change)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-14 text-lg bg-card border-border w-full rounded-lg border px-3 py-2"
                                />
                            </div>
                            <button
                                onClick={onSearchHandler}
                                disabled={!searchQuery.trim() || selectedSubreddits.length === 0}
                                className="h-14 px-8 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="w-5 h-5 mr-2 inline-block">📊</span>
                                Analyze
                            </button>
                        </div>
                    </div>

                    {/* Subreddit Selection */}
                    <div className="max-w-2xl mx-auto mt-6">
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Add specific subreddits (e.g., technology, programming)"
                                        value={subredditInput}
                                        onChange={(e) => setSubredditInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addSubreddit()}
                                        className="h-12 bg-card border-border w-full rounded-lg border px-3 py-2"
                                    />
                                </div>
                                <button
                                    onClick={addSubreddit}
                                    disabled={!subredditInput.trim()}
                                    className="h-12 px-4 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="w-4 h-4">➕</span>
                                </button>
                            </div>

                            {/* Selected Subreddits */}
                            {selectedSubreddits.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm text-muted-foreground self-center">Selected:</span>
                                    {selectedSubreddits.map((subreddit) => (
                                        <div
                                            key={subreddit}
                                            className="text-sm px-3 py-1 flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full"
                                        >
                                            {subreddit}
                                            <button
                                                onClick={() => removeSubreddit(subreddit)}
                                                className="hover:text-destructive"
                                            >
                                                <span className="w-3 h-3">❌</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="w-12 h-12 text-muted-foreground text-4xl">📊</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">Ready to Analyze</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Enter any topic above to start analyzing Reddit comments. Get insights from your data pipeline.
                    </p>
                </div>
            </main>
        </div>
    );

}