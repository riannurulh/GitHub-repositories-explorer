export interface SearchFormProps {
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  query: string;
  setQuery: (query: string) => void;
}
