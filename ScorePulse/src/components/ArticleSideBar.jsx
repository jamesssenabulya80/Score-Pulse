function ArticleSidebar() {
  // SAMPLE ARTICLES

  const articles = [
    {
      category: "TOP STORY",
      title: "Latest Football Stories",
      description: "The biggest stories happening across the football world.",
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    },
    {
      category: "TRANSFERS",
      title: "Transfer News & Rumours",
      description: "Latest transfer updates, rumours and confirmed moves.",
      image:
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80",
    },
    {
      category: "ANALYSIS",
      title: "Tactics & Match Analysis",
      description: "Explore match tactics, opinions and football insights.",
      image:
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80",
    },
    {
      category: "LATEST",
      title: "Football Around the World",
      description: "Discover what's happening across global football.",
      image:
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <aside className="article-sidebar">
      {/* SIDEBAR HEADER */}
      <div className="article-sidebar-header">
        <h3>FOOTBALL NEWS</h3>
        <span className="news-indicator">NEWS</span>
      </div>

      {/* ARTICLE LIST */}
      <div className="article-list">
        {articles.map((article, index) => (
          <article
            className={`article-item ${index === 0 ? "featured-article" : ""}`}
            key={index}
          >
            {/* ARTICLE IMAGE */}
            <img
              src={article.image}
              alt={article.title}
              className="article-image"
            />

            {/* ARTICLE DETAILS */}
            <div className="article-content">
              <span className="article-category">{article.category}</span>

              <h4>{article.title}</h4>

              <p>{article.description}</p>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}

export default ArticleSidebar;
