import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RainbowKitCustomConnectButton } from "./scaffold-eth";
import { LockClosedIcon } from "@heroicons/react/24/outline";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  // ToDo. Show only on admins
  {
    label: "Admin",
    href: "/admin",
    icon: <LockClosedIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "underline" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="navbar items-start bg-base-200 px-5 py-4">
      <div className="navbar-start gap-10">
        <Link href="/" passHref className="flex items-center">
          <div className="flex relative w-[130px] md:w-[150px] h-[36px]">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>

      <div className="navbar-end flex-grow z-10">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
