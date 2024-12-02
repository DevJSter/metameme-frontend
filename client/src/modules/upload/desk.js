import React from "react";
import {
  ResponsiveModal,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import CommonContents from "./dialouge-base-contents";

const DesktopUploadAlert = () => {
  return (
    <ResponsiveModal>
      <ResponsiveModalTrigger asChild>
        <Button
          variant="noShadow"
          className="rounded-full px-8 hover:bg-main/75 flex items-center gap-2"
        >
          <UploadIcon size={20} />
          Upload
        </Button>
      </ResponsiveModalTrigger>
      <CommonContents />
    </ResponsiveModal>
  );
};

export default DesktopUploadAlert;
