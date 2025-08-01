"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggler() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    )
}