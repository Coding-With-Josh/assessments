"use client";

import React, { useState } from "react";
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
  const asciiArt = `   __  ______  ____  __ __ ___         ___    __  ___
  / / / / __ \\/ __ \\/ //_//   |       /   |  /  |/  /
 / / / / / / / / / / ,<  / /| |      / /| | / /|_/ / 
/ /_/ / /_/ / /_/ / /| |/ ___ |     / ___ |/ /  / /  
\\____/_____/\\____/_/ |_/_/  |_|____/_/  |_/_/  /_/   
                             /_____/                 `;
  const [history, setHistory] = useState<string[]>([
    "Welcome to Udoka's Portfolio Terminal!",
    asciiArt,
    "Type 'help' to see all available commands."
  ]);
  const [color, setColor] = useState<string>("#22c55e");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

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
    if (e.key === "Enter" && input.trim()) {
      executeCommand(input.trim());
      setInput("");
      setHistoryIndex(null);
    } else if (e.key === "ArrowUp") {
      if (commandHistory.length === 0) return;
      setHistoryIndex(prev => {
        const newIndex = prev === null ? commandHistory.length - 1 : Math.max(0, prev - 1);
        setInput(commandHistory[newIndex] || "");
        return newIndex;
      });
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (commandHistory.length === 0) return;
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
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen flex flex-col bg-neutral-950 p-0 m-0 overflow-y-auto">
      <div className="font-mono p-1 sm:p-2 flex flex-col relative w-full h-full min-h-0 overflow-y-auto">
        <Image
          src={require("@/assets/images/sir-udoka.jpeg")}
          alt="bg"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none"
          style={{ zIndex: 0 }}
          sizes="100vw"
          priority
        />
        
        <div className="fixed bottom-2 right-2 z-50">
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
            if (i === 1) {
              return (
                <pre
                  key={i}
                  style={{
                    color,
                    fontSize: '0.9em',
                    margin: '8px 0',
                    lineHeight: 1.2,
                    fontFamily: 'monospace',
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
          
          <div className="flex items-center mt-1 gap-1 w-full">
            <span
              className="font-mono text-sm"
              style={{ color }}
            >
              visitor@udoka.dev:~$
            </span>
            <input
              className="bg-transparent px-1 py-1 outline-none flex-1 text-sm"
              style={{ color }}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              maxLength={64}
            />
          </div>
        </div>
      </div>
    </div>
  );
}