import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "../base.service";
import { Model } from "mongoose";
import { BrandCategory, BrandCategoryType } from "../Models/brand-category";


@Injectable()
export class BrandCategoryRepository extends BaseService<BrandCategoryType> {
  constructor(
    @InjectModel(BrandCategory.name)
    private readonly brandCategoryModel: Model<BrandCategoryType>,
  ) {
    super(brandCategoryModel);
  }
}
