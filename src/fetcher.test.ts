import { fetchAndSave, printMetadata } from '../src/fetcher';
import * as fs from 'fs';
import fetchMock from 'jest-fetch-mock';
import * as path from 'path';

// Mock the file system
jest.mock('fs');
fetchMock.enableMocks();

describe('Fetcher Tests', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should fetch and save valid URL', async () => {
    const htmlContent = '<html><head></head><body><a href="#">Link</a><img src="image.jpg"></body></html>';
    fetchMock.mockResponseOnce(htmlContent);

    const url = 'https://example.com';
    const filePath = path.join(process.cwd(), 'example.com.html');

    await fetchAndSave(url);

    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, htmlContent);
  });

  it('should handle invalid URL', async () => {
    const url = 'invalid-url';
    await expect(fetchAndSave(url)).rejects.toThrow('Invalid URL');
  });

  it('should handle network failure', async () => {
    fetchMock.mockReject(new Error('Network Error'));

    const url = 'https://example.com';
    await expect(fetchAndSave(url)).rejects.toThrow('Network Error');
  });

  it('should handle empty page content', async () => {
    const emptyPage = '<html><head></head><body></body></html>';
    fetchMock.mockResponseOnce(emptyPage);

    const url = 'https://empty.com';
    console.log = jest.fn();
    await printMetadata(url);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('num_links: 0'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('num_images: 0'));
  });

  it('should extract metadata correctly', async () => {
    const htmlContent = '<html><head></head><body><a href="#">Link 1</a><a href="#">Link 2</a><img src="image.jpg"></body></html>';
    fetchMock.mockResponseOnce(htmlContent);

    const url = 'https://example.com';
    console.log = jest.fn();
    await printMetadata(url);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('num_links: 2'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('num_images: 1'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('last_fetch:'));
  });

  it('should handle multiple URLs', async () => {
    const htmlContent1 = '<html><head></head><body><a href="#">Link 1</a></body></html>';
    const htmlContent2 = '<html><head></head><body><img src="image.jpg"></body></html>';

    fetchMock.mockResponses(
      [htmlContent1, { status: 200 }],
      [htmlContent2, { status: 200 }]
    );

    const urls = ['https://site1.com', 'https://site2.com'];
    
    await fetchAndSave(urls[0]);
    await fetchAndSave(urls[1]);

    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringContaining('site1.com.html'), htmlContent1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringContaining('site2.com.html'), htmlContent2);
  });

  it('should handle slow response gracefully', async () => {
    jest.setTimeout(10000); // Setting timeout to handle slow responses
    const htmlContent = '<html><head></head><body><a href="#">Link 1</a></body></html>';
    
    fetchMock.mockResponseOnce(async () => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Mock a 3s delay
      return htmlContent;
    });

    const url = 'https://slow-site.com';
    await fetchAndSave(url);

    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringContaining('slow-site.com.html'), htmlContent);
  });
});
