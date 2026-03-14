import { Module } from "@nestjs/common";
import { CategoryModel, SubCategoryModel } from "src/DB/Models";
import { SubsubCategoryModel } from "src/DB/Models/Sub_sub-category.model";
import { SubsubcategoryController } from "./Controller/sub-sub-category.controller";
import { SubsubcategoryService } from "./Services/sub-sub-category.service";
import { SubsubCategoryRepository } from "src/DB/Repositories/Sub_sub-category.repository";
import { CategoryRepository, SubCategoryRepository } from "src/DB/Repositories";
import { UploadCloudFileService } from "src/Common/Services";


@Module({
    imports:[SubsubCategoryModel,SubCategoryModel],
    controllers:[SubsubcategoryController],
    providers:[SubsubcategoryService,SubsubCategoryRepository,SubCategoryRepository,UploadCloudFileService],
    exports:[]
})

export class SubsubCategoryModule {}