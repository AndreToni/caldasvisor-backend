import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, UseInterceptors, ParseUUIDPipe, UploadedFile } from '@nestjs/common';
import { TouristAttractionsService } from './tourist-attractions.service';
import { CreateTouristAttractionDto } from './dto/create-tourist-attraction.dto';
import { UpdateTouristAttractionDto } from './dto/update-tourist-attraction.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindTouristAttractionDto } from './dto/find-tourist-attraction.dto';
import { AuthGuard } from '../auth/auth.guard';
import { OrganizerGuard } from '../auth/organizer.guard';
import { User } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/helpers/file-name';
import { imageFileFilter } from 'src/helpers/file-filter';

@ApiBearerAuth()
@ApiTags('tourist-attractions')
@Controller('tourist-attractions')
export class TouristAttractionsController {
  constructor(private readonly touristAttractionsService: TouristAttractionsService) {}

  @UseGuards(AuthGuard, OrganizerGuard)
  @Post()
  create(@Body() createTouristAttractionDto: CreateTouristAttractionDto, @Req() {user}: {user: User}) {
    return this.touristAttractionsService.create(createTouristAttractionDto, user);
  }

  @Get()
  findAll(@Query() query: FindTouristAttractionDto) {
    return this.touristAttractionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.touristAttractionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTouristAttractionDto: UpdateTouristAttractionDto) {
    return this.touristAttractionsService.update(id, updateTouristAttractionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.touristAttractionsService.remove(id);
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
    return this.touristAttractionsService.uploadFile(id, file);
  }
 
  @Post(':id/remove-image')
  removeFile(@Param('id', ParseUUIDPipe) id: string, @Body() {path}: {path: string}) {
    return this.touristAttractionsService.removeFile(id, path);
  }
}
