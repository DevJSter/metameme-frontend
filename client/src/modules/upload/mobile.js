import React from "react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
import { UploadIcon } from "lucide-react";
import CommonContents from "./dialouge-base-contents";

const MobileUploadAlert = () => {
  return (
    <ResponsiveModal>
      <ResponsiveModalTrigger asChild>
        <div className="md:hidden cursor-pointer p-2 bg-main border-2 rounded-full border-border">
          <UploadIcon size={16} />
        </div>
      </ResponsiveModalTrigger>
      <CommonContents />
    </ResponsiveModal>
  );
};

export default MobileUploadAlert;
