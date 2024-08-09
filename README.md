# Web Content Scraper

This project is a web application that fetches transcriptions from YouTube videos, articles from websites, and podcasts, and saves them to files. It's built with Next.js, TailwindCSS, ShadcnUI, and JustD, and is hosted on Vercel.

## Features

- Scrape content from YouTube videos, articles, and podcasts
- User-friendly web interface
- Automatic saving of scraped content to files
- Deployment on Vercel

## Tech Stack

- Next.js 13+ with App Router
- TypeScript
- TailwindCSS
- ShadcnUI
- JustD
- Python (for backend scraping logic)

## Setup

### Prerequisites

- Node.js and npm
- Python 3.x
- pip (Python package installer)
- Virtual environment (recommended)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/web-content-scraper.git
    cd web-content-scraper
    ```

2. Create a virtual environment for Python:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

4. Install the required Node.js packages:
    ```bash
    npm install
    ```

5. Create a `.env.local` file in the root directory and add your YouTube Data API key:
    ```plaintext
    YOUTUBE_DATA_API_KEY=your_youtube_data_api_key
    ```

## Usage

1. Start the development server:
    ```bash
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

3. Use the web interface to enter URLs for articles, podcasts, and YouTube videos, then click "Scrape Content".

4. The scraped content will be saved in the `public/articles`, `public/podcasts`, and `public/youtube` folders.

## Deployment

1. Push your code to GitHub:
    ```bash
    git add .
    git commit -m "Ready for deployment"
    git push
    ```

2. Deploy to Vercel:
    1. Connect your GitHub repository to Vercel.
    2. Configure the environment variables in Vercel, including `YOUTUBE_DATA_API_KEY`.
    3. Deploy the project.

## Project Structure

```
web-content-scraper/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── scrape/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ScraperForm.tsx
│   └── utils/
│       ├── scraper.ts
│       ├── youtube_scraper.ts
│       ├── article_scraper.py
│       └── podcast_scraper.py
├── public/
│   ├── articles/
│   ├── podcasts/
│   └── youtube/
├── .env.local
├── .gitignore
├── package.json
├── requirements.txt
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## License

This project is licensed under the MIT License.

```
requirements.txt
newspaper3k
requests
google-cloud-speech
flask