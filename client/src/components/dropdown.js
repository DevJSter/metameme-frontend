import React, { useState, useRef, useEffect } from "react";
import { Dela_Gothic_One } from "next/font/google";
import {
  ChevronDown,
  Mail,
  Instagram,
  Twitter,
  Github,
  ShareIcon,
  Share2Icon,
} from "lucide-react";
import clsx from "clsx";

const delaGothicOne = Dela_Gothic_One({
  subsets: ["latin"],
  weight: ["400"],
});

export const SocialDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const socialLinks = [
    { icon: Mail, label: "Email", href: "mailto:0xswayam@gmail.com" },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://www.instagram.com/MetaMeme",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com/MetaMeme",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    window.open(href, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:text-main hover:font-semibold font-base"
        >
          <Share2Icon
            className={clsx(
              isOpen ? "rotate-180" : "rotate-0",
              "h-5 w-5 transition-transform"
            )}
          />
          <div className="hidden md:flex">
            <p className={delaGothicOne.className}>Contact Us</p>
          </div>
        </button>
      </div>

      <div
        className={clsx(
          isOpen
            ? "visible top-12 opacity-100 right-1"
            : "invisible top-10 right-1 opacity-0",
          "absolute flex w-[170px] flex-col rounded-md border-2 bg-white shadow-light text-lg font-base transition-all"
        )}
      >
        {socialLinks.map(({ icon: Icon, label, href }, index) => (
          <a
            key={label}
            href={href}
            onClick={(e) => handleLinkClick(e, href)}
            className={clsx(
              "text-left hover:bg-black/10 flex items-center px-4 py-3",
              index !== socialLinks.length - 1 && "border-b-2 border-b-black/40"
            )}
          >
            <Icon className="h-6 w-6 mr-[15px]" />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
};
