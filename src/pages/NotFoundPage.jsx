import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="section inner-hero">
      <div className="container narrow">
        <h1>404</h1>
        <p>The page you are looking for does not exist.</p>
        <Link className="btn gold" to="/">
          Return Home
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
