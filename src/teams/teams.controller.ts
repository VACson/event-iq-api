import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('teams')
@ApiTags('teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto, @UserId() userUuid: string) {
    return this.teamsService.create(userUuid, createTeamDto);
  }

  @Get()
  async findAll() {
    return await this.teamsService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.teamsService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(uuid, updateTeamDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.teamsService.remove(uuid);
  }
}
