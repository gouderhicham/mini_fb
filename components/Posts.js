import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../lib/ContextNext";
import { fsDB, storage } from "../lib/firebase";
import { formDate } from "../lib/hooks";
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
  const route = useRouter();
  const [editmode, seteditmode] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [input, setinput] = useState("");
  const onSelectFile = (e) => {
    const file = e.target?.files[0];
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
        });
      }
    );
  };
  async function updatePosts() {
    //NOTE: this if is to reduce number of read request to firebase database 
    if (route.query.username === null) return;
    let mydoc = doc(fsDB, "users", post.uid);
    let data = await getDoc(mydoc);
    if (data.exists()) {
      await updateDoc(doc(fsDB, "users", post.uid, "posts", post.slug), {
        username: data.data().username,
        Proimg: data.data().photoURL,
      });
    }
  }
  async function handleSub() {
    let mydoc = doc(fsDB, "users", post.uid);
    let data = await getDoc(mydoc);
    if (data.exists()) {
      await updateDoc(doc(fsDB, "users", post.uid, "posts", post.slug), {
        title: input,
        img: imgUrl,
      });
      window.location.reload();
    }
  }
  useEffect(() => {
    updatePosts();
  }, []);
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a
          style={{
            width: "fit-content",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            style={{ width: 30, borderRadius: "50%", marginRight: "0.3rem" }}
            src={post.Proimg}
          />
          <strong> {post.username}</strong>
        </a>
      </Link>
      {adminId === post?.uid && (
        <>
          <p
            onClick={() => seteditmode((old) => !old)}
            className="push-left btn-gray"
          >
            ✎ Edit
          </p>
          <p
            onClick={async () => {
              await deleteDoc(doc(fsDB, "users", post.uid, "posts", post.slug));
              window.location.reload();
            }}
            className="push-left btn-red"
          >
            🗑️ Delete
          </p>
        </>
      )}
      <h2>
        {!editmode && <a>{post.title}</a>}
        {editmode && (
          <>
            <input
              onChange={(e) => setinput(e.target.value)}
              value={input}
              placeholder="title..."
              type={"text"}
              style={{ width: "50%" }}
            />

            <label
              style={{
                width: "fit-content",
                cursor: "pointer",
                margin: "0.25rem 0",
              }}
              className="btn"
            >
              Upload Image
              <input onChange={onSelectFile} type="file" accept="image/*" />
            </label>
          </>
        )}
      </h2>
      <footer>
        <span>Created : {formDate(new Date(post.createdAt))}</span>
        {(imgUrl || post.img) && (
          <img
            src={imgUrl ? imgUrl : post.img}
            height={350}
            style={{
              objectFit: "contain",
              display: "flex",
              alignSelf: "self-start",
            }}
          />
        )}
      </footer>
      <span className="push-left">❤ {post.heartCound}</span>
      {editmode && (
        <button onClick={handleSub} className="btn-green ">
          save
        </button>
      )}
    </div>
  );
}
