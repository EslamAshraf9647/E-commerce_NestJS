import { Body, Controller, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { SubsubcategoryService } from "../Services/sub-sub-category.service";
import { Auth, Authuser } from "src/Common/Decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFileOptions } from "src/Common/Utils";
import { ImageAllowedExtensions } from "src/Common/Constants/constants";
import type { IAuthUser } from "src/Common/Types";
import type { Response } from "express";



@Controller('Sub-subcategory')
export class SubsubcategoryController{
    constructor(  private readonly subsubcategoryService:SubsubcategoryService,) {}

     @Post('create-Sub-subcategory/:SubcategoryId')
        @Auth('admin')
        @UseInterceptors(FileInterceptor('image',UploadedFileOptions({path:"Sub-subCategory", allowedFileType:ImageAllowedExtensions})))
        async CreateSubCategoryHandler(
            @Body('name') name: string,
            @Param('SubcategoryId') SubcategoryId: string, 
            @Authuser() authUser: IAuthUser,
            @Res() res: Response,
            @UploadedFile() image?: Express.Multer.File
        ){
            const result = await this.subsubcategoryService.CreateSubsubCategoryService({name, authUser,SubcategoryId, image})
            res.status(201).json({message:"SubsubCategory Created Successfully" , result})
        }

    
    @Get('get/:SubsubCategoryId')
        async GetSubCategoryHandler(
        @Param('SubsubCategoryId') SubsubCategoryId: string,
        @Res() res: Response 
        ){
            const result = await this.subsubcategoryService.GetSubsubCategoryById(SubsubCategoryId)
            res.status(200).json({message:"SubCategory fetched successfully" , result})
        }

    @Put('update/:SubsubCategoryId')
        @Auth('admin')
        @UseInterceptors(FileInterceptor('image',UploadedFileOptions({path:"Sub-subCategory", allowedFileType:ImageAllowedExtensions})))
              async UpdateSubCategoryHandler(
               @Body('name') name:string,
               @Param('SubsubCategoryId') SubsubCategoryId:string,
               @Authuser() authUser: IAuthUser,
               @Res() res: Response,
               @UploadedFile() image? :Express.Multer.File
              ) {
               const result = await this.subsubcategoryService.updateSubsubCategoryService({name, SubsubCategoryId, authUser, image})
               res.status(200).json({message:'SubCategory updated successfully' , result})
              }    

    @Get('list-alls') 
       async ListAllSubCategoriesHandler(
        @Res() res: Response 
       ) {
        const SubsubCategory= await this.subsubcategoryService.ListAllSubsubCategoryService()
        res.status(200).json({message: "SubsubCategories fetched successfully", data: SubsubCategory})
       }
}