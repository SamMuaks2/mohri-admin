"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/articles", label: "Articles" },
  { href: "/experience", label: "Experience" },
  { href: "/certifications", label: "Certifications" },
  { href: "/messages", label: "Messages" },
  { href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-black border-b border-gold px-4 py-3">
        <div className="text-white font-bold text-lg">
          Mohri Admin<span className="text-gold">.</span>
        </div>
        <button onClick={() => setOpen(true)}>
          {/* Hamburger icon */}
          <svg
            className="w-7 h-7 text-gold"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-full w-64 bg-black border-r border-gold
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gold">
          <div className="font-bold text-xl text-white">
            Admin<span className="text-gold">.</span>
          </div>

          <button className="md:hidden" onClick={() => setOpen(false)}>
            {/* Close icon */}
            <svg
              className="w-6 h-6 text-gold"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-2 px-4 mt-4">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 rounded text-silver hover:bg-gold hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
