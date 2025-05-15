import { NextResponse } from "next/server";
import axios from "axios";

const NEWS_API_KEY = process.env.NEWS_API_KEY!;

export async function GET() {
  if (!NEWS_API_KEY) {
    console.error("API keys are missing");
    return NextResponse.json(
      { error: "API keys are missing" },
      { status: 500 }
    );
  }

  try {
    const newsRes = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "fintech",
        sortBy: "publishedAt",
        language: "en",
        apiKey: NEWS_API_KEY,
      },
    });

    const articles = newsRes.data.articles;
    if (!articles || articles.length === 0) {
      console.error("No articles found");
      return NextResponse.json({ articles: [] });
    }

    const enrichedArticles = [];
    for (const article of articles) {
      const { title, description, urlToImage, url, publishedAt, source } =
        article;
      try {
        enrichedArticles.push({
          title,
          description,
          url,
          urlToImage,
          publishedAt,
          source: { name: source?.name || "Unknown" },
        });
      } catch (error) {
        console.error("Error processing article:", error);

        enrichedArticles.push({
          title,
          description,
          url,
          urlToImage,
          publishedAt,
          source: { name: source?.name || "Unknown" },
        });
      }
    }

    return NextResponse.json({ articles: enrichedArticles });
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
