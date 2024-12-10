export class CreateVideoDto {
  youtubeId: string;
  title: string;
  description: string;
  publishedAt: Date;
  channelId: string;
}

export class UpdateVideoDto {
  title?: string;
  description?: string;
}
