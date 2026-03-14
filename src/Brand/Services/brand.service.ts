import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import slugify from "slugify";
import { UploadCloudFileService } from "src/Common/Services";
import { CategoryRepository, SubCategoryRepository, SubsubCategoryRepository } from "src/DB/Repositories";
import { BrandRepository } from "src/DB/Repositories/brand.repository";




@Injectable() 
export class BrandService{
    constructor(
        private readonly brandRepository:BrandRepository,
        private readonly uploadCloudFileService:UploadCloudFileService, 
    ){}

        async CreateBrandService({name, authUser, image}){
        //     if (!Types.ObjectId.isValid(SubsubcategoryId)) {
        //               throw new BadRequestException('Invalid Subsubcategory id');
        //               }
        //  const SubsubCategory = await this.subsubCategoryRepository.findOne({filters:{_id:SubsubcategoryId}})
        //  if(!SubsubCategory){
        //     throw new NotFoundException('Subsubcategory id not found')
        //  }
         const Checkbrandname = await this.brandRepository.findOne({filters: {name}});
                       if (Checkbrandname) {
                         throw new ConflictException('Brand name already exists');
                     }

         const Brand = {
                      name,
                    //   SubsubcategoryId:Types.ObjectId.createFromHexString(SubsubcategoryId),
                      addBy: authUser.user._id,
               };

        if(image){
              const folderId = Math.random().toString(36).substring(2,9)
              const imageResult= await this.uploadCloudFileService.uploadfile(image.path, 
                 {folder:`${process.env.CLOUDINARY_FOLDER}/Brand/${folderId}`,
                  resource_type:'image'})
                 
              Brand['image'] = imageResult
              Brand['folderId']= folderId
          }

          return await this.brandRepository.create(Brand)
        }

        async GetBrandById (brandId:string) { 
                 if (!Types.ObjectId.isValid(brandId)) {
                      throw new BadRequestException('Invalid Brand id');
                      }
                const Brand = await this.brandRepository.findOne({filters: {_id: brandId}})
                if(!Brand) {
                    throw new NotFoundException('Brand not found')
                }
                return Brand
            }

         async updateBrandService({name, BrandId, authUser, image}) {
                 
                           if (!Types.ObjectId.isValid(BrandId)) {
                               throw new BadRequestException('Invalid Brand id');
                               }
                 
                         const Brand= await this.GetBrandById(BrandId)
                         if(!Brand) {
                             throw new NotFoundException('Brand Id not found ')
                         }
                 
                         if(name) {
                              const Checkbrandname = await this.brandRepository.findOne({filters: {name}});
                              if (Checkbrandname) {
                             throw new ConflictException('Brand name already exists');
                         }
                         Brand.name= name 
                         Brand.slug= slugify(name) 
                            }
                 
                         if(image) {
                             const oldPublicId= Brand.image['public_id'].split(`${Brand.folderId}/`)[1]
                             const data= await this.uploadCloudFileService.uploadfile(image.path,
                                 {
                                     folder:`${process.env.CLOUDINARY_FOLDER}/Brand/${Brand.folderId}`,
                                      resource_type:'image',
                                    public_id:oldPublicId
                                 }
                             )
                             Brand.image['secure_url']= data.secure_url
                         }
                         
                         Brand.updatedBy= authUser.user._id
                         return Brand.save()
                     }

        async ListAllBrandService() {
        return  this.brandRepository.findMany({ filters: {} });  }
}

