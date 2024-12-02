"use client";
import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useDebounce } from "use-debounce";
import MemeGallery from "@/components/meme-grid";
import MainPaddingWrapper from "@/components/wrappers/main-padding-wrappers";
import { transformData } from "@/utils/transformData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MemeSkeleton = ({ count = 9 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white border-2 shadow-light rounded-lg h-48 w-full"></div>
          <div className="mt-2 bg-white border-2 shadow-light h-4 w-3/4 mx-auto rounded"></div>
        </div>
      ))}
    </div>
  );
};

const SearchMeme = () => {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";
  const router = useRouter();
  const pathName = usePathname();

  const [inputTxt, setInputTxt] = useState(queryFromUrl);
  const [debouncedInputTxt] = useDebounce(inputTxt, 300);
  const [memeData, setMemeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memeType, setMemeType] = useState("gifs");
  const [nextValue, setNextValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMemes = useCallback(
    async (searchQuery, type, next = "", pageNum) => {
      if (!searchQuery.trim()) return;
      setIsLoading(true);
      setError(null);
      try {
        let endpoint, data;
        if (type === "gifs") {
          endpoint = "/api/search-gif";
          const response = await axios.get(
            `${endpoint}?q=${searchQuery}&next=${next}`
          );
          data = response.data;
        } else {
          endpoint = "/api/search-meme";
          const response = await axios.get(
            `${endpoint}?q=${searchQuery}&page=${pageNum}`
          );
          data = { results: response.data.results };
        }
        const transformedData = await transformData(data, type);
        if (next || pageNum > 1) {
          setMemeData((prevData) => [...prevData, ...transformedData.result]);
        } else {
          setMemeData(transformedData.result);
        }
        setNextValue(transformedData.nextValue);
        setHasMore(
          type === "gifs"
            ? !!transformedData.nextValue
            : transformedData.result.length > 0
        );
      } catch (err) {
        setError(`Failed to fetch ${type}. Please try again later.`);
        error(`Error fetching ${type}:`, err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const searchQuery = debouncedInputTxt || queryFromUrl || "funny";
    fetchMemes(searchQuery, memeType, "", 1);
    setPage(1);
  }, [fetchMemes, debouncedInputTxt, queryFromUrl, memeType, pathName]);

  const handleInputChange = (e) => {
    setInputTxt(e.target.value);
  };

  const handleMemeTypeChange = (value) => {
    setMemeType(value);
    setNextValue("");
    setHasMore(true);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/search?q=${encodeURIComponent(inputTxt)}`;
  };

  const handleLoadMore = () => {
    if (hasMore) {
      if (memeType === "gifs") {
        fetchMemes(
          inputTxt || queryFromUrl || "funny",
          memeType,
          nextValue,
          page
        );
      } else {
        const nextPage = page + 1;
        fetchMemes(inputTxt || queryFromUrl || "funny", memeType, "", nextPage);
        setPage(nextPage);
      }
    }
  };

  return (
    <MainPaddingWrapper>
      <div className="md:max-w-4xl mx-auto">
        <form
          onSubmit={handleSearch}
          className="flex flex-col space-y-4 mb-8 px-4 md:px-8"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search for memes..."
                value={inputTxt}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-black"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
            </div>
            <Select value={memeType} onValueChange={handleMemeTypeChange}>
              <SelectTrigger className="w-[120px] md:w-[180px]">
                <SelectValue placeholder="Meme type" />
              </SelectTrigger>
              <SelectContent className='text-white'>
                <SelectItem value="gifs">GIFs</SelectItem>
                <SelectItem value="pngs">PNGs</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="submit"
              className="hidden md:flex w-full md:w-auto md:self-end text-white"
            >
              Search
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full md:w-auto md:self-end md:hidden text-white"
          >
            Search
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && memeData.length === 0 ? (
          <div className="px-4 md:px-8">
            <MemeSkeleton />
          </div>
        ) : (
          <>
            <MemeGallery data={memeData} type={memeType} />
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button onClick={handleLoadMore} disabled={isLoading} className='text-white'>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Load More
                </Button>
              </div>
            )}
          </>
        )}

        {/* <MemeSkeleton /> */}
      </div>
    </MainPaddingWrapper>
  );
};

export default SearchMeme;
