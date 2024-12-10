import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, youtube_v3 } from 'googleapis';
import { Logger } from '@nestjs/common';

@Injectable()
export class YouTubeService {
  private youtube: youtube_v3.Youtube;
  private readonly logger = new Logger(YouTubeService.name);

  constructor(private configService: ConfigService) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: this.configService.get<string>('YOUTUBE_API_KEY'),
    });
  }

  async getLatestVideos(channelId: string, maxResults: number = 10) {
    try {
      const response = await this.youtube.search.list({
        part: ['snippet'],
        channelId: channelId,
        order: 'date',
        maxResults: maxResults,
        type: ['video'],
      });

      return response.data.items?.map((item) => ({
        youtubeId: item.id?.videoId,
        title: item.snippet?.title,
        description: item.snippet?.description,
        publishedAt: item.snippet?.publishedAt,
      }));
    } catch (error) {
      this.logger.error(
        `Error fetching videos for channel ${channelId}:`,
        error,
      );
      throw error;
    }
  }
}
