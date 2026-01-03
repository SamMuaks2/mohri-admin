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
  return (
    <aside className="w-64 bg-black border-r border-gold hidden md:block">
      <div className="p-6 font-bold text-xl text-white">
        Admin<span className="text-gold">.</span>
      </div>
      <nav className="space-y-2 px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-4 py-2 rounded text-silver hover:bg-gold hover:text-black transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}