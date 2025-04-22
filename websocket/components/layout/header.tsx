import { ModeToggle } from "../theme/theme-mode-toggle";

export function Header() {
    return (
        <header className="flex items-center justify-between px-4 py-2 border-b border-accent">
            <p className="font-extrabold text-xl">NextJS template</p>
            <div className="flex-1"></div>
            <ModeToggle />
        </header>
    )
}