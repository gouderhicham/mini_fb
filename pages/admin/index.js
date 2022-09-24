import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../../lib/firebase";
function PostPage() {
  const [input, setinput] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  //NOTE: upload image to firebase storage
  const handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];
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
  //NOTE: preview the image on select
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

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };
  return (
    <main style={{}}>
      <form onSubmit={handleSubmit} className="form">
        <textarea
          style={{
            width: "60%",
            fontSize: "21px",
            padding: "1rem",
          }}
          rows="10"
          type={"text"}
          value={input}
          onChange={(e) => setinput(e.target.value)}
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
        <button
          className="btn-green"
          style={{ fontSize: "18px" }}
          type="submit"
        >
          Post
        </button>
      </form>
      {!imgUrl && (
        <div className="outerbar">
          <div className="innerbar" style={{ width: `${progresspercent}%` }}>
            {progresspercent}%
          </div>
        </div>
      )}
      {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />}
    </main>
  );
}

export default PostPage;
