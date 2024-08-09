# Web Content Scraper

This project fetches transcriptions from YouTube videos, articles from websites, and podcasts, and saves them to files. The project is now a web application built with Next.js, TailwindCSS, ShadcnUI, and JustD, and is hosted on Vercel.

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

5. Create a `.env` file in the root directory of the project and add your YouTube Data API key:
    ```plaintext
    YOUTUBE_DATA_API_KEY=your_youtube_data_api_key
    ```

### Usage

1. Start the development server:
    ```bash
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

3. Enter the URLs for articles, podcasts, and YouTube videos in the respective fields and click "Scrape Content".

4. The scraped content will be saved in the `public/articles`, `public/podcasts`, and `public/youtube` folders.

Note: This project now uses TypeScript and the Next.js 13+ App Router.

### Deployment

1. Initialize a Git repository and push your code to GitHub:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git remote add origin https://github.com/yourusername/web-content-scraper.git
    git push -u origin main
    ```

2. Deploy to Vercel:
    1. Go to [Vercel](https://vercel.com/), sign in, and create a new project.
    2. Import your GitHub repository.
    3. Set up environment variables in Vercel for `YOUTUBE_DATA_API_KEY`.
    4. Deploy the project.

### Project Structure

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
├── .env
├── .gitignore
├── package.json
├── requirements.txt
├── tailwind.config.js
├── vercel.json
└── README.md
```

### License

This project is licensed under the MIT License.

```
requirements.txt
newspaper3k
requests
google-cloud-speech
flask