import { fetchAndSave, printMetadata } from "../src/fetcher";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("Fetcher Tests", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should handle invalid URL", async () => {
    const url = "invalid-url";
    await expect(fetchAndSave(url)).rejects.toThrow("Invalid URL");
  });

  it("should handle network failure", async () => {
    fetchMock.mockReject(new Error("Network Error"));

    const url = "https://example.com";
    await expect(fetchAndSave(url)).rejects.toThrow("Network Error");
  });

  it("should handle empty page content", async () => {
    const emptyPage = "<html><head></head><body></body></html>";
    fetchMock.mockResponseOnce(emptyPage);

    const url = "https://empty.com";
    console.log = jest.fn();
    await printMetadata(url);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("num_links: 0")
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("num_images: 0")
    );
  });

  it("should extract metadata correctly", async () => {
    const htmlContent =
      '<html><head></head><body><a href="#">Link 1</a><a href="#">Link 2</a><img src="image.jpg"></body></html>';
    fetchMock.mockResponseOnce(htmlContent);

    const url = "https://example.com";
    console.log = jest.fn();
    await printMetadata(url);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("num_links: 2")
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("num_images: 1")
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("last_fetch:")
    );
  });
});
