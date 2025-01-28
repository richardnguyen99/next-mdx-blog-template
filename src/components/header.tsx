import React from "react";
import Link, { LinkProps } from "next/link";
import { RssIcon, LinkExternalIcon, MoonIcon } from "@primer/octicons-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const IconLink: React.FC<
  React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>
> = ({ href, children, ...rest }) => (
  <a
    href={href}
    className={cn(
      buttonVariants({ variant: "ghost", size: "icon" }),
      "text-slate-200",
      "dark:hover:bg-sky-900"
    )}
    {...rest}
  >
    {children}
  </a>
);

const NavLink: React.FC<React.PropsWithChildren<LinkProps>> = ({
  href,
  children,
}) => (
  <Link
    href={href}
    className={cn(
      buttonVariants({
        variant: "link",
      }),
      "dark:text-sky-50 dark:hover:text-sky-400"
    )}
  >
    {children}
  </Link>
);

const Header: React.FC = () => (
  <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
    <nav className="flex items-center justify-between px-4 py-2 max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        <NavLink href="/">home</NavLink>
        <NavLink href="/blog">blog</NavLink>
        <NavLink href="/about">about</NavLink>
      </div>
      <div className="flex items-center gap-2">
        <IconLink href="#">
          <RssIcon />
        </IconLink>
        <IconLink href="#">
          <LinkExternalIcon />
        </IconLink>
        <button
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "text-slate-200",
            "dark:hover:bg-sky-900"
          )}
        >
          <MoonIcon />
        </button>
      </div>
    </nav>
  </div>
);

export default Header;
