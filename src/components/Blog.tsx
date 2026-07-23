import { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  Tag,
  ArrowLeft,
  Clock,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  image: string;
  content: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  useEffect(() => {
    const mdFiles = import.meta.glob("./blog/*.md", {
      query: "?raw",
      import: "default",
      eager: true,
    });
    const loadedPosts: BlogPost[] = [];

    for (const path in mdFiles) {
      const rawContent = mdFiles[path] as string;
      const fileName = path.split("/").pop()?.replace(".md", "") || "unknown";

      const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
      const match = rawContent.match(frontmatterRegex);

      const meta: Record<string, string> = {
        title: fileName,
        date: "2026-01-01",
        tags: "GENERAL",
        excerpt: "",
        image:
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800",
      };

      let content = rawContent;

      if (match) {
        const frontmatter = match[1];
        content = rawContent.replace(match[0], "").trim();

        frontmatter.split("\n").forEach((line) => {
          const colonIdx = line.indexOf(":");
          if (colonIdx !== -1) {
            const key = line.slice(0, colonIdx).trim();
            const val = line.slice(colonIdx + 1).trim();
            meta[key] = val;
          }
        });
      }

      const wordCount = content.trim().split(/\s+/).length;
      const calculatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

      loadedPosts.push({
        id: fileName,
        title: meta.title || fileName,
        date: meta.date,
        readTime: `${calculatedReadTime} min read`,
        tags: meta.tags.split(",").map((t: string) => t.trim()),
        excerpt: meta.excerpt,
        image: meta.image,
        content: content,
      });
    }

    loadedPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    setPosts(loadedPosts);
  }, []);

  const allTags = [
    "ALL",
    ...Array.from(new Set(posts.flatMap((post) => post.tags))),
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "ALL" || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <section
      id="blog"
      className="min-h-screen w-full bg-[#0D0D0D] flex flex-col items-center py-10 p-4 md:p-6 text-[#E0E0E0]"
    >
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold tracking-tight">
            [ JOURNAL_LOGS ]
          </h2>
        </div>

        {selectedPost ? (
          <div className="w-full bg-[#121212] border-2 border-[#222222] rounded-xl overflow-hidden shadow-2xl animate-[fadeIn_0.3s_ease-in_forwards]">
            <div className="bg-[#1A1A1A] border-b border-[#222222] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-[#00FF41] transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" /> [ BACK TO LOGS ]
              </button>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#00FF41]" />{" "}
                  {selectedPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#00FF41]" />{" "}
                  {selectedPost.readTime}
                </span>
              </div>
            </div>

            {selectedPost.image && (
              <div className="w-full h-48 md:h-72 border-b border-[#222222] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent z-10" />
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover opacity-60"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800";
                  }}
                />
              </div>
            )}

            <div className="p-6 md:p-10 font-mono">
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#00FF41]/10 text-[#00FF41] px-2.5 py-1 rounded border border-[#00FF41]/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-invert max-w-none md:prose-lg custom-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedPost.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#121212] p-4 border border-[#222222] rounded-xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search log entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#333333] pl-9 pr-4 py-2 text-sm font-mono text-[#E0E0E0] focus:border-[#00FF41] focus:outline-none rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all shrink-0 border ${
                      selectedTag === tag
                        ? "bg-[#00FF41] text-[#0D0D0D] font-bold border-[#00FF41]"
                        : "bg-[#161616] text-gray-400 border-[#222222] hover:border-[#00FF41]/50"
                    }`}
                  >
                    {tag === "ALL" ? "ALL_TAGS" : `#${tag}`}
                  </button>
                ))}
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="bg-[#121212] border border-[#222222] rounded-xl p-12 text-center font-mono text-gray-500">
                No journal logs found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="bg-[#121212] border border-[#222222] hover:border-[#00FF41]/50 rounded-xl transition-all cursor-pointer group hover:bg-[#161616] overflow-hidden flex flex-col sm:flex-row shadow-lg"
                  >
                    <div className="w-full sm:w-64 h-48 sm:h-auto overflow-hidden shrink-0 border-b sm:border-b-0 sm:border-r border-[#222222] group-hover:border-[#00FF41]/30 transition-colors">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-100 grayscale-[30%]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800";
                        }}
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-mono text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#00FF41]" />{" "}
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#00FF41]" />{" "}
                              {post.readTime}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] bg-[#1A1A1A] text-gray-400 px-2 py-0.5 rounded border border-[#222222] flex items-center gap-1"
                              >
                                <Tag className="w-2.5 h-2.5 text-[#00FF41]" />{" "}
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <h3 className="text-xl md:text-2xl font-mono font-bold text-[#E0E0E0] group-hover:text-[#00FF41] transition-colors mb-3 leading-tight">
                          {post.title}
                        </h3>
                        <p className="font-mono text-sm text-gray-400 line-clamp-3 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="font-mono text-xs text-[#00FF41] flex items-center gap-1 group-hover:translate-x-2 transition-transform w-fit">
                        READ_ENTRY.log &rarr;
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333333; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #00FF41; }
        
        .custom-markdown h1 { font-family: monospace; color: #00FF41; font-size: 1.75rem; font-weight: bold; margin-bottom: 1rem; border-bottom: 1px solid #222; padding-bottom: 0.5rem; }
        .custom-markdown h2 { font-family: monospace; color: #E0E0E0; font-size: 1.4rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .custom-markdown h3 { font-family: monospace; color: #E0E0E0; font-size: 1.15rem; font-weight: bold; }
        .custom-markdown p { color: #B0B0B0; line-height: 1.6; margin-bottom: 1rem; font-size: 0.95rem; }
        .custom-markdown code { background-color: #1A1A1A; color: #FF79C6; padding: 0.2rem 0.4rem; rounded: 4px; font-family: monospace; font-size: 0.875rem; border: 1px solid #282A36; }
        .custom-markdown pre { background-color: #1A1A1A; padding: 1rem; border-radius: 8px; border: 1px solid #222; overflow-x: auto; margin-bottom: 1.25rem; }
        .custom-markdown pre code { background-color: transparent; color: #E0E0E0; padding: 0; border: none; font-size: 0.875rem; }
        .custom-markdown img { max-width: 100%; height: auto; border-radius: 8px; border: 2px solid #222; margin: 1.5rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
        .custom-markdown ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #B0B0B0; }
        .custom-markdown ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; color: #B0B0B0; }
        .custom-markdown li { margin-bottom: 0.25rem; }
        .custom-markdown a { color: #00FF41; text-decoration: underline; }
        .custom-markdown a:hover { color: #00cc33; }
        .custom-markdown blockquote { border-left: 4px solid #00FF41; padding-left: 1rem; color: #888; font-style: italic; background: #1a1a1a; padding-top: 0.5rem; padding-bottom: 0.5rem; border-radius: 0 8px 8px 0; }
      `}</style>
    </section>
  );
}
