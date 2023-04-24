import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateVoteDto {
  @ApiProperty()
  @IsString()
  action: string

  @ApiProperty()
  @IsString()
  videoId: string
}
