import Image from "next/image";
import { useContext, useState } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { fsDB, storage } from "../lib/firebase";
import { AppContext } from "../lib/ContextNext";
const UserProfile = ({ PAGEuser, admin }) => {
  const [editmote, seteditmode] = useState(false);
  const [input, setinput] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const { user } = useContext(AppContext);
  //NOTE: repeated
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
  //NOTE: repeated
  async function handleEditSubmit() {
    seteditmode(false);
    await deleteDoc(doc(fsDB, "usernames", PAGEuser.username));
    await updateDoc(doc(fsDB, "users", user.uid), {
      username: input,
      photoURL: imgUrl,
    });
    await setDoc(doc(fsDB, "usernames", input), {
      uid: user.uid,
    });
    window.location.replace(input);
  }
  return (
    <>
      {PAGEuser && (
        <div className="box-center">
          {admin && (
            <p
              style={{ backgroundColor: `${editmote ? "#818181" : "#C1BCBC"}` }}
              onClick={() => seteditmode((old) => !old)}
              className={`push-left btn`}
            >
              {editmote ? "🞮 Cancel" : "✎ Edit"}
            </p>
          )}
          <div style={{ width: "100%" }}>
            <Image
              width={300}
              height={300}
              src={imgUrl ? imgUrl : PAGEuser.photoURL}
              className="card-img-center"
            />
          </div>
          {editmote && (
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
          )}
          <p>
            <i>{PAGEuser.displayName}</i>
          </p>
          {!editmote && <h1>@{PAGEuser.username}</h1>}
          {editmote && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <h1>@</h1>
                <input
                  value={input}
                  onChange={(e) => setinput(e.target.value)}
                  type={"text"}
                  style={{ width: "300px", height: "40px" }}
                />
              </div>
              <button onClick={handleEditSubmit} className="btn-green">
                save
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default UserProfile;
