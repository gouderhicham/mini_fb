import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { AppContext } from "../lib/ContextNext";
import { fsDB } from "../lib/firebase";
//TODO: add the profile pic next to the username in each post :DONE
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
  async function updatePosts() {
    let mydoc = doc(fsDB, "users", post.uid);
    let data = await getDoc(mydoc);
    if (data.exists()) {
      await updateDoc(doc(fsDB, "users", post.uid, "posts", post.slug), {
        username: data.data().username,
        Proimg: data.data().photoURL,
      });
    }
  }
  useEffect(() => {
    updatePosts();
  }, []);
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a style={{ display: "flex", alignItems: "center" }}>
          <img style={{ width: 30, borderRadius: "50%" }} src={post.Proimg} />
          <strong> @{post.username}</strong>
        </a>
      </Link>
      {adminId === post?.uid && <p className="push-left"> ✎ Edit </p>}
      <h2>
        <a>{post.title}</a>
      </h2>
      <footer>
        <span>Created : {formDate(new Date(post.createdAt))}</span>
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
function formDate(date) {
  let time = "";
  if (date.getHours() > 12) {
    time = "PM";
  } else {
    time = "AM";
  }
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} ${time}`;
}
