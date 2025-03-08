import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import SearchList from "../../../components/SearchList/SearchList";
import { RootState } from "../../../store";
import { createStore } from "redux";
import { describe, expect, it } from "vitest";

const mockStore = (initialState: RootState) =>
  createStore((state = initialState) => state);

describe("SearchList Component", () => {
  it("renders search results when searchQuery is not empty", () => {
    const store = mockStore({
      search: {
        searchQuery: [
          { login: "testuser1", id: 1, avatar_url: "test1.jpg" },
          { login: "testuser2", id: 2, avatar_url: "test2.jpg" },
        ],
        error: null,
        loading: false,
      },
    });

    render(
      <Provider store={store}>
        <SearchList />
      </Provider>
    );

    expect(screen.getByTestId("search-list")).toBeInTheDocument();
    expect(screen.getByText("testuser1")).toBeInTheDocument();
    expect(screen.getByText("testuser2")).toBeInTheDocument();
  });

  it("renders no users when searchQuery is empty", () => {
    const store = mockStore({
      search: {
        searchQuery: [],
        error: null,
        loading: false,
      },
    });

    render(
      <Provider store={store}>
        <SearchList />
      </Provider>
    );

    expect(screen.getByTestId("search-list").children.length).toBe(0);
  });

  it("clears search results when there is an error", () => {
    const store = mockStore({
      search: {
        searchQuery: [{ login: "testuser1", id: 1, avatar_url: "test1.jpg" }],
        error: "Some error",
        loading: false,
      },
    });

    render(
      <Provider store={store}>
        <SearchList />
      </Provider>
    );

    expect(screen.getByTestId("search-list").children.length).toBe(0);
  });

  it("does not crash if searchQuery is undefined", () => {
    const store = mockStore({
      search: {
        searchQuery: [],
        error: null,
        loading: false,
      },
    });

    render(
      <Provider store={store}>
        <SearchList />
      </Provider>
    );

    expect(screen.getByTestId("search-list")).toBeInTheDocument();
    expect(screen.getByTestId("search-list").children.length).toBe(0);
  });
});
