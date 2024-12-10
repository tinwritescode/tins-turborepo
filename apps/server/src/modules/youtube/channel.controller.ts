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
import { CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';

@Controller('api/channels')
export class ChannelController {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.channel.create({
      data,
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
    } catch (error) {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.prisma.channel.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }
  }
}
