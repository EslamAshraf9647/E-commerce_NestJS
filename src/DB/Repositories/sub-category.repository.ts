import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory, SubCategoryType } from '../Models';

@Injectable()
export class SubCategoryRepository extends BaseService<SubCategoryType> {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategoryType>,
  ) {
    super(subCategoryModel);
  }
}
