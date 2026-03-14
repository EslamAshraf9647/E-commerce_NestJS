import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import slugify from "slugify";
import { UploadCloudFileService } from "src/Common/Services";
import { BrandCategoryRepository, BrandRepository, CategoryRepository, ProductRepository, SubCategoryRepository, SubsubCategoryRepository } from "src/DB/Repositories";


@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly uploadCloudFileService:UploadCloudFileService,
        private readonly subCategoryRepository:SubCategoryRepository,
        private readonly subsubcategoryRepository:SubsubCategoryRepository,
        private readonly brandRepository:BrandRepository,
        private readonly productRepository:ProductRepository,
        private readonly brandCategoryRepository: BrandCategoryRepository,
  
    ) {}

    async createCategoryService({name, authUser, image}) {
        const Checkcategoryname = await this.categoryRepository.findOne({filters: {name}});
        if (Checkcategoryname) {
            throw new ConflictException('Category name already exists');
        }

        const category ={name,addBy: authUser.user._id,} 

      if(image){
          const folderId = Math.random().toString(36).substring(2,9)
          const imageResult= await this.uploadCloudFileService.uploadfile(image.path, 
             {folder:`${process.env.CLOUDINARY_FOLDER}/Category/${folderId}`, resource_type:'image'})
             
          category['image'] = imageResult
          category['folderId']= folderId
      }

        return this.categoryRepository.create(category);
    }

    async GetCategoryById (categoryId:string) { 
         if (!Types.ObjectId.isValid(categoryId)) {
              throw new BadRequestException('Invalid category id');
              }
        const category = await this.categoryRepository.findOne({filters: {_id: categoryId}})
        if(!category) {
            throw new NotFoundException('category not found')
        }

        return category
     
    }


    async updatecategoryService({name, categoryId, authUser, image}) {

          if (!Types.ObjectId.isValid(categoryId)) {
              throw new BadRequestException('Invalid category id');
              }

        // const category =await this.categoryRepository.findOne({filters: {_id: categoryId}})
        const category= await this.GetCategoryById(categoryId)
        if(!category) {
            throw new NotFoundException('category not found ')
        }

        if(name) {
             const Checkcategoryname = await this.categoryRepository.findOne({filters: {name}});
             if (Checkcategoryname) {
            throw new ConflictException('Category name already exists');
        }
        category.name= name 
        category.slug= slugify(name) 
        }

        if(image) {
            const oldPublicId= category.image['public_id'].split(`${category.folderId}/`)[1]
            const data= await this.uploadCloudFileService.uploadfile(image.path,
                {
                    folder:`${process.env.CLOUDINARY_FOLDER}/Category/${category.folderId}`,
                    public_id:oldPublicId
                }
            )
            category.image['secure_url']= data.secure_url
        }
        
        category.updatedBy= authUser.user._id
        return category.save()
    }

    async ListAllCategoryService() {
        return  this.categoryRepository.findMany({ filters: {} });  }
async deleteCategory(categoryId: Types.ObjectId) {
  if (!Types.ObjectId.isValid(categoryId)) {
    throw new BadRequestException('Invalid category id');
  }

  /* ======================
     1️⃣ GET DATA (folderId)
     ====================== */

  const category = await this.categoryRepository.findOne({
    filters: { _id: categoryId }
  });
  if (!category) throw new NotFoundException('Category not found');

  const subCategories = await this.subCategoryRepository.findMany({
    filters: { categoryId }
  });
  const subCategoryIds = subCategories.map(sc => sc._id);

  const subSubCategories = await this.subsubcategoryRepository.findMany({
    filters: { subCategoryId: { $in: subCategoryIds } }
  });
  const subSubCategoryIds = subSubCategories.map(ssc => ssc._id);

  const brands = await this.brandRepository.findMany({
    filters: { subSubCategoryId: { $in: subSubCategoryIds } }
  });

  const products = await this.productRepository.findMany({
    filters: { categoryId }
  });

  /* ======================
     2️⃣ DELETE FROM DATABASE
     ====================== */

  await this.productRepository.deleteMany({ categoryId });

  await this.brandCategoryRepository.deleteMany({
    subSubCategoryId: { $in: subSubCategoryIds }
  });

  await this.brandRepository.deleteMany({
    subSubCategoryId: { $in: subSubCategoryIds }
  });

  await this.subsubcategoryRepository.deleteMany({
    _id: { $in: subSubCategoryIds }
  });

  await this.subCategoryRepository.deleteMany({
    _id: { $in: subCategoryIds }
  });

  await this.categoryRepository.deleteOne({
    _id: categoryId
  });

  /* ======================
     3️⃣ DELETE FROM CLOUDINARY (BY PREFIX)
     ====================== */

  // Products
  for (const product of products) {
    if (product.folderId) {
      await this.uploadCloudFileService.deleteFolderByPrefix(
        `${process.env.CLOUDINARY_FOLDER}/Product/${product.folderId}`
      );
    }
  }

  // Brands
  for (const brand of brands) {
    if (brand.folderId) {
      await this.uploadCloudFileService.deleteFolderByPrefix(
        `${process.env.CLOUDINARY_FOLDER}/Brand/${brand.folderId}`
      );
    }
  }

  // SubSubCategories
  for (const subSub of subSubCategories) {
    if (subSub.folderId) {
      await this.uploadCloudFileService.deleteFolderByPrefix(
        `${process.env.CLOUDINARY_FOLDER}/Sub-SubCategory/${subSub.folderId}`
      );
    }
  }

  // SubCategories
  for (const subCategory of subCategories) {
    if (subCategory.folderId) {
      await this.uploadCloudFileService.deleteFolderByPrefix(
        `${process.env.CLOUDINARY_FOLDER}/Sub-Category/${subCategory.folderId}`
      );
    }
  }

  // Category
  if (category.folderId) {
    await this.uploadCloudFileService.deleteFolderByPrefix(
      `${process.env.CLOUDINARY_FOLDER}/Category/${category.folderId}`
    );
  }

  return true;
}
}