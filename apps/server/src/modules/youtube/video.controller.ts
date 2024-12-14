import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';

@ApiTags('videos')
@Controller('api/videos')
export class VideoController {
  constructor(private prisma: PrismaService) {}

  logger = new Logger(VideoController.name);

  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  @ApiResponse({ status: 200, description: 'Return all videos.' })
  async findAll() {
    return this.prisma.video.findMany({
      include: {
        channel: true,
      },
      orderBy: {
        publishedAt: Prisma.SortOrder.desc,
      },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a video by id' })
  @ApiResponse({ status: 200, description: 'Return a video.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
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
  @ApiOperation({ summary: 'Create a new video' })
  @ApiResponse({ status: 201, description: 'The video has been created.' })
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
  @ApiOperation({ summary: 'Update a video' })
  @ApiResponse({ status: 200, description: 'The video has been updated.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
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
      this.logger.error(error);
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a video' })
  @ApiResponse({ status: 200, description: 'The video has been deleted.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  async remove(@Param('id') id: string) {
    try {
      return await this.prisma.video.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
  }
}
