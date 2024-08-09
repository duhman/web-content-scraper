import logging
import os
import re
from newspaper import Article

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def get_article_content(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        return article.title, article.text
    except Exception as e:
        logging.error(f"Error scraping article: {e}")
        return None, None

def sanitize_filename(filename):
    return re.sub(r'[\\/*?:"<>|]', "", filename)

def save_article_content(url):
    title, content = get_article_content(url)
    if title and content:
        sanitized_title = sanitize_filename(title)
        os.makedirs("public/articles", exist_ok=True)
        filename = os.path.join("public/articles", f"{sanitized_title}.txt")
        with open(filename, "w", encoding="utf-8") as file:
            file.write(content)
        logging.info(f"Article content saved to {filename}")
    else:
        logging.error("Failed to save article content")

# Example usage
if __name__ == "__main__":
    url = "https://example.com/article"
    save_article_content(url)