import Seo from "../components/Seo";
import { Link } from "react-router-dom";

const posts = [
  {
    title: "Global Investment Trends in 2026",
    excerpt: "Strategic sectors attracting cross-border capital and institutional partnerships.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    category: "Investment",
    readTime: "6 min read",
  },
  {
    title: "How to Scale International Operations",
    excerpt: "A practical framework for compliance, operations and market-entry sequencing.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    category: "Operations",
    readTime: "5 min read",
  },
  {
    title: "Digital Infrastructure for Holding Companies",
    excerpt: "Why secure cloud architecture and CRM integration are now essential.",
    image:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80",
    category: "Technology",
    readTime: "7 min read",
  },
];

function BlogPage() {
  return (
    <>
      <Seo
        title="Corporate Blog | KK Group of Companies"
        description="Insights on investment, international operations, technology and growth strategy."
      />
      <section className="section inner-hero blog-hero">
        <div className="container blog-hero-grid">
          <div>
          <span className="eyebrow">Blog Section</span>
          <h1>Corporate Insights & Market Intelligence</h1>
          <p>
            Explore executive insights on global expansion, investment strategy, technology and
            cross-border operations.
          </p>
          <div className="blog-hero-actions">
            <Link className="btn gold" to="/contact">
              Request Advisory
            </Link>
            <Link className="btn outline-dark" to="/services/investment-funding">
              Become Investor
            </Link>
          </div>
          </div>
          <article className="blog-featured">
            <img src={posts[0].image} alt={posts[0].title} loading="lazy" />
            <div>
              <span>{posts[0].category}</span>
              <h3>{posts[0].title}</h3>
              <p>{posts[0].excerpt}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="section blog-posts-section">
        <div className="container grid three-col blog-posts-grid">
          {posts.map((post) => (
            <article className="info-card blog-post-card" key={post.title}>
              <img src={post.image} alt={post.title} loading="lazy" />
              <div className="blog-post-meta">
                <span>{post.category}</span>
                <em>{post.readTime}</em>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link to="/contact">Read Full Insight</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default BlogPage;

