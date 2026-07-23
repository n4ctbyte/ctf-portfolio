import { useState, useEffect } from "react";
import {
  FolderOpen,
  FileText,
  ChevronLeft,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  useEffect(() => {
    fetchDirectoryContents(currentPath);
  }, [currentPath]);

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
      console.error("Cache read error:", e);
    }
    return null;
  };

  const saveToCache = (path: string, data: GitHubContent[]) => {
    try {
      const entry: CacheEntry = { data, timestamp: Date.now() };
      localStorage.setItem(getCacheKey(path), JSON.stringify(entry));
    } catch (e) {
      console.error("Cache write error:", e);
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
      console.error("Failed to fetch directory contents:", error);
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
      const content = await response.text();
      setSelectedFile({ title: file.name, content });
    } catch (error) {
      console.error("Failed to fetch file content:", error);
    } finally {
      setIsFileLoading(false);
    }
  };

  return (
    <section
      id="evidence"
      className="min-h-screen w-full bg-[#0D0D0D] flex flex-col items-center py-10 p-4 md:p-6 text-[#E0E0E0]"
    >
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <FolderOpen className="w-8 h-8 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold tracking-tight">
            [ WRITEUPS_ARCHIVE ]
          </h2>
        </div>

        {selectedFile ? (
          <div className="w-full bg-[#121212] border-2 border-[#222222] rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-[#1A1A1A] border-b border-[#222222] px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedFile(null)}
                className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-[#00FF41] transition-colors"
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
          <div className="w-full bg-[#121212] border-2 border-[#222222] rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-[#1A1A1A] border-b border-[#222222] px-4 py-3 flex items-center gap-3">
              {currentPath !== "/" && (
                <button
                  onClick={handleBackClick}
                  className="p-1 hover:bg-[#252525] rounded text-gray-400 hover:text-[#00FF41] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div className="font-mono text-sm text-gray-400 overflow-x-auto whitespace-nowrap custom-scrollbar py-1">
                <span className="text-[#00FF41]">root</span>:{currentPath}
              </div>
            </div>

            <div className="p-4 min-h-[400px]">
              {isLoading || isFileLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
                  <Loader2 className="w-8 h-8 text-[#00FF41] animate-spin" />
                  <p className="font-mono text-sm text-gray-500">
                    Decrypting data streams...
                  </p>
                </div>
              ) : currentDirContents.length === 0 ? (
                <div className="flex items-center justify-center min-h-[350px]">
                  <p className="font-mono text-sm text-gray-500">
                    No writeups found in this directory.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentDirContents.map((item) => (
                    <button
                      key={item.path}
                      onClick={() =>
                        item.type === "dir"
                          ? handleFolderClick(item.name)
                          : handleFileClick(item)
                      }
                      className="flex items-center gap-3 p-4 bg-[#161616] border border-[#222222] rounded-lg text-left hover:border-[#00FF41]/50 hover:bg-[#1C1C1C] transition-all group"
                    >
                      {item.type === "dir" ? (
                        <FolderOpen className="w-5 h-5 text-amber-400 group-hover:scale-105 transition-transform shrink-0" />
                      ) : (
                        <FileText className="w-5 h-5 text-cyan-400 group-hover:scale-105 transition-transform shrink-0" />
                      )}
                      <span className="font-mono text-sm truncate text-gray-300 group-hover:text-[#00FF41] transition-colors">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
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
      `}</style>
    </section>
  );
}