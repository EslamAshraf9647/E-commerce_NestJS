import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryType } from '../Models';
import { UploadCloudFileService } from 'src/Common/Services/upload-file.service';
import { SubCategoryRepository } from './sub-category.repository';
import { SubsubCategoryRepository } from './Sub_sub-category.repository';
import { BrandRepository } from './brand.repository';
import { ProductRepository } from './product.repository';
import tr from 'zod/v4/locales/tr.js';

@Injectable()
export class CategoryRepository extends BaseService<CategoryType> {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryType>,
  ) {
    super(categoryModel);
  }         


}
