import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import Posts from "../../components/Posts";
import UserProfile from "../../components/UserProfile";
import { fsDB } from "../../lib/firebase";
const UsernamePage = ({ userData, posts }) => {
  const route = useRouter();
  console.log(posts);
  return (
    <>
      <Head>
        <title>
          {route.query.username[0].toUpperCase() +
            route.query.username.slice(1)}
        </title>
      </Head>
      <main>
        <UserProfile user={userData} />
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
    const q = query(ref, limit(5), where("published", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      postsDATA.push(doc.data());
    });

    return {
      props: {
        userData: data,
        posts: postsDATA,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}
