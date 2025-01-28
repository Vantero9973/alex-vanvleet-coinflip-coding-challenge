"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import SearchModal from "./SearchModal";

type NavbarLink = {
  href: string;
  label: string;
};

const links: NavbarLink[] = [
  { href: "/", label: "Instructions" },
  { href: "/rates", label: "Rates" },
];

export default function Navbar(): JSX.Element {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <>
      <SearchModal open={searchModalOpen} setOpen={setSearchModalOpen} />
      <Disclosure as="nav" className="bg-white shadow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex px-2 lg:px-0">
                  <div className="flex shrink-0 items-center">
                    <img
                      alt="Generic"
                      src="/icons/generic.svg"
                      className="h-8 w-auto"
                    />
                  </div>
                  <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex items-center lg:hidden">
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon aria-hidden="true" className="block h-6 w-6" />
                    ) : (
                      <Bars3Icon aria-hidden="true" className="block h-6 w-6" />
                    )}
                  </DisclosureButton>
                </div>
                <div className="hidden lg:ml-4 lg:flex lg:items-center">
                  <button
                    type="button"
                    className="relative shrink-0 rounded-full bg-white p-1 text-zinc-400 hover:text-zinc-500"
                    onClick={() => setSearchModalOpen(!searchModalOpen)}
                  >
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="h-6 w-6"
                    />
                  </button>
                </div>
              </div>
            </div>

            <DisclosurePanel className="lg:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {links.map((link) => (
                  <DisclosureButton
                    key={link.href}
                    as="a"
                    href={link.href}
                    className="block border-l-4 py-2 pl-3 pr-4 text-base font-medium border-transparent text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-800"
                  >
                    {link.label}
                  </DisclosureButton>
                ))}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </>
  );
}
