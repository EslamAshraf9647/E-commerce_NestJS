import { Body, Controller, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { BrandService } from "../Services/brand.service";
import { Auth, Authuser } from "src/Common/Decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFileOptions } from "src/Common/Utils";
import { ImageAllowedExtensions } from "src/Common/Constants/constants";
import type { IAuthUser } from "src/Common/Types";
import type { Response } from "express";


@Controller('brand')
export class BrandController{
    constructor(private readonly brandService:BrandService){}

    @Post('create-brand')
    @Auth('admin')
    @UseInterceptors(FileInterceptor('image',UploadedFileOptions({path:"Sub-subCategory", allowedFileType:ImageAllowedExtensions})))
    async CreateBrabdHnadler(
        @Body('name') name: string,
        // @Param('SubsubcategoryId') SubsubcategoryId: string,
        @Authuser() authUser: IAuthUser,
        @Res() res: Response,
        @UploadedFile() image?: Express.Multer.File
    ){
        const result = await this.brandService.CreateBrandService({name, authUser, image})
        res.status(201).json({message:"Brand Created Successfully" , result})
    }

    @Get('get/:brandId')
            async GetBrandHandler(
            @Param('brandId') brandId: string,
            @Res() res: Response 
            ){
                const result = await this.brandService.GetBrandById(brandId)
                res.status(200).json({message:"Brand fetched successfully" , result})
            }

    @Put('update/:BrandId')
            @Auth('admin')
            @UseInterceptors(FileInterceptor('image',UploadedFileOptions({path:"Brand", allowedFileType:ImageAllowedExtensions})))
            async UpdateBrandHandler(
            @Body('name') name:string,
            @Param('BrandId') BrandId:string,
            @Authuser() authUser: IAuthUser,
            @Res() res: Response,
            @UploadedFile() image? :Express.Multer.File
            ) {
                const result = await this.brandService.updateBrandService({name, BrandId, authUser, image})
                res.status(200).json({message:'Brand updated successfully' , result})
            }

    
    @Get('list-alls') 
       async ListAllBransHandler(
        @Res() res: Response 
       ) {
        const Brand= await this.brandService.ListAllBrandService()
        res.status(200).json({message: "Brands fetched successfully", data: Brand})
       }

}