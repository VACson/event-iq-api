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
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('activities')
@ApiTags('activities')
@ApiBearerAuth()
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createActivityDto: CreateActivityDto,
    @UserId() userUuid: string,
  ) {
    return this.activitiesService.create(userUuid, createActivityDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@UserId() userUuid: string) {
    return await this.activitiesService.findAll({ userUuid });
  }

  @Get('user-created')
  @UseGuards(JwtAuthGuard)
  findAllByCreator(@UserId() uuid: string) {
    return this.activitiesService.findUserCreatedEvents(uuid);
  }

  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('uuid') uuid: string, @UserId() userUuid: string) {
    return this.activitiesService.findById({ uuid, userUuid });
  }

  @Patch(':uuid')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('uuid') uuid: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(uuid, updateActivityDto);
  }

  @Patch(':uuid/join')
  @UseGuards(JwtAuthGuard)
  addNewMember(@UserId() userUuid: string, @Param('uuid') uuid: string) {
    return this.activitiesService.addNewMember(uuid, userUuid);
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard)
  remove(@Param('uuid') uuid: string) {
    return this.activitiesService.remove(uuid);
  }
}
