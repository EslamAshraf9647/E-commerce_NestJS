import { Injectable, NotFoundException } from "@nestjs/common";
import { BrandCategoryRepository, BrandRepository, SubsubCategoryRepository } from "src/DB/Repositories";
import { Types } from "mongoose";



@Injectable()
export class BrandCategoryService {
    constructor(
        private readonly brandcategoryRepository: BrandCategoryRepository,
        private readonly subsubategoryRepository: SubsubCategoryRepository,
        private readonly brandRepository: BrandRepository,
    ) {}

    async CreateBrandCategory({body, authuser}){
        const { brandId, subSubCategoryId } = body;
          const addedBy= authuser.user._id

        if(!Types.ObjectId.isValid(brandId))  throw new Error('Invalid brandId');
        if(!Types.ObjectId.isValid(subSubCategoryId))  throw new Error('Invalid subSubCategoryId');

        const brand = await this.brandRepository.findOne({filters: {_id: brandId}});
        if(!brand) throw new NotFoundException('Brand not found');

        const subSubCategory = await this.subsubategoryRepository.findOne({filters: {_id: subSubCategoryId}});
        if(!subSubCategory) throw new NotFoundException('SubSubCategory not found');

        const brandCategory = await this.brandcategoryRepository.create({
            brandId: Types.ObjectId.createFromHexString(brandId),
            subSubCategoryId: Types.ObjectId.createFromHexString(subSubCategoryId),
            addedBy
        });

        return brandCategory;
    }
    
}