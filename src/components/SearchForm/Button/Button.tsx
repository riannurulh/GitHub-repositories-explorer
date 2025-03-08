import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const Button: React.FC = () => {
  const { loading } = useSelector((state: RootState) => state.search);
  return (
    <button
      test-id="mock-button"
      type="submit"
      className={`${loading ? 'bg-gray-300 text-neutral-50 border-neutral-50' : 'bg-[#2d9cdb] text-[#d0e3ed] border-[#79bfe8]'} hover:bg-blue-400 font-bold p-[18px] w-full mt-4 border border-[#79bfe8]`}
      disabled={loading}
    >
      {loading ? "Fetching..." : "Search"}
    </button>
  );
};

export default Button;
