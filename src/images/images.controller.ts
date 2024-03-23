import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseGuards,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { imagesStorage } from './storage';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('images')
@ApiTags('images')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: imagesStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: string,
  ) {
    return this.imagesService.create(file, userId);
  }

  @Get()
  findAll(@UserId() uuid: string) {
    return this.imagesService.findAll(uuid);
  }

  @Delete()
  remove(@UserId() userId: string, @Query('ids') ids: string) {
    return this.imagesService.remove(userId, ids);
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: imagesStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  updateAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: string,
  ) {
    return this.imagesService.updateAvatar(file, userId);
  }
}
