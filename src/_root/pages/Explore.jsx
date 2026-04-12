import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { Input } from "../../components/ui/input";
import useDebounce from "../../hooks/useDebounce";
import GridPostList from "../../components/shared/GridPostList";
import Loader from "../../components/shared/Loader";
import { useGetPosts, useSearchPosts } from "../../lib/react-query/queryAndMutation";

const SearchResults = ({ isSearchFetching, searchedPosts }) => {
  if (isSearchFetching) {
    return <Loader />;
  }
  if (searchedPosts?.documents?.length > 0) {
    return <GridPostList posts={searchedPosts.documents} showUser={false} showStats={true} />;
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage, isLoading } = useGetPosts();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch);

  useEffect(() => {
    if (inView && !searchValue && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, searchValue, hasNextPage, fetchNextPage]);

  const shouldShowSearchResults = searchValue !== "";

  return (
    <div className="explore-container px-2 md:px-0 pb-20">
      {/* Search Bar */}
      <div className="explore-inner_container sticky top-0 bg-[#09090A] z-50 py-4 border-b border-dark-4">
        <h2 className="h3-bold md:h2-bold mb-4 px-2">Explore</h2>
        
        <div className="flex gap-3 px-4 py-3 w-full rounded-2xl bg-dark-4 items-center">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
            className="text-light-3"
          />
          <Input
            type="text"
            placeholder="Search posts, tags, or people..."
            className="explore-search bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-light-1 placeholder:text-light-4"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* Search Results */}
      {shouldShowSearchResults ? (
        <div className="mt-6">
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        </div>
      ) : (
        <>
          {/* Popular Today Header */}
          <div className="flex-between w-full max-w-5xl mt-8 mb-6 px-2">
            <h3 className="body-bold md:h3-bold text-light-1">Popular Today</h3>
            
            <div className="flex-center gap-3 bg-dark-3 rounded-xl px-5 py-2 cursor-pointer hover:bg-dark-4 transition">
              <p className="small-medium md:base-medium text-light-2">All</p>
              <img
                src="/assets/icons/filter.svg"
                width={20}
                height={20}
                alt="filter"
              />
            </div>
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <Loader />
          ) : (
            <div className="flex flex-wrap gap-2 md:gap-4 w-full max-w-5xl px-1">
              {posts?.pages?.map((item, index) => (
                <GridPostList 
                  key={`page-${index}`} 
                  posts={item.documents} 
                  showUser={false} 
                  showStats={true} 
                />
              ))}
            </div>
          )}

          {/* Infinite Scroll Loader */}
          {hasNextPage && !searchValue && (
            <div ref={ref} className="mt-10 flex justify-center">
              <Loader />
            </div>
          )}

          {!hasNextPage && !searchValue && posts?.pages?.length > 0 && (
            <p className="text-light-4 text-center mt-10">You've reached the end</p>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;