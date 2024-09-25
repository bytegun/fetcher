# Fetcher CLI Tool

This command-line tool fetches web pages and saves them to disk.

## Prerequisites

- Docker
- Node.js

## How to Use

1. Build the Docker image:

   ```bash
   docker build -t fetcher .
   ```

2. Run the fetcher to save web pages:

   ```bash
   docker run --rm -v $(pwd):/usr/src/app fetcher https://www.google.com
   ```

   This will save the web page content to a file named `www.google.com.html`.

3. To print metadata for a URL:

   ```bash
   docker run --rm fetcher --metadata https://www.google.com
   ```
