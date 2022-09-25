import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Posts from "../../components/Posts";
import UserProfile from "../../components/UserProfile";
import { AppContext } from "../../lib/ContextNext";
import { fsDB } from "../../lib/firebase";
const UsernamePage = ({ userData, posts, id }) => {
  const route = useRouter();
  const [isadmin, setisadmin] = useState(false);
  const { user } = useContext(AppContext);
  useEffect(() => {
    if (user?.uid === id) {
      setisadmin(true);
    } else {
      setisadmin(false);
    }
  }, [user , id]);
  return (
    <>
      <Head>
        <title>
          {route.query.username[0].toUpperCase() +
            route.query.username.slice(1)}
        </title>
      </Head>
      <main>
        <UserProfile user={userData} admin={isadmin} />
        <Posts posts={posts} />
      </main>
    </>
  );
  // return <h1>fe</h1>;
};
export default UsernamePage;
export async function getServerSideProps(context) {
  const userName = context.params.username;
  const docRef = doc(fsDB, "usernames", userName);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const userData = docSnap.data().uid;
    const NEWDATA = doc(fsDB, "users", userData);
    const USERDATA = await getDoc(NEWDATA);
    const data = USERDATA.data();
    //:BREAK
    const ref = collection(fsDB, "users", userData, "posts");
    let postsDATA = [];
    const q = query(
      ref,
      limit(5),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      postsDATA.push(doc.data());
    });
    return {
      props: {
        userData: data,
        posts: postsDATA,
        id: userData,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}
