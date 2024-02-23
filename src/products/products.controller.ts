import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/common/middlewares/edit-file-name.middleware';
import { imageFileFilter } from 'src/common/middlewares/file-upload.middleware';
import { CreateProductFileDto } from './dto/create-product-file.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  // @Roles(Role.Admin)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('import')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiBody({
    description: 'Product data with photo',
    type: CreateProductFileDto,
  })
  async createWithPhoto(
    @Body('title') title: string,
    @Body('price') price: number,
    @Body('description') description: string | null,
    @Body('isArchived') isArchived: boolean,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    // const response = {
    //   originalname: file.originalname,
    //   filename: file.filename,
    // };
    return this.productsService.create({
      title,
      price: Number(price),
      description,
      isArchived: Boolean(isArchived),
      photo: file.filename,
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string, @Req() req) {
    console.log(req.user);
    return this.productsService.remove(+id);
  }
}
