import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';

@Controller('api/videos')
export class VideoController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.video.findMany({
      include: {
        channel: true,
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: {
        channel: true,
      },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return video;
  }

  @Post()
  async create(@Body() data: CreateVideoDto) {
    return this.prisma.video.create({
      data: {
        youtubeId: data.youtubeId,
        title: data.title,
        description: data.description,
        publishedAt: data.publishedAt,
        channel: {
          connect: { id: data.channelId },
        },
      },
      include: {
        channel: true,
      },
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateVideoDto) {
    try {
      return await this.prisma.video.update({
        where: { id },
        data,
        include: {
          channel: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.prisma.video.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
  }
}
