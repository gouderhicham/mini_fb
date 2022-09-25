import { doc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { fsDB, storage } from "../../lib/firebase";
import { getRandomString } from "../../lib/hooks";
import { AppContext } from "../../lib/ContextNext";
import { useRouter } from "next/router";
//TODO: when image uploaded you don't care about the name u just post it to storage and then retrieve it
//TODO: and set it to imgUrl var and then post to the firestore posts collec with image as img : imgUrl :BREAK
function PostPage() {
  const route = useRouter();
  const { user, profileuser } = useContext(AppContext);
  const [form, setform] = useState({
    input: "",
    title: "",
    slug: "",
  });
  const [imgUrl, setImgUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  //NOTE: upload image to firebase storage
  async function handleSubmit(e) {
    e.preventDefault();
    const file = e.target[2]?.files[0];
    if (!file) return;
    let uniqueName = getRandomString();
    const storageRef = ref(storage, `files/${file.name}${uniqueName}`);
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
          addUser();
        });
      }
    );
    // if (imgUrl) { NOTE: this is the cause why btn doesn't work at first click
    // TODO: wait for the image to load than fire
    async function addUser() {
      const docRef = doc(fsDB, "users", user.uid, "posts", form.slug);
      await setDoc(docRef, {
        content: form.input,
        createdAt: new Date().getTime(),
        heartCound: 0,
        published: true,
        slug: form.slug,
        title: form.title,
        username: profileuser.username,
        id: user.uid,
        img: imgUrl,
      });
      console.log("post added");
      route.push(profileuser.username);
    }
    // }
  }
  //NOTE: preview the image on select
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  return (
    <main>
      <form onSubmit={handleSubmit} className="form">
        <input
          className="input"
          type={"text"}
          onChange={(e) =>
            setform((old) => ({
              ...old,
              title: e.target.value,
              slug: e.target.value
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .replace(/([a-z])([A-Z])/g, "$1-$2")
                .replace(/[\s_]+/g, "-")
                .toLowerCase(),
            }))
          }
          placeholder="title..."
          style={{
            fontFamily: "monospace",
            width: "60%",
            fontSize: "21px",
            padding: "1rem",
            borderBottom: "none",
          }}
        />
        <textarea
          style={{
            width: "60%",
            fontSize: "21px",
            padding: "1rem",
          }}
          rows="10"
          type={"text"}
          value={form.input}
          onChange={(e) =>
            setform((old) => ({ ...old, input: e.target.value }))
          }
          placeholder="content... "
        />
        {selectedFile && (
          <img
            src={preview}
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
        <p>{form.slug}</p>
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
