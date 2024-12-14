import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty({
    description: 'The username of the channel',
    example: 'username',
  })
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class UpdateChannelDto {
  name?: string;
}
