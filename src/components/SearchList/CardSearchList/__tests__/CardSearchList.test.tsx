import { render, screen, fireEvent } from "@testing-library/react";
import CardSearchList from "../../../../components/SearchList/CardSearchList/CardSearchList";
import { User } from "../../../../features/search/searchSlice";
import { describe, expect, it } from "vitest";

describe("CardSearchList Component", () => {
  const mockUser: User = {
    login: "testuser",
    id: 1,
    avatar_url: "test.jpg",
    repository: [
      { name: "repo1", id: 101, description: "Test repo", stargazers_count: 10 },
      { name: "repo2", id: 102, description: "", stargazers_count: 5 },
    ],
  };

  it("renders the user's name", () => {
    render(<CardSearchList user={mockUser} />);
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("toggles repository list when button is clicked", () => {
    render(<CardSearchList user={mockUser} />);
    
    const toggleButton = screen.getByTestId("expand-repository-button");
    fireEvent.click(toggleButton);

    expect(screen.getByText("repo1")).toBeInTheDocument();
    expect(screen.getByText("repo2")).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.queryByText("repo1")).not.toBeInTheDocument();
    expect(screen.queryByText("repo2")).not.toBeInTheDocument();
  });

  it("shows 'No repository found' if user has no repositories", () => {
    render(<CardSearchList user={{ ...mockUser, repository: [] }} />);
    
    fireEvent.click(screen.getByTestId("expand-repository-button"));

    expect(screen.getByText("No repository found")).toBeInTheDocument();
  });

  it("handles case where repository description is empty", () => {
    render(<CardSearchList user={mockUser} />);
    
    fireEvent.click(screen.getByTestId("expand-repository-button"));

    expect(screen.getByText("repo1")).toBeInTheDocument();
    expect(screen.getByText("repo2")).toBeInTheDocument();
  });

  it("handles case where repository has zero stars", () => {
    const userWithZeroStars = {
      ...mockUser,
      repository: [{ name: "repo3", id: 103, description: "Test repo 3", stargazers_count: 0 }],
    };

    render(<CardSearchList user={userWithZeroStars} />);
    
    fireEvent.click(screen.getByTestId("expand-repository-button"));

    expect(screen.getByText("repo3")).toBeInTheDocument();
    expect(screen.getByText("Test repo 3")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("does not crash if user object is missing repository field", () => {
    render(<CardSearchList user={{ login: "testuser", id: 1, avatar_url: "test.jpg" } as User} />);
    
    fireEvent.click(screen.getByTestId("expand-repository-button"));

    expect(screen.getByText("No repository found")).toBeInTheDocument();
  });

  it("does not crash if user has an empty repository list", () => {
    render(<CardSearchList user={{ ...mockUser, repository: [] }} />);
    
    fireEvent.click(screen.getByTestId("expand-repository-button"));

    expect(screen.getByText("No repository found")).toBeInTheDocument();
  });
});
