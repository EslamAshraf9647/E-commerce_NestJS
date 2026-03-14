import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubsubCategory, SubsubCategoryType } from '../Models/Sub_sub-category.model';

@Injectable()
export class SubsubCategoryRepository extends BaseService<SubsubCategoryType> {
  constructor(
    @InjectModel(SubsubCategory.name)
    private readonly SubsubCategoryModel: Model<SubsubCategoryType>,
  ) {
    super(SubsubCategoryModel);
  }
}
