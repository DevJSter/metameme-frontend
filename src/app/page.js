"use client";
import React, { useEffect, useState, useCallback } from "react";
import Hero from "@/components/hero";
import MainPaddingWrapper from "@/components/wrappers/main-padding-wrappers";
import { useRouter } from "next/navigation";
const Page = () => {
  const [inputTxt, setInputTxt] = useState("");
  const router = useRouter();

  const handleInputChange = (newValue) => {
    setInputTxt(newValue);
  };

  return (
    <MainPaddingWrapper>
      <Hero
        handleSubmit={(e) => {
          e.preventDefault();
          router.push(`/search?q=${inputTxt}`);
        }}
        inputTxt={inputTxt}
        setInputTxt={handleInputChange}
      />
    </MainPaddingWrapper>
  );
};

export default Page;
