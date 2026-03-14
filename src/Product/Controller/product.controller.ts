import { Body, Controller, Get, Post, Query, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductService } from "../Services/product.service";
import { Auth, Authuser } from "src/Common/Decorators";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UploadedFileOptions } from "src/Common/Utils";
import { ImageAllowedExtensions } from "src/Common/Constants/constants";
import type { IAuthUser } from "src/Common/Types";
import type { Request, Response } from "express";
import { json } from "zod";
import { CreateProductBodyDto, ListProductsQueryDto } from "../DTO/product.dto";
import { CustomThrottlerGuard } from "src/Common/Guards/custom-throttler.guard";

@UseGuards(CustomThrottlerGuard)
@Controller('product')
export class ProductController{
    constructor(private readonly productService:ProductService){}

    @Post('create')
    @Auth('admin')
    @UseInterceptors(FilesInterceptor('images', 3, UploadedFileOptions({path:'Product' , allowedFileType: ImageAllowedExtensions})))
    async CreateProductHandler(
        @Body() body: CreateProductBodyDto ,
        @Authuser() authUser: IAuthUser,
        @Res() res: Response,
        @UploadedFiles() files: Express.Multer.File[]

    ){
        const result = await this.productService.CreateProductService({body, authUser,files})
        res.status(201).json({message:"Product Created Successfully" , result})
    }

    @Get('build') 
    async buildProducthandler(){
        return await this.productService.buildProductsList()
    }

    @Get('list')
    async listProductsHandler(
       @Req() req:Request,
        @Res() res: Response) {
            console.log('Query list' ,  req['parsedQuery'] );
            
            
        const products = await this.productService.listProductsService(req['parsedQuery']);
         console.log('Fetched Products:', products);
        res.status(200).json({ message: 'Products retrieved successfully', products });
      }
}