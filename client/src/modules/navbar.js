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
import { Mail, Instagram, Twitter, Wallet, Copy, Check } from "lucide-react";
import { SocialDropdown } from "@/components/dropdown";
import { useWalletState } from "@/wallet-provider/aptos-wallet-provider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { connected, accountAddress } = useWalletState();

  const socialLinks = [
    { icon: Mail, href: "mailto:0xswayam@gmail.com", label: "Email" },
    {
      icon: Instagram,
      href: "https://www.instagram.com/MetaMeme",
      label: "Instagram",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/MetaMeme",
      label: "X (Twitter)",
    },
  ];

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    if (!accountAddress) return;
    try {
      await navigator.clipboard.writeText(accountAddress);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  return (
    <MainPaddingWrapper>
      <div className="w-full flex items-center justify-between">
        <BrandLogo />
        <div className="flex gap-8 items-center">
          <div className="hidden md:flex gap-4">
            {/* Desktop view controls if needed */}
          </div>

          <div className="flex items-center gap-4">
            <SocialDropdown />
            {connected && accountAddress && (
              <button 
                onClick={copyToClipboard}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
                  "bg-black/5 hover:bg-black/10",
                  "text-sm font-medium"
                )}
              >
                <Wallet className="h-4 w-4" />
                <span>{formatAddress(accountAddress)}</span>
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </MainPaddingWrapper>
  );
};

export default Navbar;