import React from "react";
import Link from "next/link";
import { RssIcon, LinkExternalIcon, MoonIcon } from "@primer/octicons-react";

const Header: React.FC = () => (
  <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
    <nav className="flex items-center justify-between p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:text-slate-50">
          home
        </Link>
        <Link href="/blog">blog</Link>
        <Link href="/about">about</Link>
      </div>
      <div className="flex items-center gap-4">
        <a href="#" className="text-slate-200">
          <RssIcon />
        </a>
        <a href="#" className="text-slate-200">
          <LinkExternalIcon />
        </a>
        <button className="text-slate-200">
          <MoonIcon />
        </button>
      </div>
    </nav>
  </div>
);

export default Header;
