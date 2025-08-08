"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import commandsData from "./commands.json";

type Command = {
  name: string;
  description: string;
  type: string;
};

const COMMANDS: Command[] = commandsData;

function getCommandOutput(
  cmd: string,
  setColor: (color: string) => void,
  clearHistory: () => void,
  restart: () => void,
  quit: () => void,
  toggleTheme: () => void
): string {
  const [name, ...args] = cmd.trim().split(" ").map(s => s.toLowerCase());
  const commandName = name;
  switch (commandName) {
    case "help":
      return [
        "Available commands:",
        ...COMMANDS.map((cmd: Command) => `- ${cmd.name}: ${cmd.description}`)
      ].join("\n");
    case "whoami":
      return `I'm Udoka, a Software Engineer!`;
    case "projects":
      return "- Portfolio Terminal\n- E-commerce App\n- Blog Platform";
    case "experience":  
      return "3+ years in web development, React, Next.js, Node.js, and more.";
    case "color":
      if (!args[0]) return "Usage: color [any CSS color]";
      setColor(args[0]);
      return `Changed color to ${args[0]}`;
    case "clear":
    case "cls":
      clearHistory();
      return "";
    case "restart":
      restart();
      return "Session restarted.";
    case "quit":
      quit();
      return "Exiting...";
    case "about":
      return "This is a portfolio terminal for Udoka. Type 'help' to see what you can do!";
    case "contact":
      return "Email: udoka@example.com\nPhone: +1234567890";
    case "social":
      return "Twitter: @udoka\nGitHub: github.com/udoka";
    case "skills":
      return "JavaScript, TypeScript, React, Next.js, Node.js, CSS, HTML, UI/UX";
    case "theme":
      toggleTheme();
      return "Theme toggled.";
    default:
      return `Command not found: ${cmd}`;
  }
}

export function Terminal() {
  const { theme, setTheme } = useTheme();
  const [input, setInput] = useState("");
const asciiArt = `
██╗   ██╗██████╗  ██████╗ ██╗  ██╗ █████╗      █████╗ ███╗   ███╗
██║   ██║██╔══██╗██╔═══██╗██║ ██╔╝██╔══██╗    ██╔══██╗████╗ ████║
██║   ██║██║  ██║██║   ██║█████╔╝ ███████║    ███████║██╔████╔██║
██║   ██║██║  ██║██║   ██║██╔═██╗ ██╔══██║    ██╔══██║██║╚██╔╝██║
╚██████╔╝██████╔╝╚██████╔╝██║  ██╗██║  ██║    ██║  ██║██║ ╚═╝ ██║
 ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝     ╚═╝
`;


  const [history, setHistory] = useState<string[]>([
    "Welcome to Udoka's Portfolio Terminal!",
    asciiArt,
    "Type 'help' to see all available commands."
  ]);
  const [color, setColor] = useState<string>("#22c55e");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<Command[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update suggestions when input changes
  useEffect(() => {
    if (input.trim().length > 0) {
      const filtered = COMMANDS.filter(cmd => 
        cmd.name.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
    }
  }, [input]);

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearHistory = () => setHistory([]);
  const restart = () => {
    setHistory([
      "Welcome to Udoka's Portfolio Terminal!",
      asciiArt,
      "Type 'help' to see all available commands."
    ]);
    setInput("");
    setColor("#22c55e");
  };
  const quit = () => {
    setHistory(["Goodbye! You can close the tab or refresh to start again."]);
    setInput("");
  };
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const executeCommand = (cmd: string) => {
    const output = getCommandOutput(cmd, setColor, clearHistory, restart, quit, toggleTheme);
    if (cmd === "clear" || cmd === "cls") {
      setInput("");
      setHistoryIndex(null);
      return;
    }
    setHistory(prev => [
      ...prev,
      `visitor@udoka.dev:~$ ${cmd}`,
      ...(output ? [output] : [])
    ]);
    setCommandHistory(prev => (cmd.trim() ? [...prev, cmd] : prev));
    setHistoryIndex(null);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setHistoryIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (showSuggestions && suggestions.length > 0) {
        e.preventDefault();
        setInput(suggestions[selectedSuggestionIndex].name + " ");
        setShowSuggestions(false);
      } else if (input.trim()) {
        executeCommand(input.trim());
        setInput("");
        setHistoryIndex(null);
      }
    } else if (e.key === "ArrowUp") {
      if (showSuggestions) {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => Math.max(0, prev - 1));
      } else if (commandHistory.length > 0) {
        setHistoryIndex(prev => {
          const newIndex = prev === null ? commandHistory.length - 1 : Math.max(0, prev - 1);
          setInput(commandHistory[newIndex] || "");
          return newIndex;
        });
        e.preventDefault();
      }
    } else if (e.key === "ArrowDown") {
      if (showSuggestions) {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => Math.min(suggestions.length - 1, prev + 1));
      } else if (commandHistory.length > 0) {
        setHistoryIndex(prev => {
          if (prev === null) return null;
          const newIndex = prev + 1;
          if (newIndex >= commandHistory.length) {
            setInput("");
            return null;
          } else {
            setInput(commandHistory[newIndex] || "");
            return newIndex;
          }
        });
        e.preventDefault();
      }
    } else if (e.key === "Tab" && showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      setInput(suggestions[selectedSuggestionIndex].name + " ");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (cmd: string) => {
    setInput(cmd + " ");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

   return (
    <div className="h-full w-full flex flex-col bg-neutral-950 overflow-y-auto">
      <div className="font-mono p-1 sm:p-2 flex flex-col relative w-full h-full min-h-0 overflow-y-auto">
        {/* Help button positioned relative to terminal */}
        <div className="absolute bottom-2 right-2 z-50">
          <button
            onClick={() => executeCommand('help')}
            className="rounded px-3 py-2 font-mono text-sm"
            style={{
              background: color,
              color: '#fff',
              opacity: 0.9,
              cursor: 'pointer',
              border: 'none',
            }}
            title="Show available commands"
          >
            Help
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto pr-0 sm:pr-1 relative w-full min-h-0">
{history.map((line, i) => {
  if (i === 1) {  // This is where your asciiArt is rendered
    return (
      <pre
        key={i}
        style={{
          color,
          fontSize: '0.6em',  // Smaller font for better ASCII art display
          margin: '8px 0',
          lineHeight: 1.1,     // Tighter line spacing
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}
        className="whitespace-pre"
      >
        {line}
      </pre>
    );
  }
            if (typeof line === 'string' && /^Command not found: .+/.test(line.trim())) {
              return (
                <div
                  key={i}
                  style={{
                    color: '#ef4444',
                    whiteSpace: "pre-line",
                    margin: '2px 0',
                    fontSize: '0.9em',
                  }}
                >
                  {line}
                </div>
              );
            }
            return (
              <div
                key={i}
                style={{
                  color,
                  whiteSpace: "pre-line",
                  margin: '2px 0',
                  fontSize: '0.9em',
                }}
              >
                {line}
              </div>
            );
          })}
          
          <div className="flex items-center mt-1 gap-1 w-full relative">
            <span
              className="font-mono text-sm"
              style={{ color }}
            >
              visitor@udoka.dev:~$
            </span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                className="bg-transparent px-1 py-1 outline-none flex-1 text-sm w-full"
                style={{ color }}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                autoFocus
                spellCheck={false}
                maxLength={64}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute bottom-full left-0 w-fit max-h-60 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-md shadow-lg z-50"
                >
                  {suggestions.map((cmd, index) => (
                    <div
                      key={cmd.name}
                      className={`px-3 py-2 cursor-pointer flex items-center ${index === selectedSuggestionIndex ? 'bg-neutral-700' : ''}`}
                      onClick={() => handleSuggestionClick(cmd.name)}
                    >
                      <span className="text-green-400 mr-2">{cmd.name}</span>
                      <span className="text-neutral-400 text-xs">{cmd.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}