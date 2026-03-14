import { Body, Controller, Post, Res } from "@nestjs/common";
import { BrandCategoryService } from "../Services/brandcategory.service";
import { Auth, Authuser } from "src/Common/Decorators";
import { CreateBrandCategoryBodyDto } from "../DTO/brandcategory.dto";
import type  { IAuthUser } from "src/Common/Types/interfaces";
import type { Response } from "express";



@Controller('brand-category')
export class BrandCategoryController {  
    constructor(private readonly brandCategoryService: BrandCategoryService) {}

    @Post('create')
    @Auth('admin')
    async CreateBrandCategoryHandler(
        @Body() body: CreateBrandCategoryBodyDto,
        @Authuser() authUser: IAuthUser,
        @Res() res: Response
    ) {
        const result = await this.brandCategoryService.CreateBrandCategory({body, authuser: authUser});
        res.status(201).json({message: "BrandCategory created successfully", result})
    }


}