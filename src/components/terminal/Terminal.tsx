
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
  username: string,
  setColor: (color: string) => void,
  clearHistory: () => void,
  restart: () => void,
  quit: () => void,
  toggleTheme: () => void
): string {
  const [name, ...args] = cmd.split(" ");
  const commandName = name.toLowerCase();
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
  const [username, setUsername] = useState("");
  const [modalInput, setModalInput] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [input, setInput] = useState("");
  const asciiArt = `
        
   __  ______  ____  __ __ ___         ___    __  ___
  / / / / __ \/ __ \/ //_//   |       /   |  /  |/  /
 / / / / / / / / / / ,<  / /| |      / /| | / /|_/ / 
/ /_/ / /_/ / /_/ / /| |/ ___ |     / ___ |/ /  / /  
\____/_____/\____/_/ |_/_/  |_|____/_/  |_/_/  /_/   
                             /_____/                 

    `;
  const [history, setHistory] = useState<string[]>([
    "Welcome to Udoka's Portfolio Terminal!",
    asciiArt,
    "Type 'help' to see all available commands."
  ]);
  const [color, setColor] = useState<string>("#22c55e");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const clearHistory = () => setHistory([
    // "Welcome to Udoka's Portfolio Terminal!",
    // asciiArt,
    // "Type 'help' to see all available commands."
  ]);
  const restart = () => {
    setUsername("");
    setHistory([
      // "Welcome to Udoka's Portfolio Terminal!",
      // asciiArt,
      // "Type 'help' to see all available commands."
    ]);
    setInput("");
    setColor("#22c55e");
    setShowModal(true);
    setModalInput("");
  };
  const quit = () => {
    setHistory(["Goodbye! You can close the tab or refresh to start again."]);
    setInput("");
  };
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const executeCommand = (cmd: string) => {
    const output = getCommandOutput(cmd, username, setColor, clearHistory, restart, quit, toggleTheme);
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

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalInput.trim()) {
      setUsername(modalInput.trim());
      setShowModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen flex flex-col bg-gradient-to-br from-neutral-950 to-neutral-900 p-0 m-0 overflow-y-auto">
      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <form onSubmit={handleModalSubmit} className="bg-neutral-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-4 min-w-[320px] max-w-xs w-full border border-neutral-700">
            <h2 className="text-2xl font-extrabold text-green-400 mb-1 text-center">Welcome to Udoka's Terminal</h2>
            <p className="text-base text-white/80 text-center">This interactive terminal lets you explore Udoka's portfolio in a fun, chat-like way.<br/>No coding experience needed!</p>
            <input
              className="p-3 rounded bg-neutral-800 text-white outline-none border border-neutral-700 focus:border-green-400/10 text-lg text-center"
              value={modalInput}
              onChange={e => setModalInput(e.target.value)}
              placeholder="Enter a nickname to begin..."
              autoFocus
              maxLength={24}
              required
            />
            <button
              type="submit"
              className="font-bold py-2 px-4 rounded transition text-lg border"
              style={{
                borderColor: color,
                background: color,
                color: '#fff',
                boxShadow: `0 0 0 1.5px ${color}33`
              }}
            >
              Start Exploring
            </button>
            <div className="text-xs text-white/40 text-center mt-2">No data is collected. This is just for fun!</div>
          </form>
        </div>
      )}
      {!showModal && (
        <div
          className="rounded-2xl font-mono p-2 sm:p-4 flex flex-col transition-all duration-300 relative w-full h-full min-h-0 overflow-y-auto"
          style={{
            height: '100dvh',
            maxHeight: '100dvh',
            minHeight: 0,
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          <Image
            src={require("@/assets/images/sir-udoka.jpeg")}
            alt="bg"
            className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none rounded-2xl"
            style={{ zIndex: 0 }}
            sizes="100vw"
            priority
          />
          <div>
            <div className="flex flex-col sm:block w-full">
              <div className="block sm:hidden w-full mb-2">
                <div
                  className="mb-2 text-center text-base font-semibold select-none px-2"
                  style={{ color }}
                >
                  Type a command below or click <span className='underline'>Help</span> for options!
                </div>
                <button
                  onClick={() => executeCommand('help')}
                  className="font-bold py-2 w-full rounded shadow text-base border focus:outline-none"
                  style={{
                    borderColor: color,
                    background: color,
                    color: '#fff',
                    boxShadow: `0 0 0 1.5px ${color}33`
                  }}
                  title="Show available commands"
                >
                  Help
                </button>
              </div>
              <div className="hidden sm:block absolute top-4 right-4 z-20"> 
                <button
                  onClick={() => executeCommand('help')}
                  className="font-bold py-1 px-4 rounded shadow text-base border focus:outline-none"
                  style={{
                    borderColor: color,
                    background: color,
                    color: '#fff',
                    boxShadow: `0 0 0 1.5px ${color}33`
                  }}
                  title="Show available commands"
                >
                  Help
                </button>
              </div>
            </div>
          </div>
          <div
            className="flex-1 flex flex-col overflow-y-auto custom-scrollbar pr-0 sm:pr-2 relative w-full min-h-0"
            style={{
              zIndex: 1,
              maxHeight: '100dvh',
              minHeight: 0,
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            <div
              className="hidden sm:block mb-2 sm:mb-4 mt-2 text-center text-base sm:text-lg font-semibold select-none px-2"
              style={{ color }}
            >
              Type a command below or click <span className='underline'>Help</span> for options!
            </div>
            {history.map((line, i) => {
              if (i === 1) {
                return (
                  <pre
                    key={i}
                    style={{
                      color,
                      fontSize: '1.05em',
                      margin: '40px 0 40px 0',
                      lineHeight: 1.35,
                      overflowX: 'auto',
                      whiteSpace: 'pre',
                      letterSpacing: '0.04em',
                      padding: '16px 0',
                      fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      background: 'transparent',
                    }}
                    className="block font-mono select-none"
                  >
                    {line}
                  </pre>
                );
              }
              // If this is a 'Command not found' output, render in red (exact match)
              if (
                typeof line === 'string' &&
                /^Command not found: .+/.test(line.trim())
              ) {
                return (
                  <div
                    key={i}
                    style={{
                      color: '#ef4444',
                      whiteSpace: "pre-line",
                      marginBottom: i === 0 ? 20 : (i === 2 ? 24 : 0),
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
                    marginBottom: i === 0 ? 20 : (i === 2 ? 24 : 0),
                  }}
                >
                  {line}
                </div>
              );
            })}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center mt-4 sm:mt-6 mb-2 sm:mb-4 gap-2 w-full"
              style={{ zIndex: 2 }}
            >
              <span
                className="font-bold text-base sm:text-lg mb-1 sm:mb-0 sm:mr-2"
                style={{ color, minWidth: 0 }}
              >
                {`visitor@udoka.dev:~$`}
              </span>
              <input
                className="bg-neutral-800/80 rounded px-2 sm:px-3 py-2 outline-none flex-1 placeholder:text-neutral-400 text-base sm:text-lg border transition min-w-0 mb-2 sm:mb-0"
                style={{ color, borderColor: color, boxShadow: `0 0 0 1.5px ${color}33` }}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder={"Try: help, about, projects, contact, color red..."}
                aria-label="Type a command and press Enter"
                maxLength={64}
              />
              <button
                onClick={() => executeCommand(input.trim() || 'help')}
                className="font-bold px-3 sm:px-4 py-2 rounded transition text-base border"
                style={{
                  borderColor: color,
                  background: color,
                  color: '#fff',
                  boxShadow: `0 0 0 1.5px ${color}33`
                }}
                tabIndex={-1}
                type="button"
                aria-label="Run command"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
