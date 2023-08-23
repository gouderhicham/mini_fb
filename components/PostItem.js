import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fsDB, storage } from "../lib/firebase";
import { formDate } from "../lib/hooks";
import { useAutoAnimate } from "@formkit/auto-animate/react";
export default function PostItem({ post, adminId, profileuser }) {
  const [animationParent] = useAutoAnimate();
  const [Parent] = useAutoAnimate();
  const [editButtonsAnimation] = useAutoAnimate();
  const route = useRouter();
  const [valid, setvalid] = useState(false);
  const [editmode, seteditmode] = useState(false);
  const [expanded, setexpanded] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [input, setinput] = useState(post?.content);
  const [liked, setliked] = useState(false);
  const [likesnum, setlikesnum] = useState(post.heartCound.length || 0);
  const [showmore, setshowmore] = useState(false);
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
    if (docSnap.data()?.heartCound) {
      if (docSnap.data().heartCound.includes(adminId)) {
        setliked(true);
      }
    } else {
      console.log("No such document! (document not liked ?? reomve later)");
    }
    //NOTE: this if statement is used to reduce the number of read request to firebase database
    if (route.query.username === null) return;
    let mydoc = doc(fsDB, "users", post.uid);
    let data = await getDoc(mydoc);
    if (data.exists()) {
      await updateDoc(doc(fsDB, "users", post.uid, "posts", post.slug), {
        username: data.data().username,
        Proimg: data.data().photoURL,
      }).catch((err) => console.log("no doc to update"));
    }
  }
  async function handleSub() {
    let mydoc = doc(fsDB, "users", post.uid);
    let data = await getDoc(mydoc);
    if (data.exists()) {
      if (imgUrl === null && input !== "") {
        await updateDoc(doc(fsDB, "users", post.uid, "posts", post.slug), {
          content: input,
        });
      } else if (input === "" && imgUrl !== null) {
        await updateDoc(doc(fsDB, "users", post.uid, "posts", post.slug), {
          img: imgUrl,
        });
      } else {
        await updateDoc(doc(fsDB, "users", post.uid, "posts", post.slug), {
          content: input,
          img: imgUrl,
        });
      }
      if (route.query.username) {
        route.replace(route.asPath);
      } else {
        window.location.replace(route.asPath);
      }
    }
  }
  function returnShowNumber() {
    if (post.content.length > 250) {
      return 200;
    } else {
      post.content.length;
    }
  }
  useEffect(() => {
    updatePosts();
  }, []);
  useEffect(() => {
    if (input !== post.content && input !== "" && imgUrl === null) {
      setvalid(true);
    } else if (
      (input === "" && imgUrl === null) ||
      (input === post.content && imgUrl === null)
    ) {
      setvalid(false);
    }
  }, [input]);
  useEffect(() => {
    if (
      (input === post.content && imgUrl !== null) ||
      (input === "" && imgUrl !== null)
    ) {
      setvalid(true);
    }
  }, [imgUrl]);
  return (
    <div ref={Parent} className="card">
      <div className="expand">
        {/* NOTE: profile img and username and date */}
        <Link href={`/${post.username}`}>
          <a className="gap center">
            <Image
              className="profile-pic"
              width={50}
              height={50}
              src={post.Proimg}
              objectFit="cover"
            />

            <div className="flex-start">
              <strong> {post.username}</strong>
              <span>{formDate(new Date(post.createdAt))}</span>
            </div>
          </a>
        </Link>
        {/* NOTE: edit button  */}
        {adminId === post?.uid && (
          <div ref={editButtonsAnimation} className="expand-btns">
            <strong
              onClick={() => {
                setexpanded((old) => !old);
              }}
              className="edit-button"
            >
              ⋮
            </strong>
            {expanded && (
              <div className="thh">
                <div
                  onClick={(e) => {
                    e.target.classList.toggle("clicked");
                    seteditmode((old) => !old);
                  }}
                  className="cursor edit"
                >
                  ✎
                </div>
                <div
                  onClick={async () => {
                    await deleteDoc(
                      doc(fsDB, "users", post.uid, "posts", post.slug)
                    );

                    if (route.query.username) {
                      route.replace(route.asPath);
                    } else {
                      window.location.replace(route.asPath);
                    }
                  }}
                  className="cursor delete"
                >
                  🗑️
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* NOTE: post content */}
      <>
        <p style={{ opacity: 0, position: "absolute", pointerEvents: "none" }}>
          {post.content}
        </p>
        {!editmode && (
          <>
            <p ref={animationParent}>
              {showmore ? (
                <>{post.content}</>
              ) : (
                <>
                  {post.content.slice(0, returnShowNumber())}
                  {showmore ? "" : post.content.length > 250 && "..."}
                </>
              )}
              <>
                {post.content.length > 250 && (
                  <span
                    className="backg"
                    onClick={() => setshowmore((old) => !old)}
                  >
                    show {showmore ? "less" : "more"}
                  </span>
                )}
              </>
            </p>
          </>
        )}
        {editmode && (
          <div>
            <textarea
              className="textarea"
              rows="10"
              type={"text"}
              autoFocus
              value={input}
              onChange={(e) => setinput(e.target.value)}
              style={{ border: "none", outline: "none" }}
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
          </div>
        )}
      </>
      {/* NOTE: post image  */}

      {(imgUrl || post.img) && (
        <div className={"image-container"}>
          <Image
            src={imgUrl ? imgUrl : post.img}
            layout="fill"
            className={"image"}
          />
        </div>
      )}
      {/* NOTE: likes bar and comments */}
      <div className="expand">
        <span
          className="align-center-row gap cursor"
          onClick={async () => {
            if (profileuser) {
              setliked((old) => !old);
              setlikesnum((old) => {
                if (!liked) {
                  return ++old;
                } else {
                  return --old;
                }
              });
              if (!liked) {
                await updateDoc(
                  doc(fsDB, "users", post.uid, "posts", post.slug),
                  {
                    heartCound: arrayUnion(adminId),
                  }
                ).catch((err) => console.log("no content to like"));
              } else {
                await updateDoc(
                  doc(fsDB, "users", post.uid, "posts", post.slug),
                  {
                    heartCound: arrayRemove(adminId),
                  }
                ).catch((err) => console.log("no content to like"));
              }
            } else {
              confirm("you must be logged in");
            }
          }}
        >
          <img src={`${liked ? "/heartRED.png" : "/heartBLACK.png"}`} />
          <p>{likesnum} likes</p>
        </span>
        <div className="align-center-row gap">
          <Image src={"/share.png"} height={20} width={20} />
          <p>Share</p>
        </div>
      </div>

      {editmode && (
        <button disabled={!valid} onClick={handleSub} className="btn-green ">
          save
        </button>
      )}
    </div>
  );
}