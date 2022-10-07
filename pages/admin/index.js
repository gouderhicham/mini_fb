import { doc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useContext, useState } from "react";
import { fsDB, storage } from "../../lib/firebase";
import { AppContext } from "../../lib/ContextNext";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
function PostPage({ image }) {
  const route = useRouter();
  const [form, setform] = useState({
    content: "",
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
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
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
    const postId = Math.round(Math.random() * 10000000);
    e.preventDefault();
    await setDoc(
      doc(
        fsDB,
        "users",
        user.uid,
        "posts",
        `${profileuser.username}_posts_${postId}`
      ),
      {
        createdAt: new Date().getTime(),
        heartCound: [],
        published: true,
        slug: `${profileuser.username}_posts_${postId}`,
        content: form.content,
        uid: user.uid,
        username: profileuser.username,
        img: imgUrl,
        Proimg: profileuser.photoURL,
      }
    );
    route.push(profileuser.username);
  }
  if (!user) {
    return <h1>you must be logged in</h1>;
  }
  return (
    <>
      <Head>
        <title>Post Page | Mini Fb</title>
      </Head>
      <main>
        <form onSubmit={handleSubmit} className="form">
          <a className="gap center bottom">
            {profileuser?.photoURL && (
              <Image
                className="profile-pic"
                width={50}
                height={50}
                src={profileuser?.photoURL}
                objectFit="cover"
              />
            )}
            <div className="flex-start">
              <strong>{profileuser?.username}</strong>
            </div>
          </a>
          <textarea
            rows="10"
            type={"text"}
            value={form.content}
            onChange={(e) =>
              setform((old) => ({
                ...old,
                content: e.target.value,
              }))
            }
            placeholder="what's on your mind today ... "
          />
          {imgUrl && (
            <div className={"image-container postImg"}>
              <Image src={imgUrl} layout="fill" className={"image"} />
            </div>
          )}

          <label className="btn labeling">
            Upload Image
            <input onChange={onSelectFile} type="file" accept="image/*" />
          </label>
          {!imgUrl && progresspercent !== 0 && (
            <div
              className="innerbar"
              style={{
                width: `${progresspercent}%`,
              }}
            >
              {progresspercent}
            </div>
          )}
          <button
            disabled={
              progresspercent !== 0 && progresspercent !== 100 ? true : false
            }
            className="btn-green"
            type="submit"
          >
            Post
          </button>
        </form>
      </main>
    </>
  );
}
export default PostPage;
