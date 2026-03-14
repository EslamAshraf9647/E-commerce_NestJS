import { Module } from "@nestjs/common";
import { BrandModel } from "src/DB/Models/brand.model";
import { BrandController } from "./Controller/brand.controller";
import { BrandRepository } from "src/DB/Repositories/brand.repository";
import { BrandService } from "./Services/brand.service";
import { UploadCloudFileService } from "src/Common/Services";
import { CategoryRepository, SubCategoryRepository, SubsubCategoryRepository } from "src/DB/Repositories";
import { CategoryModel, SubCategoryModel, SubsubCategoryModel } from "src/DB/Models";


@Module({
    imports:[BrandModel],
    controllers:[BrandController],
    providers:[BrandRepository,BrandService,UploadCloudFileService],
    exports:[]
})

export class BrandModule{}