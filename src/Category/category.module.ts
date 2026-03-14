import { Module } from "@nestjs/common";
import { CategoryController } from "./Controller/category.controller";
import { CategoryService } from "./Services/category.service";
import { BrandCategoryRepository, BrandRepository, CategoryRepository, ProductRepository, SubCategoryRepository, SubsubCategoryRepository } from "src/DB/Repositories";
import { BrandModel, CategoryModel, ProductModel, SubCategoryModel, SubsubCategoryModel } from "src/DB/Models";
import { UploadCloudFileService } from "src/Common/Services";
import { BrandCategoryModel } from "src/DB/Models/brand-category";


@Module({
    imports: [CategoryModel,SubCategoryModel,SubsubCategoryModel,BrandModel,ProductModel,BrandCategoryModel],
    controllers: [CategoryController],
    providers: [CategoryService,CategoryRepository,UploadCloudFileService,SubCategoryRepository,
                SubsubCategoryRepository,BrandRepository,ProductRepository,BrandCategoryRepository],
    exports: []
})

export class CategoryModule {}