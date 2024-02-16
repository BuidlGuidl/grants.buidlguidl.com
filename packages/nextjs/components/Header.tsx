import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RainbowKitCustomConnectButton } from "./scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="navbar items-start bg-base-200 px-5 py-4">
      <div className="navbar-start">
        <Link href="/" passHref className="flex items-center">
          <div className="flex relative w-[130px] md:w-[150px] h-[36px]">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
        </Link>
      </div>
      <div className="navbar-end flex-grow z-10">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
