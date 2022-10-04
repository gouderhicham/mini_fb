import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { fsDB, storage } from "../lib/firebase";
import { AppContext } from "../lib/ContextNext";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/router";
import { SignOutButton, checkusername } from "../pages/enter";
import useDebounce from "@clave/use-debounce";
import Loader from "./Loader";
const UserProfile = ({ PAGEuser, admin }) => {
  const [animationParent] = useAutoAnimate();
  const route = useRouter();
  const [editmote, seteditmode] = useState(false);
  const [input, setinput] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [valid, setvalid] = useState(false);
  const [loading, setloading] = useState(false);
  const { user, profileuser, setprofileuser } = useContext(AppContext);
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
  async function handleEditSubmit() {
    seteditmode(false);
    if (input === "" && imgUrl !== null) {
      await updateDoc(doc(fsDB, "users", user.uid), {
        photoURL: imgUrl,
      });
    } else if (imgUrl === null && input !== "") {
      await deleteDoc(doc(fsDB, "usernames", PAGEuser.username));
      await updateDoc(doc(fsDB, "users", user.uid), {
        username: input,
      });
      await setDoc(doc(fsDB, "usernames", input), {
        uid: user.uid,
      });
    } else {
      await deleteDoc(doc(fsDB, "usernames", PAGEuser.username));
      await updateDoc(doc(fsDB, "users", user.uid), {
        username: input,
        photoURL: imgUrl,
      });
      await setDoc(doc(fsDB, "usernames", input), {
        uid: user.uid,
      });
    }
    if (input !== "") {
      setprofileuser((old) => ({ ...old, username: input }));
    }
    route.replace(input || profileuser.username);
  }
  const delayedInput = useDebounce(input, 200);
  useEffect(() => {
    if (input.length > 0) {
      checkusername(
        delayedInput.replace(/^\s+|\s+$/gm, ""),
        setvalid,
        setloading
      );
    }
  }, [delayedInput]);
  useEffect(() => {
    setloading(true);
    if (input.length === 0) {
      setloading(false);
      setvalid(true);
    }
  }, [input]);
  return (
    <>
      {PAGEuser && (
        <div ref={animationParent} className="box-center">
          {admin && (
            <div className="expand">
              <SignOutButton />
              <p
                style={{
                  backgroundColor: `${editmote ? "#818181" : "#C1BCBC"}`,
                }}
                onClick={() => seteditmode((old) => !old)}
                className={`btn`}
              >
                {editmote ? "🞮 Cancel" : "✎ Edit"}
              </p>
            </div>
          )}
          <div style={{ width: "100%" }}>
            <Image
              width={300}
              height={300}
              src={imgUrl ? imgUrl : PAGEuser.photoURL}
              className="card-img-center"
              objectFit="cover"
            />
            {!imgUrl && progresspercent !== 0 && (
              <div
                className="innerbar"
                style={{
                  width: `${progresspercent}%`,
                }}
              ></div>
            )}
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
              <input
                autoFocus={true}
                onChange={onSelectFile}
                type="file"
                accept="image/*"
              />
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
              <button
                disabled={!valid}
                onClick={handleEditSubmit}
                className="btn-green"
              >
                save
              </button>
              <div className="align-center-row">
                <Image src="/validation.png" width={30} height={30} />
                <h4 style={{ paddingLeft: 5 }}>validation</h4>
              </div>
              <Loader show={loading} />
              <div>Username Valid: {valid.toLocaleString()}</div>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default UserProfile;
