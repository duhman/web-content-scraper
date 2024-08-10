declare module 'youtube-transcript-api' {
  export class YouTubeTranscriptApi {
    static getTranscript(videoId: string): Promise<{ text: string }[]>;
  }
}