import styles from "../../styles/post.module.css";
import PostContent from "../../components/PostContent";
import Link from "next/link";
export default function Post() {
  let post = {
    content: "fwefwfwefw fwe fegthhrth ergerrtheh eh e",
    createdAt: 1,
    heartCount: 0,
    published: true,
    slug: "i-miss-u",
    title: "i Miss u SM :(",
    uid: "2323MGIO2J3IO23JO2IJ3TOJ23TI2J3OI",
    updatedAt: " 2 feb 2018 at 19:00 AM ",
    username: "gouderhicham",
  };
  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
        <Link href="/enter">
          <button>💗 Sign Up</button>
        </Link>
      </aside>
    </main>
  );
}
