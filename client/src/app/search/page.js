"use client";
import SearchMeme, { MemeSkeleton } from "@/modules/search";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<MemeSkeleton />}>
      <SearchMeme />
    </Suspense>
  );
};

export default Page;
