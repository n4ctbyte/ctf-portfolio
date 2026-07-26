import { useState, useEffect } from "react";
import {
  FolderOpen,
  FileText,
  ChevronLeft,
  ArrowLeft,
  Loader2,
  Search,
  Terminal,
  Tag,
  Shield,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import eventConfig from "./event_config.json";

interface GitHubContent {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url?: string;
  url: string;
}

interface CacheEntry {
  data: GitHubContent[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000;
const GITHUB_API_BASE =
  "https://api.github.com/repos/n4ctbyte/ctf-writeups/contents";

const CUSTOM_CONFIG: Record<
  string,
  { title?: string; description?: string; image?: string }
> = eventConfig;

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800";
const DEFAULT_DESC =
  "Explore challenges, exploits, and full writeup documentation for this event.";

export default function EvidenceLogs() {
  const [currentPath, setCurrentPath] = useState("/");
  const [currentDirContents, setCurrentDirContents] = useState<GitHubContent[]>(
    [],
  );
  const [selectedFile, setSelectedFile] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTags, setEventTags] = useState<Record<string, string[]>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchDirectoryContents(currentPath);
    setSearchQuery("");
  }, [currentPath]);

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const cached = localStorage.getItem("gh_event_tags_v7");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            setEventTags(parsed.data);
            return;
          }
        }

        const treeResp = await fetch(
          "https://api.github.com/repos/n4ctbyte/ctf-writeups/git/trees/main?recursive=1",
        );
        if (!treeResp.ok) return;
        const treeData = await treeResp.json();

        if (!treeData || !treeData.tree) return;

        const mdFiles = treeData.tree.filter(
          (node: any) => node.type === "blob" && node.path.endsWith(".md"),
        );

        const newEventTags: Record<string, Set<string>> = {};
        const chunkSize = 5;

        for (let i = 0; i < mdFiles.length; i += chunkSize) {
          const chunk = mdFiles.slice(i, i + chunkSize);
          await Promise.all(
            chunk.map(async (file: any) => {
              const parts = file.path.split("/");
              if (parts.length < 2) return;
              const eventName = parts[0];

              const rawUrl = `https://raw.githubusercontent.com/n4ctbyte/ctf-writeups/main/${file.path}`;
              try {
                const fileResp = await fetch(rawUrl);
                if (!fileResp.ok) return;
                const text = await fileResp.text();

                const tags = extractTags(text);

                if (tags.length > 0) {
                  if (!newEventTags[eventName])
                    newEventTags[eventName] = new Set();
                  tags.forEach((t) => newEventTags[eventName].add(t));
                }
              } catch (e) {
                console.error(e);
              }
            }),
          );
        }

        const finalTags: Record<string, string[]> = {};
        for (const event in newEventTags) {
          finalTags[event] = Array.from(newEventTags[event]);
        }

        setEventTags(finalTags);
        localStorage.setItem(
          "gh_event_tags_v7",
          JSON.stringify({
            data: finalTags,
            timestamp: Date.now(),
          }),
        );
      } catch (e) {
        console.error(e);
      }
    };

    fetchAllTags();
  }, []);

  const extractTags = (rawContent: string): string[] => {
    const lines = rawContent.split("\n");
    for (let i = 0; i < Math.min(lines.length, 30); i++) {
      const line = lines[i];
      if (line.toLowerCase().includes("category")) {
        const parts = line.split(":");
        if (parts.length > 1) {
          const val = parts.slice(1).join(":");
          const cleanVal = val.replace(/[*_`\[\]]/g, "").trim();
          return cleanVal.split(",").map((t) => t.trim().toUpperCase());
        }
      }
    }
    return [];
  };

  const getCacheKey = (path: string) => `gh_cache_${path}`;

  const getFromCache = (path: string): GitHubContent[] | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(path));
      if (cached) {
        const entry: CacheEntry = JSON.parse(cached);
        if (Date.now() - entry.timestamp < CACHE_DURATION) return entry.data;
        localStorage.removeItem(getCacheKey(path));
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const saveToCache = (path: string, data: GitHubContent[]) => {
    try {
      const entry: CacheEntry = { data, timestamp: Date.now() };
      localStorage.setItem(getCacheKey(path), JSON.stringify(entry));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDirectoryContents = async (path: string) => {
    const cached = getFromCache(path);
    if (cached) {
      setCurrentDirContents(cached);
      return;
    }

    setIsLoading(true);
    const apiPath = path === "/" ? "" : path;
    const url = `${GITHUB_API_BASE}${apiPath}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data: GitHubContent[] = await response.json();
        const sortedData = data.sort(
          (a, b) => (b.type === "dir" ? 1 : 0) - (a.type === "dir" ? 1 : 0),
        );
        setCurrentDirContents(sortedData);
        saveToCache(path, sortedData);
      } else {
        setCurrentDirContents([]);
      }
    } catch (error) {
      console.error(error);
      setCurrentDirContents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderClick = (dirName: string) => {
    const newPath =
      currentPath === "/" ? `/${dirName}` : `${currentPath}/${dirName}`;
    setCurrentPath(newPath);
  };

  const handleBackClick = () => {
    if (currentPath === "/") return;
    const newPath = currentPath.split("/").slice(0, -1).join("/") || "/";
    setCurrentPath(newPath);
  };

  const handleFileClick = async (file: GitHubContent) => {
    if (!file.download_url) return;
    setIsFileLoading(true);
    try {
      const response = await fetch(file.download_url);
      const rawContent = await response.text();
      setSelectedFile({ title: file.name, content: rawContent });
    } catch (error) {
      console.error(error);
    } finally {
      setIsFileLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (tag === "ALL") {
      setSelectedTags([]);
      return;
    }
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const allUniqueTags = [
    "ALL",
    ...Array.from(new Set(Object.values(eventTags).flat())),
  ].sort();

  const filteredContents = currentDirContents.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (currentPath !== "/") return matchesSearch;

    const itemTags = eventTags[item.name] || [];
    const matchesTag =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => itemTags.includes(tag));

    return matchesSearch && matchesTag;
  });

  return (
    <section
      id="evidence"
      className="min-h-screen w-full bg-[#0D0D0D] flex flex-col items-center py-10 p-4 md:p-6 text-[#E0E0E0]"
    >
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <Terminal className="w-8 h-8 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold tracking-tight">
            [ WRITEUPS_ARCHIVE ]
          </h2>
        </div>

        {selectedFile ? (
          <div className="w-full bg-[#121212] border-2 border-[#222222] rounded-xl overflow-hidden shadow-2xl animate-[fadeIn_0.3s_ease-in_forwards]">
            <div className="bg-[#1A1A1A] border-b border-[#222222] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={() => setSelectedFile(null)}
                className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-[#00FF41] transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" /> [ BACK TO FILES ]
              </button>
              <span className="font-mono text-xs md:text-sm text-[#00FF41] bg-[#00FF41]/10 px-3 py-1 rounded border border-[#00FF41]/20">
                {selectedFile.title}
              </span>
            </div>

            <div className="p-6 md:p-10 prose prose-invert max-w-none md:prose-lg custom-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                urlTransform={(url) => {
                  if (url.startsWith("http://") || url.startsWith("https://")) {
                    return url;
                  }
                  const cleanedPath = url.replace(/^(\.\.\/|\.\/)+/, "");
                  const basePath = currentPath === "/" ? "" : currentPath;
                  return `https://raw.githubusercontent.com/n4ctbyte/ctf-writeups/main${basePath}/${cleanedPath}`;
                }}
              >
                {selectedFile.content}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#121212] p-4 border border-[#222222] rounded-xl">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {currentPath !== "/" && (
                  <button
                    onClick={handleBackClick}
                    className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] rounded-lg text-sm font-mono text-gray-400 hover:text-[#00FF41] transition-colors shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">BACK</span>
                  </button>
                )}

                <div className="relative flex-1 min-w-0">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={
                      currentPath === "/"
                        ? "Search events..."
                        : "Search files..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#333333] pl-9 pr-4 py-2 text-sm font-mono text-[#E0E0E0] focus:border-[#00FF41] focus:outline-none rounded-lg"
                  />
                </div>
              </div>

              {currentPath === "/" && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                  {allUniqueTags.map((tag) => {
                    const isSelected =
                      tag === "ALL"
                        ? selectedTags.length === 0
                        : selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all shrink-0 border ${
                          isSelected
                            ? "bg-[#00FF41] text-[#0D0D0D] font-bold border-[#00FF41]"
                            : "bg-[#161616] text-gray-400 border-[#222222] hover:border-[#00FF41]/50"
                        }`}
                      >
                        {tag === "ALL" ? "ALL_CATEGORIES" : `#${tag}`}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentPath !== "/" && (
                <div className="font-mono text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap bg-[#0D0D0D] px-3 py-2 rounded-lg border border-[#333333] shrink-0">
                  <span className="text-[#00FF41]">root</span>
                  {currentPath}
                </div>
              )}
            </div>

            <div className="min-h-[400px]">
              {isLoading || isFileLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[350px] gap-3 bg-[#121212] border border-[#222222] rounded-xl">
                  <Loader2 className="w-8 h-8 text-[#00FF41] animate-spin" />
                  <p className="font-mono text-sm text-gray-500">
                    Decrypting data streams...
                  </p>
                </div>
              ) : filteredContents.length === 0 ? (
                <div className="bg-[#121212] border border-[#222222] rounded-xl p-12 text-center font-mono text-gray-500">
                  No records found matching your criteria.
                </div>
              ) : currentPath === "/" ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredContents.map((item) => {
                    const tags = eventTags[item.name] || [];
                    const eventCust = CUSTOM_CONFIG[item.name] || {};
                    const displayTitle = eventCust.title || item.name;
                    const displayDesc = eventCust.description || DEFAULT_DESC;
                    const displayImage = eventCust.image || DEFAULT_IMAGE;

                    return (
                      <article
                        key={item.path}
                        onClick={() =>
                          item.type === "dir"
                            ? handleFolderClick(item.name)
                            : handleFileClick(item)
                        }
                        className="bg-[#121212] border border-[#222222] hover:border-[#00FF41]/50 rounded-xl transition-all cursor-pointer group hover:bg-[#161616] overflow-hidden flex flex-col sm:flex-row shadow-lg"
                      >
                        <div className="w-full sm:w-64 h-48 sm:h-auto overflow-hidden shrink-0 border-b sm:border-b-0 sm:border-r border-[#222222] group-hover:border-[#00FF41]/30 transition-colors bg-[#0A0A0A]">
                          <img
                            src={displayImage}
                            alt={displayTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100 grayscale-[50%]"
                          />
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="text-[10px] bg-[#1A1A1A] text-[#00FF41] px-2 py-0.5 rounded border border-[#222222] flex items-center gap-1">
                                {item.type === "dir" ? (
                                  <>
                                    <Shield className="w-3 h-3" /> CTF_EVENT
                                  </>
                                ) : (
                                  <>
                                    <FileText className="w-3 h-3" />{" "}
                                    MARKDOWN_FILE
                                  </>
                                )}
                              </span>
                              {tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] bg-[#00FF41]/10 text-[#00FF41] px-2 py-0.5 rounded border border-[#00FF41]/20 flex items-center gap-1"
                                >
                                  <Tag className="w-2.5 h-2.5" /> {tag}
                                </span>
                              ))}
                            </div>
                            <h3 className="text-xl md:text-2xl font-mono font-bold text-[#E0E0E0] group-hover:text-[#00FF41] transition-colors mb-2 leading-tight">
                              {displayTitle}
                            </h3>
                            <p className="font-mono text-sm text-gray-400">
                              {displayDesc}
                            </p>
                          </div>
                          <div className="font-mono text-xs text-[#00FF41] flex items-center gap-1 group-hover:translate-x-2 transition-transform w-fit mt-6">
                            {item.type === "dir"
                              ? "ACCESS_ARCHIVE"
                              : "READ_FILE"}{" "}
                            &rarr;
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredContents.map((item) => (
                    <button
                      key={item.path}
                      onClick={() =>
                        item.type === "dir"
                          ? handleFolderClick(item.name)
                          : handleFileClick(item)
                      }
                      className="flex items-center gap-4 p-5 bg-[#121212] border border-[#222222] rounded-xl text-left hover:border-[#00FF41]/50 hover:bg-[#161616] transition-all group shadow-lg"
                    >
                      {item.type === "dir" ? (
                        <div className="p-2 bg-[#1A1A1A] rounded-lg border border-[#333333] group-hover:border-[#00FF41]/30 group-hover:bg-[#00FF41]/5 transition-colors">
                          <FolderOpen className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                        </div>
                      ) : (
                        <div className="p-2 bg-[#1A1A1A] rounded-lg border border-[#333333] group-hover:border-[#00FF41]/30 group-hover:bg-[#00FF41]/5 transition-colors">
                          <FileText className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="block font-mono text-sm truncate text-gray-300 group-hover:text-[#00FF41] transition-colors font-medium">
                          {item.name}
                        </span>
                        <span className="block font-mono text-[10px] text-gray-600 mt-1 uppercase">
                          {item.type === "dir" ? "DIRECTORY" : "MARKDOWN_FILE"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
