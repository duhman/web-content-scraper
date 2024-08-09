import logging
import os
import re
import requests
from google.cloud import speech_v1p1beta1 as speech
import io
import os
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def download_podcast(url, filename="podcast.mp3"):
    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(filename, "wb") as file:
            file.write(response.content)
    except requests.RequestException as e:
        logging.error(f"Error downloading podcast: {e}")
        return None
    return filename

def transcribe_podcast(audio_path):
    try:
        client = speech.SpeechClient()
        with io.open(audio_path, "rb") as audio_file:
            content = audio_file.read()
        audio = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.MP3,
            sample_rate_hertz=16000,
            language_code="en-US",
        )
        response = client.recognize(config=config, audio=audio)
        return " ".join([result.alternatives[0].transcript for result in response.results])
    except Exception as e:
        logging.error(f"Error transcribing podcast: {e}")
        return None

def sanitize_filename(filename):
    return re.sub(r'[\\/*?:"<>|]', "", filename)

def save_podcast_transcription(url):
    filename = download_podcast(url)
    if filename:
        transcription = transcribe_podcast(filename)
        if transcription:
            sanitized_title = sanitize_filename(os.path.basename(url).split('.')[0])
            os.makedirs("public/podcasts", exist_ok=True)
            output_filename = os.path.join("public/podcasts", f"{sanitized_title}.txt")
            with open(output_filename, "w", encoding="utf-8") as file:
                file.write(transcription)
            logging.info(f"Podcast transcription saved to {output_filename}")
        else:
            logging.error("Failed to transcribe podcast")
        os.remove(filename)
    else:
        logging.error("Failed to download podcast")

# Example usage
if __name__ == "__main__":
    podcast_url = "https://example.com/podcast.mp3"
    save_podcast_transcription(podcast_url)