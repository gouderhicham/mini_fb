import { doc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useContext, useState } from "react";
import { fsDB, storage } from "../../lib/firebase";
import { AppContext } from "../../lib/ContextNext";
import { useRouter } from "next/router";
function PostPage() {
  const route = useRouter();
  const [form, setform] = useState({
    title: "",
    content: "",
    slug: "",
  });
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const { user, profileuser } = useContext(AppContext);
  const onSelectFile = (e) => {
    const file = e.target?.files[0];
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 60
        );
        setProgresspercent(progress);
      },
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
  async function handleSubmit(e) {
    e.preventDefault();
    await setDoc(doc(fsDB, "users", user.uid, "posts", form.slug), {
      createdAt: new Date().getTime(),
      heartCound: 0,
      published: true,
      slug: form.slug,
      title: form.title,
      uid: user.uid,
      username: profileuser.username,
      img: imgUrl,
    });
    route.push(profileuser.username);
  }
  return (
    <main style={{}}>
      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="title..."
          style={{
            width: "60%",
            borderBottom: "none",
            fontFamily: "monospace",
            fontSize: "21px",
          }}
          type={"text"}
          onChange={(e) =>
            setform((old) => ({
              ...old,
              title: e.target.value,
              slug: e.target.value
                .replace(/^\s+|\s+$/gm, "")
                .replace(/[^\w\s]/gi, "")
                .replace(/([a-z])([A-Z])/g, "$1-$2")
                .replace(/[\s_]+/g, "-")
                .toLowerCase(),
            }))
          }
          value={form.title}
        />
        <textarea
          style={{
            width: "60%",
            fontSize: "21px",
            padding: "1rem",
          }}
          rows="10"
          type={"text"}
          value={form.content}
          onChange={(e) =>
            setform((old) => ({ ...old, content: e.target.value }))
          }
          placeholder="content... "
        />
        {imgUrl && (
          <img
            src={imgUrl}
            alt="uploaded file"
            style={{ width: "60%", height: 400, objectFit: "cover" }}
          />
        )}

        <label
          style={{ width: "60%", cursor: "pointer", margin: "0.25rem 0" }}
          className="btn"
        >
          Upload Image
          <input onChange={onSelectFile} type="file" accept="image/*" />
        </label>
        {!imgUrl && (
          <div
            className="innerbar"
            style={{
              width: `${progresspercent}%`,
              background: "yellow",
              height: "10px",
              margin: "0 0 2rem 0",
              padding: "1rem 0",
              whiteSpace: "nowrap",
            }}
          >
            Image uploaded {progresspercent}%
          </div>
        )}
        <p>slug : {form.slug}</p>
        <button
          className="btn-green"
          style={{ fontSize: "18px" }}
          type="submit"
        >
          Post
        </button>
      </form>
    </main>
  );
}

export default PostPage;
