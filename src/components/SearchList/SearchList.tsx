import { useSelector } from "react-redux";
import { RootState } from "../../store";
import CardSearchList from "./CardSearchList/CardSearchList";
import { useEffect, useState } from "react";
import { User } from "../../features/search/searchSlice";

const SearchList: React.FC = () => {
  const { searchQuery, error } = useSelector(
    (state: RootState) => state.search
  );
  const [searchResult, setSearchResult] = useState<User[]>([]);

  useEffect(() => {
    if (error) {
      setSearchResult([]);
      return;
    }
    setSearchResult(searchQuery);
  }, [searchQuery, error]);
  return (
    <div data-testid="search-list" className="w-full mt-4">
      {searchResult.map((user) => (
        <CardSearchList key={user.id} user={user} />
      ))}
    </div>
  );
};

export default SearchList;
