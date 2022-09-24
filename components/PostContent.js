import Link from "next/link";
export default function PostContent({ post }) {
  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{" "}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{" "}
        on {post.createdAt}
      </span>
      <p>{post?.content}</p>
    </div>
  );
}
