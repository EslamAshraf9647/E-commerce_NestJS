import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "../base.service";
import { Brand, BrandType } from "../Models/brand.model";
import { Model } from "mongoose";


@Injectable()
export class BrandRepository extends BaseService<BrandType> {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandType>,
  ) {
    super(brandModel);
  }
}
