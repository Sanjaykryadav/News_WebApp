import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import InfiniteScroll from "react-infinite-scroll-component";

const News = ({ category }) => {
  const [articles, setArticles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const defaultImage =
    "https://images.pexels.com/photos/1564473/pexels-photo-1564473.png?auto=compress&cs=tinysrgb&w=600&lazy=load";
  const apiKey = "ecfaf9eaaa8d40a5b5d769210f5ee616";

  useEffect(() => {
    fetchArticles();
  }, [category]);

  const fetchArticles = async () => {
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&page=${page}&apiKey=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setArticles(data.articles);
      setTotalResults(data.totalResults);
    } catch (error) {
      console.error("Error fetching news:", error);
      // Handle error state or display an error message
    }
  };

  const fetchMoreArticles = async () => {
    try {
      const nextPage = page + 1;
      const url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&page=${nextPage}&apiKey=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setArticles([...articles, ...data.articles]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more news:", error);
      // Handle error state or display an error message
    }
  };

  return (
    <InfiniteScroll
      dataLength={articles.length}
      next={fetchMoreArticles}
      hasMore={articles.length < totalResults}
      loader={<h4 className="text-center">Loading...</h4>}
      endMessage={<p style={{ textAlign: "center" }}><b>Yay! You have seen it all</b></p>}
    >
      <div className="container my-3">
        <div className="row">
          {articles.map((article) => (
            <div className="col-md-4" key={article.url}>
              <NewsItem
                sourceName={article.source.name}
                title={article.title}
                desc={article.description}
                imageURL={article.urlToImage || defaultImage}
                newsUrl={article.url}
              />
            </div>
          ))}
        </div>
      </div>
    </InfiniteScroll>
  );
};

export default News;
