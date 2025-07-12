import Link from "next/link";

export default async function BlogListPage() {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/all`, {
  //   cache: "no-store",
  // })
  const res = await fetch(`${`http://localhost:3000`}/api/posts/all`, {
    cache: "no-store",
  });
  const posts = await res.json();
  console.log("posts from app", posts);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📚 All BLogs Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-sm text-gray-500 mb-1">
              🖋️
              {post.author || "Anonymous"}
            </h2>
            <p className="text-sm text-gray-400">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
