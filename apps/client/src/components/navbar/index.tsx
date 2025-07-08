"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import SecondaryLogo from "/public/secondary-logo.png";
import Avatar from "/public/mock-avatar.jpeg";
import { COOKIES_NAMES } from "~/constants/cookies";
import env from "~/shared/env";
import { usePathname, useRouter } from "next/navigation";
import { getRoutes } from "~/routes";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workout/ui";
import { LOCALE_ITEMS } from "~/i18n/locale";
import { useLocale } from "next-intl";
import { setCookie } from "cookies-next";
import { startTransition, useEffect, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const localActive = useLocale();
  const routes = getRoutes(localActive);
  const navigation = [
    { name: "Home", href: routes.home },
    { name: "Public Workouts", href: routes.publicWorkouts },
    { name: "Exercises", href: routes.exercises },
    { name: "Progress", href: routes.progress },
  ];

  const handleChangeLocale = (nextLocale: string) => {
    setCookie(COOKIES_NAMES.LOCALE, nextLocale);
    startTransition(() => {
      router.replace(pathname.replace(localActive, nextLocale));
    });
  };

  const handleLogout = () => {
    setCookie(COOKIES_NAMES.ACCESS_TOKEN, null, {
      secure: true,
      sameSite: "lax",
      domain: env.appDomain,
    });
    router.push(routes.signIn);
  };

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed w-full z-10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Image
                alt="WorkoutApp"
                src={SecondaryLogo}
                className="h-12 w-auto"
                priority
                width={0}
                height={0}
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const current = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={classNames(
                        current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer"
              >
                <div>
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <Image
                    alt=""
                    src={Avatar}
                    className="h-8 w-8 rounded-full"
                    width={0}
                    height={0}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                <DropdownMenuItem className="focus:bg-gray-300">
                  <Link
                    href={routes.userSettings}
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                </DropdownMenuItem>
                <Select value={localActive} onValueChange={handleChangeLocale}>
                  <SelectTrigger className="flex px-6 py-6 text-gray-700 text-sm bg-white focus:bg-gray-300 hover:bg-gray-300 data-[state=open]:bg-gray-300">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-700">
                    <SelectGroup>
                      {LOCALE_ITEMS.map(({ label, value }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="focus:bg-gray-300 focus:text-gray-700 text-sm"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <DropdownMenuItem className="focus:bg-gray-300">
                  <button
                    className="w-full block px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => {
            const current = pathname === item.href;

            return (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={classNames(
                  current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            );
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
