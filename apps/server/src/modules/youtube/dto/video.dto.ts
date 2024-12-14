import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({
    description: 'The YouTube ID of the video',
    example: 'dQw4w9WgXcQ',
  })
  youtubeId: string;

  @ApiProperty({
    description: 'The title of the video',
    example: 'Never Gonna Give You Up',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the video',
    example: 'Official music video for Rick Astley - Never Gonna Give You Up',
  })
  description: string;

  @ApiProperty({
    description: 'The publication date of the video',
    example: '2009-10-25T06:57:33Z',
  })
  publishedAt: Date;

  @ApiProperty({
    description: 'The ID of the channel that uploaded the video',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  channelId: string;
}

export class UpdateVideoDto {
  @ApiProperty({
    description: 'The title of the video',
    example: 'Never Gonna Give You Up (Remastered)',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'The description of the video',
    example: 'Remastered version of Rick Astley - Never Gonna Give You Up',
    required: false,
  })
  description?: string;
}
