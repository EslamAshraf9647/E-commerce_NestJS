import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CompareHash, Decrypt, Hash } from "src/Common/Security";
import { IAuthUser } from "src/Common/Types";
import { UserRepository } from "src/DB/Repositories";
import { ChangePasswordDto } from "../DTO/user.bto";



@Injectable()
export class UserService{
    constructor(
        private readonly userRepository: UserRepository
    ){}

    async UpdateUserAccountService(body , authUser,){
        const userId = authUser.user._id
        const {DOB, phoneNumber, lastName, firstName} = body 

        const user = await this.userRepository.findOne({filters:{_id: userId}})
        if(!user) throw new NotFoundException('user not found')
        
        if(firstName) user.firstName = firstName
        if(lastName) user.lastName = lastName 
        if(DOB) user.DOB = DOB

        if (phoneNumber) { 
        const phoneMatches  = CompareHash(phoneNumber , user.phoneNumber)
        if(!phoneMatches ) throw new ConflictException('phone already exsist')
        const phoneExist = await this.userRepository.findOne({filters: {phoneNumber}})

    if (phoneExist && phoneExist._id.toString() !== userId.toString()) {
          throw new BadRequestException("phone already exists")
   }
      user.phoneNumber = phoneNumber
}
        await user.save()
        return user 
    }

    async getUserProfile(userId: string , authUser : IAuthUser) {
    const user = await this.userRepository.findOne({
      filters: { _id: userId },
      select: 'firstName lastName email phoneNumber DOB '
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const plainPhoneNumber = user.phoneNumber
      ? Decrypt(user.phoneNumber, process.env.ENCRYPTION_KEY!)
      : null;

    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: plainPhoneNumber,
      DOB: user.DOB,
    };
  }

  async ChangePasswordService(body, authUser: IAuthUser){

    const {oldPassword , newPassword , confirmPassword} = body 
    const userId= authUser.user._id

    const user = await this.userRepository.findOne(
        {filters:{_id: userId},
        select: 'password'
    },
    )
    if(!user) throw new NotFoundException('user not found ')

    const isPasswordMatched = CompareHash(oldPassword, user.password)
    if(!isPasswordMatched) throw new BadRequestException('Invalid Password')
        
    user.password =newPassword

    await user.save()

  }


}