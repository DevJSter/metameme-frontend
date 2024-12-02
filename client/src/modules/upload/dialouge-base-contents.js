import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === " " && inputValue.trim()) {
      e.preventDefault();
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap items-center w-full rounded-base border-2 text-text dark:text-darkText font-base selection:bg-main selection:text-black border-border dark:border-darkBorder bg-white dark:bg-darkBg px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="bg-[#FFF5D1] text-[#8B7D2B] text-sm font-medium mr-2 mb-2 px-2.5 py-1 rounded-full flex items-center"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-1 text-[#8B7D2B] hover:text-[#5F5415]"
          >
            &times;
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="flex-grow outline-none bg-transparent"
        placeholder={tags.length === 0 ? "Type tags and press space" : ""}
      />
    </div>
  );
};

const CommonContents = () => {
  const [memeTitle, setMemeTitle] = useState("");
  const [memeFile, setMemeFile] = useState(null);
  const [tags, setTags] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Meme Title:", memeTitle);
    console.log("Meme File:", memeFile);
    console.log("Tags:", tags);
    setMemeTitle("");
    setMemeFile(null);
    setTags([]);
  };

  return (
    <ResponsiveModalContent>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Upload Meme</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Share your favorite meme with the community!
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2 mt-4"
          >
            <Label htmlFor="meme-title">Meme Title</Label>
            <Input
              id="meme-title"
              value={memeTitle}
              onChange={(e) => setMemeTitle(e.target.value)}
              placeholder="Enter a catchy title for your meme"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="meme-file">Upload Meme Image</Label>
            <Input
              id="meme-file"
              type="file"
              onChange={(e) => setMemeFile(e.target.files[0])}
              accept="image/*"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label htmlFor="meme-tags">Tags</Label>
            <TagInput tags={tags} setTags={setTags} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full bg-[#FFDC58] hover:bg-[#FFD329] text-black"
            >
              Upload Meme
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </ResponsiveModalContent>
  );
};

export default CommonContents;
