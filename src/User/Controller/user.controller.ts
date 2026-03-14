import { Body, Controller, Get, Param, Patch, Res } from "@nestjs/common";
import { UserService } from "../Service/user.service";
import type { IAuthUser } from "src/Common/Types";
import { Auth, Authuser } from "src/Common/Decorators";
import { ChangePasswordDto, UpdateUserAccountDto } from "../DTO/user.bto";
import { RolesEnum } from "src/Common/Types";
import type { Response } from "express";



@Controller('user')
export class UserController{
    constructor(
        private readonly userService: UserService
    ){}

    @Patch('update/:userId')
    @Auth(RolesEnum.USER)
    async UpadteUserAccountHandler(
        @Body() body: UpdateUserAccountDto,
        @Param('userId') userId: string,
        @Authuser() authUser: IAuthUser,
        @Res() res: Response,
    ){
        const result = await this.userService.UpdateUserAccountService(body , authUser)

        res.status(200).json({message:"User Account Updated Sucessfully" , result})
    }

    @Get('profile/:userId')
    @Auth(RolesEnum.USER)
    async getUserProfileHandler(
        @Param('userId') userId: string,
        @Authuser() authUser: IAuthUser
    ){
        const result = await this.userService.getUserProfile(userId , authUser)
        return {result}
    } 

    @Patch('changePassword')
    @Auth(RolesEnum.USER)
    async ChangePasswordHandler(
        @Body() body: ChangePasswordDto,
        @Authuser() authUser: IAuthUser,
        @Res() res: Response
    ){
        const result = await this.userService.ChangePasswordService(body , authUser)
        return res.status(200).json({message:"Password Changed Successfully"})

    }
}