import { Body, Controller, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { SubCategoryService } from "../Services/sub-category.service";
import { Auth, Authuser } from "src/Common/Decorators";
import type { IAuthUser } from "src/Common/Types";
import { ImageAllowedExtensions } from "src/Common/Constants/constants";
import { UploadedFileOptions } from "src/Common/Utils";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";




@Controller('sub-category')
export class SubCategoryController{
    constructor(private readonly SubcategoryService: SubCategoryService ) {}

    @Post('create-sub-category/:categoryId')
    @Auth('admin')
    @UseInterceptors(FileInterceptor('image',UploadedFileOptions({path:"Sub-Category", allowedFileType:ImageAllowedExtensions})))
    async CreateSubCategoryHandler(
        @Body('name') name: string,
        @Param('categoryId') categoryId: string, 
        @Authuser() authUser: IAuthUser,
        @Res() res: Response,
        @UploadedFile() image?: Express.Multer.File
    ){
        const result = await this.SubcategoryService.CreateSubCategoryService({name, authUser,categoryId, image})
        res.status(201).json({message:"SubCategory Created Successfully" , result})
    }

    @Get('get/:SubCategoryId')
       async GetSubCategoryHandler(
        @Param('SubCategoryId') SubCategoryId: string,
        @Res() res: Response 
       ){
        const result = await this.SubcategoryService.GetSubCategoryById(SubCategoryId)
        res.status(200).json({message:"SubCategory fetched successfully" , result})
       }

    @Put('update/:SubCategoryId')
    @Auth('admin')
    @UseInterceptors(FileInterceptor('image',UploadedFileOptions({path:"Sub-Category", allowedFileType:ImageAllowedExtensions})))
          async UpdateSubCategoryHandler(
           @Body('name') name:string,
           @Param('SubCategoryId') SubCategoryId:string,
           @Authuser() authUser: IAuthUser,
           @Res() res: Response,
           @UploadedFile() image? :Express.Multer.File
          ) {
           const result = await this.SubcategoryService.updateSubCategoryService({name, SubCategoryId, authUser, image})
           res.status(200).json({message:'SubCategory updated successfully' , result})
          }

          
   @Get('list-alls') 
   async ListAllSubCategoriesHandler(
    @Res() res: Response 
   ) {
    const SubCategory= await this.SubcategoryService.ListAllSubCategoryService()
    res.status(200).json({message: "SubCategory fetched successfully", data: SubCategory})
   }

}