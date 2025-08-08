import { Terminal } from "@/components/terminal/Terminal";
import { PerosonDetails } from "@/components/persondetails";

export default function Home() {
  const person = {
    name: "Udoka",
    title: "Software Engineer",
    image: "/../assets/images/sir-udoka.jpeg",
    bio: "Passionate developer with 3+ years of experience building web applications. Specialized in React, Next.js, and Node.js.",
    skills: [
      "JavaScript/TypeScript",
      "React/Next.js",
      "Node.js",
      "UI/UX Design",
      "Cloud Infrastructure"
    ],
    socialLinks: {
      twitter: "https://twitter.com/udoka",
      github: "https://github.com/udoka", 
      linkedin: "https://linkedin.com/in/udoka",
      email: "udoka@example.com"
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-background overflow-hidden gap-0 md:gap-4 p-2 md:p-4">
      {/* Left Side - Person Profile */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-neutral-800 overflow-y-auto min-h-[300px] max-h-[50vh] md:max-h-screen flex-shrink-0 p-2 md:p-0">
        <PerosonDetails person={person} />
      </div>

      {/* Right Side - Terminal */}
      <div className="w-full md:w-2/3 lg:w-3/4 flex-1 min-h-[300px] max-h-screen overflow-y-auto">
        <Terminal />
      </div>
    </div>
  );
}