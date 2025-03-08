import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Button from "../Button";
import searchReducer from "../../../../features/search/searchSlice";
import { describe, expect, test } from "vitest";

const createMockStore = (loading = false) => {
  return configureStore({
    reducer: {
      search: searchReducer,
    },
    preloadedState: {
      search: {
        searchQuery: [],
        loading,
        error: null,
      },
    },
  });
};

describe("Button Component", () => {
  test('renders with "Search" text when not loading', () => {
    const store = createMockStore(false);

    render(
      <Provider store={store}>
        <Button />
      </Provider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Search");
    expect(button).not.toBeDisabled();
  });

  test('renders with "Fetching..." text and is disabled when loading', () => {
    const store = createMockStore(true);

    render(
      <Provider store={store}>
        <Button />
      </Provider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Fetching...");
    expect(button).toBeDisabled();
  });

  test("has the correct CSS classes", () => {
    const store = createMockStore(false);

    render(
      <Provider store={store}>
        <Button />
      </Provider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-[#2d9cdb]");
    expect(button).toHaveClass("hover:bg-blue-400");
    expect(button).toHaveClass("text-[#d0e3ed]");
    expect(button).toHaveClass("font-bold");
    expect(button).toHaveClass("p-[18px]");
    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("mt-4");
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("border-[#79bfe8]");
  });

  test("has submit type", () => {
    const store = createMockStore(false);

    render(
      <Provider store={store}>
        <Button />
      </Provider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });
});
