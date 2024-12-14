import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { YouTubeService } from '../../services/youtube.service';
import { CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';

@Controller('api/channels')
export class ChannelController {
  constructor(
    private prisma: PrismaService,
    private youtubeService: YouTubeService,
  ) {}

  @Get()
  async findAll() {
    return this.prisma.channel.findMany({
      include: {
        videos: true,
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      include: {
        videos: true,
      },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }

    return channel;
  }

  @Post()
  async create(@Body() data: CreateChannelDto) {
    const isId = /UC.+/.test(data.username);

    let channelInfo: Awaited<
      ReturnType<typeof this.youtubeService.getChannelInfoById>
    >;

    if (isId) {
      channelInfo = await this.youtubeService.getChannelInfoById(data.username);
    } else {
      channelInfo = await this.youtubeService.getChannelInfoByUsername(
        data.username,
      );
    }

    return this.prisma.channel.upsert({
      where: { youtubeId: channelInfo.id },
      update: {
        name: channelInfo.name,
      },
      create: {
        youtubeId: channelInfo.id,
        name: channelInfo.name,
      },
      include: {
        videos: true,
      },
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateChannelDto) {
    try {
      return await this.prisma.channel.update({
        where: { id },
        data,
        include: {
          videos: true,
        },
      });
    } catch {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.prisma.channel.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }
  }
}
