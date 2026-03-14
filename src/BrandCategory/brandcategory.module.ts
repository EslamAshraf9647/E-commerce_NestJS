import { Module } from "@nestjs/common";
import { BrandCategoryModel } from "src/DB/Models/brand-category";
import { BrandCategoryController } from "./Controller/barndcategory.controller";
import { BrandCategoryService } from "./Services/brandcategory.service";
import { BrandModel, SubsubCategoryModel } from "src/DB/Models";
import { BrandCategoryRepository, BrandRepository, SubsubCategoryRepository } from "src/DB/Repositories";



@Module({
    imports: [BrandCategoryModel,BrandModel,SubsubCategoryModel],
    controllers: [BrandCategoryController],
    providers: [BrandCategoryService,BrandCategoryRepository,BrandRepository,SubsubCategoryRepository],
    exports: []
})
export class BrandCategoryModule {}