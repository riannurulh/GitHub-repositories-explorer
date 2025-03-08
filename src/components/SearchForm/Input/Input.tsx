import { InputProps } from "./Input.types";

const Input = (props: InputProps) => {
  const { query, setQuery } = props;
  return (
    <input
      data-testid="search-input"
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="border p-[16px] w-full border-[#e7e7e7] bg-[#f2f2f2]"
      placeholder="Enter username"
    />
  );
};

export default Input;
