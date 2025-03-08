import React, { useEffect, useRef } from "react";
import SearchForm from "../components/SearchForm/SearchForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchQuery } from "../features/search/searchSlice";
import { AppDispatch, RootState } from "../store";
import SearchList from "../components/SearchList/SearchList";

const Home: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [lastQuery, setLastQuery] = React.useState("");
  const { searchQuery, error } = useSelector(
    (state: RootState) => state.search
  );
  const dispatch = useDispatch<AppDispatch>();

const queryRef = useRef("")

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitting");
    
    if (query.trim() !== "") {
      queryRef.current = query;
      dispatch(fetchSearchQuery(query));    
    }
  };

  useEffect(() => {

    if (searchQuery.length > 0) {
      setLastQuery(queryRef.current);
      setQuery("");
    }

    if (error) {
        setQuery("");
    }
  }, [searchQuery, error]);

  return (
    <>
      <SearchForm
        handleSearch={handleSearch}
        query={query}
        setQuery={setQuery}
      />
      {String(error) === "No user found" ? (
        <p className="text-red-500 text-center mt-4 text-sm md:text-base lg:text-lg">
          {String(error)}
        </p>
      ) : error ? (
        <p className="text-red-500 text-center mt-4 text-sm md:text-base lg:text-lg">
          Error: {String(error)}
        </p>
      ) : searchQuery.length ? (
        <p className="text-center mt-4 flex text-sm md:text-base lg:text-lg">
          Showing users for "{lastQuery}"
        </p>
      ) : (
        ""
      )}
      <SearchList />
    </>
  );
};

export default Home;
