import ICreateCategoryDTO from '@modules/categories/domain/dto/create-category.dto';
import ICategoryRepository from '@modules/categories/domain/interfaces/category-repository.interface';
import { inject, injectable } from 'tsyringe';
import { ConflictException } from '@shared/exceptions/conflict.exception';
import Category from '@modules/categories/infra/persistence/typeorm/entities/Category';

@injectable()
export default class CreateCategoryService {
	constructor(
		@inject('CategoriesRepository')
		private categoriesRepository: ICategoryRepository,
	) {}

	async execute({ title, parent_id }: ICreateCategoryDTO): Promise<Category> {
		const checkCategoryExists = await this.categoriesRepository.findByTitle(
			title,
		);

		if (checkCategoryExists) {
			throw new ConflictException(
				`An category with the same title ${title} already exists.`,
			);
		}
		const category = await this.categoriesRepository.create({
			title,
			parent_id,
		});

		return category;
	}
}
