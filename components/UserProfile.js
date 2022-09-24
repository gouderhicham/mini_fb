import Image from "next/image";
const UserProfile = ({ user }) => {
  return (
    <>
      {user && (
        <div className="box-center">
          <div style={{ width:"100%" }}>
            <Image
              width={300}
              height={300}
              src={user.photoURL}
              className="card-img-center"
            />
          </div>

          <p>
            <i>{user.displayName}</i>
          </p>
          <h1>@{user.username}</h1>
        </div>
      )}
    </>
  );
};
export default UserProfile;
