import { Job, Queue } from 'bullmq';

export interface ProcessChannelVideosJobData {
  channelId: string;
  channelName: string;
  youtubeId: string;
}

export type YoutubeCrawlerQueue = Queue<
  ProcessChannelVideosJobData,
  any,
  'process-channel-videos'
>;

export type FetchVideosJobData = Job<
  {
    channelId: string;
    channelName: string;
    youtubeId: string;
  },
  any,
  'fetch-videos'
>;
