import { http } from 'msw';
import { beforeAll, afterEach, afterAll, describe, it, expect } from "vitest";
import PostCreate from "../PostRequest";
import { setupServer } from "msw/node";

export const server = setupServer(
    http.get("https://api.github.com/some-endpoint", () => {
      return Response.json({ message: "Success" });
    })
  );
  
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

describe("PostCreate API Calls", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("fetches data successfully", async () => {
    server.use(
      http.get("https://api.github.com/some-endpoint", () => {
        return Response.json({ data: "Hello World" });
      })
    );

    const response = await PostCreate.get("/some-endpoint");
    expect(response.data).toEqual({ data: "Hello World" });
  });

  it("handles API error", async () => {
    server.use(
      http.get("https://api.github.com/some-endpoint", () => {
        return new Response(null, { status: 500 });
      })
    );

    await expect(PostCreate.get("/some-endpoint")).rejects.toThrow();
  });
});