import { fetchAndSave, printMetadata } from './fetcher';
import * as fs from 'fs';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Please provide at least one URL to fetch.');
  process.exit(1);
}

// Check if the user wants metadata
const isMetadata = args[0] === '--metadata';
const urls = isMetadata ? args.slice(1) : args;

urls.forEach(async (url) => {
  try {
    if (isMetadata) {
      await printMetadata(url);
    } else {
      await fetchAndSave(url);
    }
  } catch (error: any) {
    console.error(`Error fetching ${url}: ${error.message}`);
  }
});
