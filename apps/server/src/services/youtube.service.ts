import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { google, youtube_v3 } from 'googleapis';

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

  async getChannelInfoByUsername(username: string) {
    const { data } = await axios.get<{
      items: {
        id: string;
      }[];
    }>(
      `https://www.googleapis.com/youtube/v3/channels?key=${this.configService.get<string>('YOUTUBE_API_KEY')}&forUsername=${username}&part=id`,
    );

    console.log(data);

    const id = data.items?.[0]?.id;

    if (!id) {
      throw new NotFoundException('Channel not found');
    }

    const channelInfo = await this.getChannelInfoById(id);

    return channelInfo;
  }

  async getChannelInfoById(id: string) {
    const channelName = await this.youtube.channels.list({
      part: ['snippet'],
      id: [id],
    });

    if (!channelName.data.items?.[0].snippet?.title) {
      throw new NotFoundException('Channel not found');
    }

    return {
      id,
      name: channelName.data.items[0].snippet?.title,
    };
  }
}
