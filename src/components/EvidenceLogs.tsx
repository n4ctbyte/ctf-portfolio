import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { FileText, Folder, FolderOpen, ExternalLink, Terminal as TerminalIcon } from 'lucide-react';

interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  url: string;
}

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'system';
  content: string;
}

interface CacheEntry {
  data: GitHubContent[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000;
const GITHUB_API_BASE = 'https://api.github.com/repos/n4ctbyte/ctf-writeups/contents';

export default function EvidenceLogs() {
  const [currentPath, setCurrentPath] = useState('/');
  const [inputValue, setInputValue] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { type: 'system', content: '[SYSTEM]: Forensic Terminal initialized...' },
    { type: 'system', content: '[SYSTEM]: Secure connection established to remote archive.' },
    { type: 'system', content: '[SYSTEM]: Access granted. Type "help" for available commands.' },
    { type: 'output', content: '' },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDirContents, setCurrentDirContents] = useState<GitHubContent[]>([]);
  const [modalContent, setModalContent] = useState<{ title: string; content: string; url: string } | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDirectoryContents(currentPath);
  }, [currentPath]);

  useEffect(() => {
    document.title = 'Evidence Logs';
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }

    if (terminalHistory.length > 4) {
      inputRef.current?.focus();
    }
  }, [terminalHistory]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (terminalRef.current && !terminalRef.current.contains(e.target as Node)) {
        setInputValue('');
      } else {
        inputRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getCacheKey = (path: string) => `gh_cache_${path}`;

  const getFromCache = (path: string): GitHubContent[] | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(path));
      if (cached) {
        const entry: CacheEntry = JSON.parse(cached);
        if (Date.now() - entry.timestamp < CACHE_DURATION) {
          return entry.data;
        }
        localStorage.removeItem(getCacheKey(path));
      }
    } catch (e) {
      console.error('Cache read error:', e);
    }
    return null;
  };

  const saveToCache = (path: string, data: GitHubContent[]) => {
    try {
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(getCacheKey(path), JSON.stringify(entry));
    } catch (e) {
      console.error('Cache write error:', e);
    }
  };

  const fetchDirectoryContents = async (path: string) => {
    const cached = getFromCache(path);
    if (cached) {
      setCurrentDirContents(cached);
      return;
    }

    setIsLoading(true);
    const apiPath = path === '/' ? '' : path;
    const url = `${GITHUB_API_BASE}${apiPath}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data: GitHubContent[] = await response.json();
        setCurrentDirContents(data);
        saveToCache(path, data);
      } else {
        setCurrentDirContents([]);
      }
    } catch (error) {
      addToHistory({ type: 'error', content: `[ERROR]: Failed to fetch directory contents: ${error}` });
      setCurrentDirContents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = (line: TerminalLine) => {
    setTerminalHistory(prev => [...prev, line]);
  };

  const typewriterEffect = (lines: TerminalLine[]) => {
    setIsTyping(true);
    lines.forEach((line, index) => {
      typingTimeoutRef.current = setTimeout(() => {
        addToHistory(line);
        if (index === lines.length - 1) {
          setIsTyping(false);
        }
      }, index * 50);
    });
  };

  const handleLs = () => {
    if (currentDirContents.length === 0) {
      typewriterEffect([{ type: 'output', content: '[INFO]: Directory is empty or not found.' }]);
      return;
    }

    const lines: TerminalLine[] = [];
    currentDirContents.forEach(item => {
      const icon = item.type === 'dir' ? '📁' : '📄';
      lines.push({
        type: 'output',
        content: `${icon} ${item.name}`,
      });
    });
    typewriterEffect(lines);
  };

  const handleCd = (target: string) => {
    if (target === '..') {
      if (currentPath === '/') {
        typewriterEffect([{ type: 'error', content: '[ERROR]: Already at root directory.' }]);
        return;
      }
      const newPath = currentPath.split('/').slice(0, -1).join('/') || '/';
      setCurrentPath(newPath);
      typewriterEffect([{ type: 'system', content: `[SYSTEM]: Directory changed to ${newPath}` }]);
      return;
    }

    const targetDir = currentDirContents.find(item => item.name === target && item.type === 'dir');
    if (!targetDir) {
      typewriterEffect([{ type: 'error', content: `[ERROR]: Directory "${target}" not found.` }]);
      return;
    }

    const newPath = currentPath === '/' ? `/${target}` : `${currentPath}/${target}`;
    setCurrentPath(newPath);
    typewriterEffect([{ type: 'system', content: `[SYSTEM]: Directory changed to ${newPath}` }]);
  };

  const handleCat = async (filename: string) => {
    if (filename === 'flag.txt' || filename.toLowerCase().includes('flag')) {
      typewriterEffect([
        { type: 'error', content: '[SECURITY_ALERT]: Access denied. Privilege escalation required.' },
        { type: 'error', content: '[SECURITY_ALERT]: Incident logged to security@archive.sys' },
      ]);
      return;
    }

    const file = currentDirContents.find(item => item.name === filename && item.type === 'file');
    if (!file) {
      typewriterEffect([{ type: 'error', content: `[ERROR]: File "${filename}" not found.` }]);
      return;
    }

    if (!file.download_url) {
      typewriterEffect([{ type: 'error', content: '[ERROR]: Unable to retrieve file content.' }]);
      return;
    }

    typewriterEffect([{ type: 'system', content: `[SYSTEM]: Fetching ${filename}...` }]);

    try {
      const response = await fetch(file.download_url);
      const content = await response.text();
      setModalContent({
        title: filename,
        content,
        url: file.download_url,
      });
    } catch (error) {
      typewriterEffect([{ type: 'error', content: `[ERROR]: Failed to fetch file content: ${error}` }]);
    }
  };

  const handleClear = () => {
    setTerminalHistory([]);
  };

  const handleHelp = () => {
    typewriterEffect([
      { type: 'output', content: '═══════════════════════════════════════════════════════' },
      { type: 'output', content: '  FORENSIC TERMINAL - AUTHORIZED COMMANDS' },
      { type: 'output', content: '═══════════════════════════════════════════════════════' },
      { type: 'output', content: '  ls              List files and directories' },
      { type: 'output', content: '  cd <dir>        Change directory' },
      { type: 'output', content: '  cd ..           Move up one directory level' },
      { type: 'output', content: '  cat <file>      Display file contents' },
      { type: 'output', content: '  pwd             Print working directory' },
      { type: 'output', content: '  whoami          Display user information' },
      { type: 'output', content: '  clear           Clear terminal screen' },
      { type: 'output', content: '  help            Display this help message' },
      { type: 'output', content: '═══════════════════════════════════════════════════════' },
      { type: 'output', content: '  TIP: Use TAB for auto-completion, ↑↓ for history' },
      { type: 'output', content: '═══════════════════════════════════════════════════════' },
    ]);
  };

  const handlePwd = () => {
    typewriterEffect([{ type: 'output', content: currentPath }]);
  };

  const handleWhoami = () => {
    typewriterEffect([
      { type: 'output', content: '═══════════════════════════════════════════════════════' },
      { type: 'output', content: '  USER IDENTIFICATION RECORD' },
      { type: 'output', content: '═══════════════════════════════════════════════════════' },
      { type: 'output', content: '  ID:             NAKATA_CHR' },
      { type: 'output', content: '  Full Name:      Nakata Christian' },
      { type: 'output', content: '  Role:           CTF Specialist' },
      { type: 'output', content: '  Clearance:      Level 5 - AUTHORIZED' },
      { type: 'output', content: '  Specialization: Web Exploitation, Forensics, OSINT' },
      { type: 'output', content: '  Status:         ACTIVE' },
      { type: 'output', content: '═══════════════════════════════════════════════════════' },
    ]);
  };

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim();
    setInputValue('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    if (!trimmedCommand) return;

    addToHistory({ type: 'command', content: `analyst@archive:${currentPath}$ ${trimmedCommand}` });
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);

    const [cmd, ...args] = trimmedCommand.split(' ');
    const arg = args.join(' ');

    switch (cmd.toLowerCase()) {
      case 'ls':
        handleLs();
        break;
      case 'cd':
        if (!arg) {
          typewriterEffect([{ type: 'error', content: '[ERROR]: cd requires a directory name.' }]);
        } else {
          handleCd(arg);
        }
        break;
      case 'cat':
        if (!arg) {
          typewriterEffect([{ type: 'error', content: '[ERROR]: cat requires a filename.' }]);
        } else {
          handleCat(arg);
        }
        break;
      case 'clear':
        handleClear();
        break;
      case 'help':
        handleHelp();
        break;
      case 'pwd':
        handlePwd();
        break;
      case 'whoami':
        handleWhoami();
        break;
      default:
        typewriterEffect([
          { type: 'error', content: `[ERROR]: Command not recognized: "${cmd}"` },
          { type: 'error', content: '[ERROR]: Type "help" for authorized commands.' },
        ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isTyping && !isLoading) {
        handleCommand(inputValue);
        setHistoryIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        if (newIndex === commandHistory.length - 1 && historyIndex === commandHistory.length - 1) {
          setHistoryIndex(-1);
          setInputValue('');
        } else {
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = inputValue.split(' ');
      const lastPart = parts[parts.length - 1];

      if (parts[0] === 'cd' || parts[0] === 'cat') {
        const matches = currentDirContents.filter(item => {
          if (parts[0] === 'cd') {
            return item.type === 'dir' && item.name.startsWith(lastPart);
          } else {
            return item.type === 'file' && item.name.startsWith(lastPart);
          }
        });

        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0].name;
          setInputValue(parts.join(' '));
        } else if (matches.length > 1) {
          typewriterEffect([
            { type: 'output', content: `[INFO]: Multiple matches: ${matches.map(m => m.name).join(', ')}` },
          ]);
        }
      }
    }
  };

  const renderTerminalLine = (line: TerminalLine, index: number) => {
    let className = 'font-mono text-sm ';
    let icon = null;

    switch (line.type) {
      case 'command':
        className += 'text-[#00FF41]';
        break;
      case 'output':
        className += 'text-[#E0E0E0]';
        if (line.content.includes('📁')) {
          className += ' text-[#00FF41]';
        }
        break;
      case 'error':
        className += 'text-red-400';
        break;
      case 'system':
        className += 'text-cyan-400';
        break;
    }

    return (
      <div key={index} className={className}>
        {line.content}
      </div>
    );
  };

  return (
    <div id="evidence" className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-8 w-full justify-start">
          <FolderOpen className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold text-[#E0E0E0]">
            [ EVIDENCE LOGS ]
          </h2>
        </div>
        <div ref={terminalRef} className="bg-[#0D0D0D] border-2 border-[#00FF41] rounded-lg shadow-2xl shadow-green-500/20 overflow-hidden">
          <div className="bg-[#1A1A1A] border-b border-[#00FF41] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TerminalIcon className="text-[#00FF41] w-5 h-5" />
              <span className="font-mono text-[#E0E0E0] text-sm">
                Session: <span className="text-[#00FF41]">analyst@remote_archive</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse" />
              <span className="font-mono text-xs text-[#00FF41]">LIVE</span>
            </div>
          </div>

          <div
            ref={outputRef}
            className="h-[500px] overflow-y-auto p-4 space-y-1 custom-scrollbar"
            onClick={() => inputRef.current?.focus()}
          >
            {terminalHistory.map((line, index) => renderTerminalLine(line, index))}

            {isLoading && (
              <div className="font-mono text-sm text-cyan-400 animate-pulse">
                [SYSTEM]: Fetching data from remote archive...
              </div>
            )}

            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-[#00FF41]">analyst@archive:{currentPath}$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping || isLoading}
                className="flex-1 bg-transparent text-[#E0E0E0] outline-none border-none caret-[#00FF41]"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="font-mono text-xs text-gray-500">
            FORENSIC TERMINAL v2.1.4 | Authorized Access Only
          </p>
        </div>
      </div>

      {modalContent && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50" onClick={() => setModalContent(null)}>
          <div
            className="bg-[#0D0D0D] border-2 border-[#00FF41] rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1A1A1A] border-b border-[#00FF41] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="text-[#00FF41] w-5 h-5" />
                <span className="font-mono text-[#E0E0E0] text-sm">{modalContent.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={modalContent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 bg-[#00FF41] text-black font-mono text-xs rounded hover:bg-[#00DD33] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Full Report
                </a>
                <button
                  onClick={() => setModalContent(null)}
                  className="text-[#E0E0E0] hover:text-[#00FF41] font-mono text-sm"
                >
                  [X] CLOSE
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-60px)] custom-scrollbar">
              <pre className="font-mono text-sm text-[#E0E0E0] whitespace-pre-wrap">
                {modalContent.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0D0D0D;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00FF41;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00DD33;
        }
      `}</style>
    </div>
  );
}
