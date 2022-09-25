import useDebounce from "@clave/use-debounce";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../lib/ContextNext";
import { checkusername } from "../lib/hooks";
const UserProfile = ({ user, id }) => {
  // checkusername(delayedInput.replace(/^\s+|\s+$/gm, ""), setvalid);
  const [input, setinput] = useState("");
  const [valid, setvalid] = useState(false);
  const delayedInput = useDebounce(input, 400);
  const [isadmin, setisadmin] = useState(false);
  const [editmode, seteditmode] = useState(false);
  const { user: admin } = useContext(AppContext);
  useEffect(() => {
    console.log(admin?.uid);
    if (admin?.uid === id) {
      setisadmin(true);
    } else {
      setisadmin(false);
    }
  }, [admin]);
  useEffect(() => {
    checkusername(delayedInput.replace(/^\s+|\s+$/gm, ""), setvalid);
  }, [delayedInput]);
  return (
    <>
      {user && (
        <div className="box-center">
          {admin && (
            <span
              onClick={() => {
                seteditmode((old) => !old);
              }}
              className="push-left"
            >
              {!editmode ? "Edit profile ✎" : "Cancel ✎"}
            </span>
          )}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Image
              width={300}
              height={300}
              src={user.photoURL}
              className="card-img-center"
            />
            {editmode && (
              <label
                style={{
                  width: "fit-content",
                  cursor: "pointer",
                  margin: "1rem 0 0 0",
                }}
                className="btn"
              >
                Upload Image
                <input type="file" accept="image/*" />
              </label>
            )}
          </div>

          <p>
            <i>{user.displayName}</i>
          </p>
          {editmode && (
            <input
              onChange={(e) => setinput(e.target.value)}
              className="input align-center"
              type={"text"}
            />
          )}
          {!editmode && <h1>@{user.username}</h1>}
        </div>
      )}
    </>
  );
};
export default UserProfile;
