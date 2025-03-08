import Input from "./Input/Input";
import Button from "./Button/Button";
import { SearchFormProps } from "./SearchForm.types";

const SearchForm = (props: SearchFormProps) => {
  const { handleSearch, query, setQuery } = props;

  return (
    <form data-testid="search-form" onSubmit={handleSearch}>
      <Input query={query} setQuery={setQuery} />
      <Button />
    </form>
  );
};

export default SearchForm;
