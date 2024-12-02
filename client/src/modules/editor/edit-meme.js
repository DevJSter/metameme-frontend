import GifTextEditor from "@/modules/editor/GifTextEditor";
import { useSearchParams } from "next/navigation";
import React from "react";
import ImageTextOverlay from "./PNGEditor";

const EditMeme = () => {
  const searchParams = useSearchParams();
  const uri = searchParams.get("uri");
  const type = searchParams.get("type");
  console.log(uri);

  return (
    <div>
      {type === "gifs" ? (
        <>
          {/* <GifTextEditor
            gifUri={
              uri
                ? uri
                : "https://media.tenor.com/hmDMrE1yMAkAAAAC/when-the-coding-when-the.gif"
            }
          /> */}
          <GifTextEditor
            gifURI={uri}
            // gifUri={
            //   "https://media.tenor.com/hmDMrE1yMAkAAAAC/when-the-coding-when-the.gif"
            // }
          />
        </>
      ) : (
        <>
          <ImageTextOverlay
            imgURI={
              uri
                ? uri
                : "https://media.tenor.com/hmDMrE1yMAkAAAAC/when-the-coding-when-the.gif"
            }
          />
        </>
      )}
    </div>
  );
};

export default EditMeme;
