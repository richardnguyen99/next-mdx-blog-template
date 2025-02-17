import React, { type JSX } from "react";
import Image from "next/image";
import { CornerDownLeft, MoveDown, MoveUp } from "lucide-react";

function Kbd(props: { children: React.ReactNode }) {
  return <kbd className="ais-kbd">{props.children}</kbd>;
}

function SearchFooter(): JSX.Element {
  return (
    <div className="ais-footer">
      <div className="ais-logo">
        Powered by 
        <Image src="/vercel.svg" width="24" height="24" alt="Logo" className="ais-logo-image" />
      </div>

      <ul className="ais-commands">
        <li className="ais-command">
            <Kbd><CornerDownLeft /></Kbd>
            to select
        </li>
        <li className="ais-command">
            <Kbd><MoveDown /></Kbd>
            <Kbd><MoveUp /></Kbd>
            to navigate
        </li>
        <li className="ais-command">
            <Kbd>Esc</Kbd>
            to close
        </li>
      </ul>
    </div>
  );
}

export default SearchFooter;
