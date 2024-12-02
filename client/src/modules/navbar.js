"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import MainPaddingWrapper from "@/components/wrappers/main-padding-wrappers";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import BrandLogo from "@/components/logo";
import MobileUploadAlert from "./upload/mobile";
import DesktopUploadAlert from "./upload/desk";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { Mail, Instagram, Twitter } from "lucide-react";
import { SocialDropdown } from "@/components/dropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const socialLinks = [
    { icon: Mail, href: "mailto:0xswayam@gmail.com", label: "Email" },
    {
      icon: Instagram,
      href: "https://www.instagram.com/subtle._.one",
      label: "Instagram",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/0xAbhii",
      label: "X (Twitter)",
    },
  ];

  return (
    <MainPaddingWrapper>
      <div className="w-full flex items-center justify-between">
        {/* <div className="border-black border-2 rounded-full p-1 hover:bg-white cursor-pointer">
          <Home size={20} />
        </div> */}
        <BrandLogo />
        <div className="flex gap-8 items-center">
          <div className="hidden md:flex gap-4">
            {/* <Button
              variant="outline"
              className="rounded-full px-8 border-2 border-black hover:bg-white"
            >
              Login
            </Button>
            <Button
              variant="noShadow"
              className="rounded-full px-8 hover:bg-main/75"
            >
              Sign Up
            </Button> */}
            {/* <DesktopUploadAlert /> */}
          </div>
          {/* <MobileUploadAlert /> */}

          {/* <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              <Image
                src="/icons/hamburger-menu.svg"
                width={25}
                height={25}
                alt="menu button"
                className="cursor-pointer md:hidden"
              />
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Button
                  variant="outline"
                  className="rounded-full px-8 border-2 border-black hover:bg-white w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Button>
                <Button
                  variant="noShadow"
                  className="rounded-full px-8 hover:bg-main/75 w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Button>
              </div>
            </SheetContent>
          </Sheet> */}

          <SocialDropdown />
        </div>
      </div>
    </MainPaddingWrapper>
  );
};

export default Navbar;
