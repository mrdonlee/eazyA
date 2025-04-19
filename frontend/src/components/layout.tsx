import { Outlet } from "react-router-dom"
import { MainNav } from "./main-nav"
import { UserNav } from "./user-nav"
import { ModeToggle } from "./mode-toggle"

export default function Layout() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 border-b bg-background">
                <div className="flex h-16 items-center px-4 md:px-6">
                    <MainNav />
                    <div className="ml-auto flex items-center space-x-4">
                        <ModeToggle />
                        <UserNav />
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}
