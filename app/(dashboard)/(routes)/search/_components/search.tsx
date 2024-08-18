import React from "react";
import SearchInput from "@/components/search-input";
import SearchResults from "../page";

type SearchParams = {
  title: string;
  categoryId: string;
};

type Props = {
  searchParams: SearchParams;
};

const Search = ({ searchParams }: Props) => {
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <SearchResults searchParams={searchParams} />
    </>
  );
};

export default Search;
