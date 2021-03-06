import { CreateCategoryService } from '@modules/categories/application/services/create-category.service';
import { CreateCategoryDto } from '@modules/categories/domain/dto/create-category.dto';
import { Category } from '@modules/categories/infra/persistence/typeorm/entities/category.entity';
import { HttpStatus } from '@shared/enums/http-status.enum';
import {
  Authorized,
  Body,
  HttpCode,
  JsonController,
  Post,
} from 'routing-controllers';
import { container } from 'tsyringe';

@JsonController('/categories')
export default class CategoriesController {
  @Authorized()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async create(@Body() body: CreateCategoryDto): Promise<Category> {
    const { title } = body;

    const createCategory = container.resolve(CreateCategoryService);

    const category = await createCategory.execute({
      title,
    });

    return category;
  }
}
