/*
a navbar precisa de ter:
  - estilo moderno
  - logo -> Kira
  - store -> (pagina de display dos produtos)
  - apps -> outras applicacoes desenolvidas 
  - about
  - acount -> DropDown (account settings, logout)
  - Mobile responsive
*/
"use client";
import Link from "next/link";

import { Menu, LogOut, UserRound } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-50"
        >
          Kira
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-6">
          <Button
            variant="ghost"
            className="h-9 px-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5"
          >
            Store
          </Button>
          <Button
            variant="ghost"
            className="h-9 px-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5"
          >
            Apps
          </Button>
          <Button
            variant="ghost"
            className="h-9 px-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5"
          >
            About
          </Button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-neutral-700"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-40 bg-neutral-900 border-neutral-700"
              >
                <DropdownMenuItem>Store</DropdownMenuItem>
                <DropdownMenuItem>Apps</DropdownMenuItem>
                <DropdownMenuItem>About</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Account dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <UserRound className="h-4 w-4" />
                Account
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-neutral-900 border-neutral-700"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
