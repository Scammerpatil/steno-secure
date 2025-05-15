"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

export default function TradePlusDashboard() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [selectedSource, setSelectedSource] = useState<string>("All");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchNews = async () => {
    try {
      const res = await axios.get("/api/get-all-news");
      const articles = res.data.articles;
      sessionStorage.setItem("fintechNews", JSON.stringify(articles));
      setNews(articles);
      setFilteredNews(articles);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedNews = sessionStorage.getItem("fintechNews");
    if (storedNews) {
      const articles = JSON.parse(storedNews);
      setNews(articles);
      setFilteredNews(articles);
      setLoading(false);
    } else {
      fetchNews();
    }
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...news];

    if (selectedSource !== "All") {
      filtered = filtered.filter(
        (article) => article.source.name === selectedSource
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (article) => new Date(article.publishedAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (article) => new Date(article.publishedAt) <= new Date(endDate)
      );
    }

    setFilteredNews(filtered);
    setCurrentPage(1);
  }, [selectedSource, startDate, endDate, news]);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const uniqueSources = Array.from(new Set(news.map((n) => n.source.name)));

  return (
    <div className="bg-base-100 flex flex-col items-center justify-center text-center p-6">
      {!loading && (
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="select select-bordered select-primary"
          >
            <option value="All">All Sources</option>
            {uniqueSources.map((source, i) => (
              <option key={i} value={source}>
                {source}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input input-bordered input-primary"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input input-bordered input-primary"
            placeholder="End Date"
          />
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setSelectedSource("All");
            }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
          <button
            onClick={() => {
              setLoading(true);
              fetchNews();
            }}
            className="btn btn-primary"
          >
            Update News
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="loading loading-spinner loading-xl"></span>
          <p className="text-center text-base-content/70 mt-4 text-3xl font-semibold">
            Loading latest fintech news...
          </p>
        </div>
      ) : filteredNews.length === 0 ? (
        <p className="text-center text-xl text-base-content font-medium mt-10">
          No news found for the selected filters.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paginatedNews.map((article, index) => (
              <a
                href={article.url}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-base-300 shadow-md hover:shadow-xl transition-all border p-4 flex flex-col gap-2"
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt="News Thumbnail"
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
                <h2 className="text-lg font-semibold">{article.title}</h2>
                <p className="text-sm text-base-content/60">
                  {article.description}
                </p>
                <div className="text-xs text-right text-base-content/40 mt-auto">
                  {new Date(article.publishedAt).toLocaleString()} —{" "}
                  {article.source.name}
                </div>
              </a>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-primary btn-sm"
            >
              Previous
            </button>

            <span className="text-lg font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-primary btn-sm"
            >
              Next
            </button>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <span className="text-sm text-base-content/60">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredNews.length)} of{" "}
              {filteredNews.length} articles
            </span>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <span className="text-sm text-base-content/60">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
