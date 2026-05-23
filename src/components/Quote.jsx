import React, { useEffect, useState } from "react";

const Quote = () => {
  const [quoteText, setQuoteText] = useState("");
  const [tweetUrl, setTweetUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getQuote = async () => {
    setLoading(true);
    setError("");

    try {
      const baseUrl = "https://type.fit/api/quotes";
      let response;

      try {
        response = await fetch(baseUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } catch (directErr) {
        console.warn("Direct fetch failed, retrying via CORS proxy:", directErr.message || directErr);
        const proxy = "https://api.allorigins.win/raw?url=";
        response = await fetch(proxy + encodeURIComponent(baseUrl));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      }

      const quotes = await response.json();
      const pick = quotes[Math.floor(Math.random() * quotes.length)];
      const content = pick.text || pick.quote || pick.content || "";
      const authorName = pick.author || "Unknown";

      setQuoteText(content);
      setAuthor(authorName);
      setTweetUrl(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `${content} - ${authorName}`
        )}`
      );
    } catch (fetchError) {
      console.error("Error fetching quote:", fetchError);
      setError(
        "Quote API failed. Showing a backup quote because the network or certificate failed."
      );
      const fallback = "Be yourself; everyone else is already taken.";
      const fallbackAuthor = "Oscar Wilde";

      setQuoteText(fallback);
      setAuthor(fallbackAuthor);
      setTweetUrl(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `${fallback} - ${fallbackAuthor}`
        )}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuote();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 to-cyan-500">
      <div className="w-2/4 p-5 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-md">
        <h1 className="text-2xl font-bold my-5">Quote of the Day</h1>
        {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
        <p id="quote-text" className="text-lg">{quoteText}</p>
        {author && (
          <p className="mt-2 w-full text-right text-sm font-semibold">— {author}</p>
        )}

        <div className="mt-5 flex gap-5">
          <button
            className="bg-blue-200 p-4 rounded shadow-md font-medium disabled:opacity-50"
            onClick={getQuote}
            disabled={loading}
          >
            {loading ? "Loading..." : "New Quote"}
          </button>
          <a
            href={tweetUrl}
            target="_blank"
            className="text-blue-600 hover:text-blue-800 p-4 rounded shadow-md"
            rel="noopener noreferrer"
          >
            Share on Twitter
          </a>
        </div>
      </div>
    </div>
  );
};

export default Quote;
