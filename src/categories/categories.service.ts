import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }

  async findOne(uuid: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { uuid } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${uuid} not found`);
    }
    return category;
  }

  async update(
    uuid: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findOne(uuid);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(uuid: string): Promise<void> {
    const result = await this.categoryRepository.delete(uuid);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${uuid} not found`);
    }
  }
}
