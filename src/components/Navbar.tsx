"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";

export default function Navbar({ toggleTheme, dark }) {
  const [state, setState] = React.useState(false);

  const menus = [
    { title: "Pricing", path: "/pricing" },
    { title: "Testimonials", path: "/testimonials" },
  ];

  return (
    <nav className="bg-white w-full border-b md:border-0 dark:bg-black z-10">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              125
            </h1>
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setState(!state)}
            >
              <Menu />
            </button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0 mr-6">
            {menus.map((item, idx) => (
              <li
                key={idx}
                className="text-gray-600 hover:text-black dark:hover:text-slate-200"
              >
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
            <button
              type="button"
              data-theme-toggle
              aria-label="Change to light theme"
              className="dark:block"
              onClick={toggleTheme}
            >
              {dark ? <Sun /> : <Moon color="black" />}
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
}
