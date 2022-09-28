import { useContext } from "react";
import { AppContext } from "../lib/ContextNext";
import PostItem from "./PostItem";
const Posts = ({ posts }) => {
  const { user, profileuser } = useContext(AppContext);
  return (
    <>
      {posts.map((post) => (
        <PostItem
          key={Math.random()}
          post={post}
          adminId={user?.uid}
          profileuser={profileuser}
        />
      ))}
    </>
  );
};
export default Posts;
