import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CategoryService } from "../Services/category.service";
import { Auth, Authuser } from "src/Common/Decorators";
import type { IAuthUser } from "src/Common/Types";
import type { Response, Express} from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFileOptions } from "src/Common/Utils";
import { ImageAllowedExtensions } from "src/Common/Constants/constants";
import { Types } from "mongoose";



@Controller('category')
export class CategoryController {
    constructor( private readonly categoryService: CategoryService) {}

    @Post('create') 
    @Auth('admin')
    @UseInterceptors(FileInterceptor('image',UploadedFileOptions({path:"Category", allowedFileType:ImageAllowedExtensions})))
    async createCategoryHansler(
        @Body('name') name: string,
        @Authuser() authUser: IAuthUser,
        @Res() res : Response,
        @UploadedFile() image?: Express.Multer.File,
    ) {
     
        const result= await this.categoryService.createCategoryService({name, authUser, image});
        res.status(201).json({message:"Category created Successfully" , result  })
}

   @Put('update/:categoryId')
   @Auth('admin')
   @UseInterceptors(FileInterceptor('image',UploadedFileOptions({path:"Category", allowedFileType:ImageAllowedExtensions})))
   async UpdateCategoryHandler(
    @Body('name') name:string,
    @Param('categoryId') categoryId:string,
    @Authuser() authUser: IAuthUser,
    @Res() res: Response,
    @UploadedFile() image? :Express.Multer.File
   ) {
    const result = await this.categoryService.updatecategoryService({name, categoryId, authUser, image})
    res.status(200).json({message:'category updated successfully' , result})
   }

   @Get('get/:categoryId')
   async GetCategoryHandler(
    @Param('categoryId') categoryId: string,
    @Res() res: Response 
   ){
    const result = await this.categoryService.GetCategoryById(categoryId)
    res.status(200).json({message:"category fetched successfully" , result})
   }

   @Get('list-all') 
   async ListAllCategoriesHandler(
    @Res() res: Response 
   ) {
    const categories= await this.categoryService.ListAllCategoryService()
    res.status(200).json({message: "Categories fetched successfully", data: categories})
   }

   @Delete('delete/:categoryId')
   @Auth('admin')
   async DeleteCategoryHandler(
    @Param('categoryId') categoryId: string,
    @Res() res: Response
   ) {
    await this.categoryService.deleteCategory (Types.ObjectId.createFromHexString(categoryId))
    res.status(200).json({message:"category deleted successfully"})
   }

}
    
    
