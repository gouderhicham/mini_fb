import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../lib/ContextNext";
const Posts = ({ posts }) => {
  const { user } = useContext(AppContext);
  return (
    <>
      {posts.map((post) => (
        <PostItem user={user} key={Math.random()} post={post} />
      ))}
    </>
  );
};
export default Posts;

function PostItem({ post, user }) {
  const [editmode, seteditmode] = useState(false);
  const [admin, setadmin] = useState(false);
  useEffect(() => {
    if (user?.uid === post.id) {
      setadmin(true);
    } else {
      setadmin(false);
    }
  }, []);
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      {admin && (
        <span
          onClick={() => {
            console.log(user.uid, "=>", post.id);
            seteditmode((old) => !old);
          }}
          className="push-left"
        >
          Edit ✎
        </span>
      )}

      <h2>
        <a>{post.title}</a>
      </h2>
      <footer>
        <div className="img-flex">
          <span>120 words. 3 min to read</span>
          {post.img && (
            <img className="img-flex-img" src={post.img} height={400} />
          )}
        </div>
        <span onClick={() => console.log(post.uid)} className="push-left">
          ❤ {post.heartCound}
        </span>
      </footer>
    </div>
  );
}
