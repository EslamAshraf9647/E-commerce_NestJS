import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import slugify from "slugify";
import { UploadCloudFileService } from "src/Common/Services";
import { CategoryRepository, SubCategoryRepository } from "src/DB/Repositories";



@Injectable()
export class SubCategoryService {
    constructor(
        private readonly subCategoryRepository: SubCategoryRepository,
        private readonly uploadCloudFileService: UploadCloudFileService,
        private readonly categoryRepository: CategoryRepository
    ) {}

    async CreateSubCategoryService({name, authUser,categoryId, image}) {
         if (!Types.ObjectId.isValid(categoryId)) {
                  throw new BadRequestException('Invalid Category id');
                  }
            const Category = await this.categoryRepository.findOne({filters: {_id: categoryId}})
            if(!Category) {
                throw new NotFoundException('Category not found')
            }
        const CheckSubcategoryname = await this.subCategoryRepository.findOne({filters: {name}});
          if (CheckSubcategoryname) {
            throw new ConflictException('SubCategory name already exists');
        }

          const subCategory = {
                  name,
                  categoryId: Types.ObjectId.createFromHexString(categoryId),
                  addBy: authUser.user._id,
           };

      if(image){
          const folderId = Math.random().toString(36).substring(2,9)
          const imageResult= await this.uploadCloudFileService.uploadfile(image.path, 
             {folder:`${process.env.CLOUDINARY_FOLDER}/Sub-Category/${folderId}`,
              resource_type:'image'})
             
          subCategory['image'] = imageResult
          subCategory['folderId']= folderId
      }
        return this.subCategoryRepository.create(subCategory);
    }

    async GetSubCategoryById (SubCategoryId:string) { 
             if (!Types.ObjectId.isValid(SubCategoryId)) {
                  throw new BadRequestException('Invalid SubCategory id');
                  }
            const SubCategory = await this.subCategoryRepository.findOne({filters: {_id: SubCategoryId}})
            if(!SubCategory) {
                throw new NotFoundException('SubCategory not found')
            }
            return SubCategory
        }

    async updateSubCategoryService({name, SubCategoryId, authUser, image}) {
    
              if (!Types.ObjectId.isValid(SubCategoryId)) {
                  throw new BadRequestException('Invalid SubCategory id');
                  }
    
            const SubCategory= await this.GetSubCategoryById(SubCategoryId)
            if(!SubCategory) {
                throw new NotFoundException('SubCategory not found ')  
            }
    
            if(name) {
                 const Checkcategoryname = await this.subCategoryRepository.findOne({filters: {name}});
                 if (Checkcategoryname) {
                throw new ConflictException('SubCategory name already exists');
            }
            SubCategory.name= name 
            SubCategory.slug= slugify(name) 
            }
    
            if(image) {
                const oldPublicId= SubCategory.image['public_id'].split(`${SubCategory.folderId}/`)[1]
                const data= await this.uploadCloudFileService.uploadfile(image.path,
                    {
                        folder:`${process.env.CLOUDINARY_FOLDER}/Sub-Category/${SubCategory.folderId}`,
                         resource_type:'image',
                        public_id:oldPublicId
                    }
                )
                SubCategory.image['secure_url']= data.secure_url
            }
            
            SubCategory.updatedBy= authUser.user._id
            return SubCategory.save()
        }

    async ListAllSubCategoryService() {
        return  this.subCategoryRepository.findMany({ filters: {} });  }


}