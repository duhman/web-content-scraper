import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { SpeechClient } from '@google-cloud/speech';

export async function download_podcast(url: string): Promise<string | null> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const filename = path.join(process.cwd(), 'temp', `podcast_${Date.now()}.mp3`);
    await ensureDirectoryExists(path.dirname(filename));
    await fs.writeFile(filename, response.data);
    return filename;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Podcast not found');
      } else if (error.response?.status === 403) {
        throw new Error('Access to podcast is forbidden');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Network timeout while downloading podcast');
      }
    }
    throw new Error('Failed to download podcast');
  }
}

export async function transcribe_podcast(audio_path: string): Promise<string | null> {
  try {
    const client = new SpeechClient();
    const audio = {
      content: await fs.readFile(audio_path),
    };
    const config = {
      encoding: 'MP3' as const,
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(request);
    return response.results?.map(result => result.alternatives?.[0].transcript).join(' ') || null;
  } catch (error) {
    console.error(`Error transcribing podcast: ${error}`);
    return null;
  }
}

function ensureDirectoryExists(arg0: string) {
  throw new Error('Function not implemented.');
}
