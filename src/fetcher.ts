import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

export async function fetchAndSave(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const html = await response.text();
  const domain = new URL(url).hostname;
  const filePath = path.join(process.cwd(), `${domain}.html`);

  fs.writeFileSync(filePath, html);
  console.log(`Saved ${url} to ${filePath}`);
}

export async function printMetadata(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window._document;

  const links = document.querySelectorAll('a').length;
  const images = document.querySelectorAll('img').length;
  const lastFetch = new Date().toUTCString();
  const domain = new URL(url).hostname;

  console.log(`site: ${domain}`);
  console.log(`num_links: ${links}`);
  console.log(`num_images: ${images}`);
  console.log(`last_fetch: ${lastFetch}`);
}
