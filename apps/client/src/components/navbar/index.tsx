"use client";

import { useState } from "react";
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
  Button,
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
import { startTransition } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className="bg-gray-800 fixed w-full z-10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </Button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Image
                alt="WorkoutApp"
                src={SecondaryLogo}
                className="h-12 w-auto"
                priority
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative flex rounded-full bg-gray-800 text-sm cursor-pointer focus:outline-none">
                  <span className="absolute -inset-1.5" />
                  <Image
                    alt="Avatar"
                    src={Avatar}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-48 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <DropdownMenuItem className="hover:bg-gray-100 focus:bg-gray-100">
                  <Link
                    href={routes.userSettings}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                </DropdownMenuItem>
                <Select value={localActive} onValueChange={handleChangeLocale}>
                  <SelectTrigger className="flex w-full px-6 py-5 text-sm text-gray-700 bg-white hover:bg-gray-100">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup className="bg-white text-gray-700">
                      {LOCALE_ITEMS.map(({ label, value }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="text-gray-700 hover:text-gray-700 focus:text-gray-700 hover:bg-gray-100 focus:bg-gray-100hover:bg-gray-100 focus:bg-gray-100"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <DropdownMenuItem className="hover:bg-gray-100 focus:bg-gray-100">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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

      {mobileMenuOpen && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
