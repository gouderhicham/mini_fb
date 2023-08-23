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
import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import UserProfile from "../../components/UserProfile";
import { AppContext } from "../../lib/ContextNext";
import { fsDB } from "../../lib/firebase";
import { return_url } from "../../lib/hooks";

const Posts = dynamic(() => import("../../components/Posts"));

const UsernamePage = ({ userData, posts, id, image }) => {
  const [isadmin, setisadmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user?.uid === id) {
      setisadmin(true);
    } else {
      setisadmin(false);
    }
  }, [user, id]);

  // When the data is fetched, set isLoading to false
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // If isLoading is true, show a loading indicator
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{userData.username} | Mini Fb</title>
        <meta name="robots" content="gouder hicham mini fb page"></meta>
        <meta
          name="keywords"
          content="gouder hicham , gouder , hicham , gouderhicham github , mini gb"
        />
        <meta
          name="description"
          content={`this is the user page of ${userData.username} and this paragraph is generated for fb crawlers to pereview data`}
        ></meta>
        <meta name="author" content="gouder hicham"></meta>

        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={userData.photoURL} />
        <meta property="og:title" content={`${userData.username} | Mini Fb`} />
        <meta
          property="og:description"
          content={`this is the user page of ${userData.username} and this paragraph is generated for fb crawlers to pereview data`}
        />
        <meta name="author" content="gouder hicham"></meta>
      </Head>
      <main>
        <UserProfile PAGEuser={userData} admin={isadmin} />
        <Posts posts={posts} />
        <p style={{padding : "30px"}}>i am lazy to implement the show more posts function, SORRY.</p>
      </main>
    </>
  );
};
export default UsernamePage;
export async function getServerSideProps(context) {
  const userName = context.params.username;
  const docRef = doc(fsDB, "usernames", userName);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
      notFound: true,
    };
  }

  const userData = docSnap.data().uid;
  const NEWDATA = doc(fsDB, "users", userData);
  const USERDATA = await getDoc(NEWDATA);
  const data = USERDATA.data();

  const ref = collection(fsDB, "users", userData, "posts");
  const q = query(
    ref,
    limit(7),
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);

  const postsDATA = querySnapshot.docs.map((doc) => doc.data());

  const params = context.resolvedUrl;
  const base = return_url(context);
  const url = `${base}${params}`;
  const image = await fetch(
    `https://api.savepage.io/v1/?key=96d39481fc5e144daf42d4b3d03fccee&q=${url}`
  ).then((res) => res.url);
  return {
    props: {
      image: image,
      userData: data,
      posts: postsDATA,
      id: userData,
    },
  };
}
