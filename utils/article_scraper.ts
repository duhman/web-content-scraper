import axios from 'axios';
import * as cheerio from 'cheerio';

export async function get_article_content(url: string): Promise<[string | null, string | null]> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $('title').text();
    const content = $('p').text();
    return [title, content];
  } catch (error) {
    console.error(`Error scraping article: ${error}`);
    return [null, null];
  }
}