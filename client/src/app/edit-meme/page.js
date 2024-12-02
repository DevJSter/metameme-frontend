"use client";
import EditMeme from "@/modules/editor/edit-meme";
import MemeEditorSkeleton from "@/modules/editor/meme-editor-skeleton";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<MemeEditorSkeleton />}>
      <EditMeme />
    </Suspense>
  );
};

export default Page;
