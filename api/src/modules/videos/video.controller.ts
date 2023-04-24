import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common'
import { VideoService } from './video.service'
import { CreateVideoDto } from '@dto'
import { AuthGuard } from '@guards'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Videos')
@Controller('videos')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get()
  findAll() {
    return this.videoService.findAll()
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(req, createVideoDto)
  }
}
