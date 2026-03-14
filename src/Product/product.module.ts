import { Module } from "@nestjs/common";
import { BrandModel, CategoryModel, ProductModel, SubCategoryModel, SubsubCategoryModel } from "src/DB/Models";
import { ProductController } from "./Controller/product.controller";
import { BrandCategoryRepository, BrandRepository, CategoryRepository, ProductRepository, SubCategoryRepository, SubsubCategoryRepository } from "src/DB/Repositories";
import { UploadCloudFileService } from "src/Common/Services";
import { ProductService } from "./Services/product.service";
import { CategoryService } from "src/Category/Services/category.service";
import { SubCategoryService } from "src/Sub-Category/Services/sub-category.service";
import { BrandService } from "src/Brand/Services/brand.service";
import { SubsubcategoryService } from "src/Sub_subCategory/Services/sub-sub-category.service";
import { BrandCategoryModel } from "src/DB/Models/brand-category";


@Module({
    imports:[ProductModel, CategoryModel, SubCategoryModel, SubsubCategoryModel, BrandModel, BrandCategoryModel],
    controllers:[ProductController],
    providers:[
              ProductRepository,ProductService, CategoryService, SubCategoryService,
              SubsubcategoryService,BrandService,UploadCloudFileService,CategoryRepository,
              SubCategoryRepository,SubsubCategoryRepository,BrandRepository,BrandCategoryRepository
    ],
    exports:[]
})

export class ProductModule{}