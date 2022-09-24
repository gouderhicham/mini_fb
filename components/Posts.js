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
      <Link href={`${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>
      <footer>
        <span>120 words. 3 min to read</span>
        <span className="push-left">❤ {post.heartCound} Hearts</span>
      </footer>
    </div>
  );
}
