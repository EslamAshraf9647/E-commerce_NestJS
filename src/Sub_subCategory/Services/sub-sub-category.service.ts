import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import slugify from "slugify";
import { UploadCloudFileService } from "src/Common/Services";
import { CategoryRepository, SubCategoryRepository } from "src/DB/Repositories";
import { SubsubCategoryRepository } from "src/DB/Repositories/Sub_sub-category.repository";



@Injectable()
export class SubsubcategoryService{
    constructor(
        private readonly subsubcategoryRepository:SubsubCategoryRepository,
        private readonly uploadCloudFileService: UploadCloudFileService,
        private readonly subcategoryRepository: SubCategoryRepository,
    ){}

     async CreateSubsubCategoryService({name, authUser,SubcategoryId, image}) {
             if (!Types.ObjectId.isValid(SubcategoryId)) {
                      throw new BadRequestException('Invalid Subcategory id');
                      }
                const SubCategory = await this.subcategoryRepository.findOne({filters: {_id: SubcategoryId}})
                if(!SubCategory) {
                    throw new NotFoundException('Subcategory not found')
                }
            const CheckSubsubcategoryname = await this.subsubcategoryRepository.findOne({filters: {name}});
              if (CheckSubsubcategoryname) {
                throw new ConflictException('SubsubCategory name already exists');
            }  
    
              const SubsubCategory = {
                      name,
                      SubcategoryId:Types.ObjectId.createFromHexString(SubcategoryId),
                      addBy: authUser.user._id,
               };
    
          if(image){
              const folderId = Math.random().toString(36).substring(2,9)
              const imageResult= await this.uploadCloudFileService.uploadfile(image.path, 
                 {folder:`${process.env.CLOUDINARY_FOLDER}/Sub-subCategory/${folderId}`,
                  resource_type:'image'})
                 
              SubsubCategory['image'] = imageResult
              SubsubCategory['folderId']= folderId
          }
            return this.subsubcategoryRepository.create(SubsubCategory);
        }

     async GetSubsubCategoryById (SubsubCategoryId:string) { 
                 if (!Types.ObjectId.isValid(SubsubCategoryId)) {
                      throw new BadRequestException('Invalid SubsubCategory id');
                      }
                const SubsubCategory = await this.subsubcategoryRepository.findOne({filters: {_id: SubsubCategoryId}})
                if(!SubsubCategory) {
                    throw new NotFoundException('SubsubCategory not found')
                }
                return SubsubCategory
            }

      async updateSubsubCategoryService({name, SubsubCategoryId, authUser, image}) {
         
                   if (!Types.ObjectId.isValid(SubsubCategoryId)) {
                       throw new BadRequestException('Invalid SubsubCategory id');
                       }
         
                 const SubsubCategory= await this.GetSubsubCategoryById(SubsubCategoryId)
                 if(!SubsubCategory) {
                     throw new NotFoundException('SubsubCategory not found ')
                 }
         
                 if(name) {
                      const Checkcategoryname = await this.subsubcategoryRepository.findOne({filters: {name}});
                      if (Checkcategoryname) {
                     throw new ConflictException('SubsubCategory name already exists');
                 }
                 SubsubCategory.name= name 
                 SubsubCategory.slug= slugify(name) 
                 }

                  const SubCategory = await this.subcategoryRepository.findOne({filters: {_id:SubsubCategory.SubcategoryId}})
                if(!SubCategory) {
                    throw new NotFoundException('Subcategory not found')
                }
         
                 if(image) {
                     const oldPublicId= SubsubCategory.image['public_id'].split(`${SubsubCategory.folderId}/`)[1]
                     const data= await this.uploadCloudFileService.uploadfile(image.path,
                         {
                            folder:`${process.env.CLOUDINARY_FOLDER}/Sub-subCategory/${SubsubCategory.folderId}`,
                             resource_type:'image',
                             public_id:oldPublicId
                         }
                     )
                     SubsubCategory.image['secure_url']= data.secure_url
                 }
                 
                 SubsubCategory.updatedBy= authUser.user._id
                 return SubsubCategory.save()
             }
        
      async ListAllSubsubCategoryService() {
        return  this.subsubcategoryRepository.findMany({ filters: {} });  }
}