import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fsDB, storage } from "../lib/firebase";
import { formDate } from "../lib/hooks";
export default function PostItem({ post, adminId, profileuser }) {
  const route = useRouter();
  const [editmode, seteditmode] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [input, setinput] = useState("");
  const [liked, setliked] = useState(false);
  const [likesnum, setlikesnum] = useState(post.heartCound.length);
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
    // NOTE: check if username if available if not add you must logged in popup 
    const docSnap = await getDoc(
      doc(fsDB, "users", post.uid, "posts", post.slug)
    );
    if (docSnap.exists()) {
      if (docSnap.data().heartCound.includes(profileuser?.username)) {
        setliked(true);
      }
    } else {
      console.log("No such document!");
    }
    //NOTE: this if statement is used to reduce the number of read request to firebase database
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
      <span
        onClick={async () => {
          setliked((old) => !old);
          setlikesnum((old) => {
            if (!liked) {
              return ++old;
            } else {
              return --old;
            }
          });
          if (!liked) {
            await updateDoc(doc(fsDB, "users", post.uid, "posts", post.slug), {
              heartCound: arrayUnion(profileuser.username),
            });
          } else {
            await updateDoc(doc(fsDB, "users", post.uid, "posts", post.slug), {
              heartCound: arrayRemove(profileuser.username),
            });
          }
        }}
        className="push-left"
      >
        {liked ? "❤️" : `❤`} {likesnum}
      </span>
      {editmode && (
        <button onClick={handleSub} className="btn-green ">
          save
        </button>
      )}
    </div>
  );
}