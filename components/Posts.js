import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "../lib/ContextNext";

const Posts = ({ posts }) => {
  const { user } = useContext(AppContext);
  return (
    <>
      {posts.map((post) => (
        <PostItem key={Math.random()} post={post} adminId={user?.uid} />
      ))}
    </>
  );
};
export default Posts;
function PostItem({ post, adminId }) {
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      {adminId === post?.uid && <p className="push-left"> ✎ Edit </p>}
      <h2>
        <a>{post.title}</a>
      </h2>
      <footer>
        <span>120 words. 3 min to read</span>
        {post.img && (
          <img
            height={350}
            style={{
              objectFit: "contain",
              display: "flex",
              alignSelf: "self-start",
            }}
            src={post.img}
          />
        )}
        <span className="push-left">❤ {post.heartCound}</span>
      </footer>
    </div>
  );
}
