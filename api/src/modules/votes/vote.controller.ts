import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { VoteService } from './vote.service'
import { CreateVoteDto } from '@dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@guards'

@ApiTags('Votes')
@Controller('votes')
export class VoteController {
  constructor(private voteService: VoteService) {}

  @Get()
  findAll() {
    return this.voteService.findAll()
  }

  @Get('thumbs/:videoId')
  getTotalThumbsByVideoId(@Param('videoId') videoId: string) {
    return this.voteService.getTotalThumbsByVideoId(videoId)
  }

  @Get('status/:videoId')
  voteStatus(@Request() req, @Param('videoId') videoId: string) {
    return this.voteService.voteStatus(req, videoId)
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createVoteDto: CreateVoteDto) {
    return this.voteService.create(req, createVoteDto)
  }
}
