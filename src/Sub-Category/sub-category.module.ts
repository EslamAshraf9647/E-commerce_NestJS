import { Module } from "@nestjs/common";
import { CategoryModel, SubCategoryModel } from "src/DB/Models";
import { SubCategoryController } from "./Controller/sub-category.controller";
import { SubCategoryService } from "./Services/sub-category.service";
import { CategoryRepository, SubCategoryRepository } from "src/DB/Repositories";
import { UploadCloudFileService } from "src/Common/Services";
import { SubsubcategoryService } from "src/Sub_subCategory/Services/sub-sub-category.service";



@Module({
    imports:[SubCategoryModel,CategoryModel],
    controllers:[SubCategoryController],
    providers:[SubCategoryService, SubCategoryRepository, UploadCloudFileService,CategoryRepository],
    exports:[]
})

export class SubCategoryModule {}
