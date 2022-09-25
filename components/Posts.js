import Link from "next/link";

const Posts = ({ posts }) => {
  return (
    <>
      {posts.map((post) => (
        <PostItem key={Math.random()} post={post} />
      ))}
    </>
  );
};
export default Posts;

function PostItem({ post }) {
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      <p className="push-left"> ✎ Edit </p>
      <h2>
        <a>{post.title}</a>
      </h2>
      <footer>
        <span>120 words. 3 min to read</span>
        {post.img && <img src={post.img} />}
        <span className="push-left">❤ {post.heartCound}</span>
      </footer>
    </div>
  );
}
