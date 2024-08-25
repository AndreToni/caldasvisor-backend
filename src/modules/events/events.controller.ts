import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, ParseUUIDPipe, UploadedFile } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizerGuard } from '../auth/organizer.guard';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { FindEventsDto } from './dto/find-events.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/helpers/file-name';

@ApiBearerAuth()
@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @UseGuards(AuthGuard, OrganizerGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() {user}: {user: User}) {
    return this.eventsService.create(createEventDto, user);
  }

  @Get()
  findAll(@Query() findEventsDto: FindEventsDto) {
    return this.eventsService.findAll(findEventsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './storage/images',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter
  }))
  uploadImage(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File) {
    return this.eventsService.uploadFile(id, file);
  }

  @Post(':id/remove-image')
  removeFile(@Param('id', ParseUUIDPipe) id: string, @Body() {path}: {path: string}) {
    return this.eventsService.removeFile(id, path);
  }
}
