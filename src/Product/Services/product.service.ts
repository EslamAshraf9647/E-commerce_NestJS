import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { BrandService } from "src/Brand/Services/brand.service";
import { CategoryService } from "src/Category/Services/category.service";
import { UploadCloudFileService } from "src/Common/Services";
import { ProductRepository, } from "src/DB/Repositories";
import { SubCategoryService } from "src/Sub-Category/Services/sub-category.service";
import { SubsubcategoryService } from "src/Sub_subCategory/Services/sub-sub-category.service";
import { ListProductsQueryDto } from "../DTO/product.dto";
import { FilterMapper } from "src/Common/Utils";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";


@Injectable()
export class ProductService{
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryService: CategoryService,
        private readonly subCategoryService: SubCategoryService,
        private readonly subsubCategoryService:SubsubcategoryService,
        private readonly brandService: BrandService,
        private readonly uploadCloudFileService: UploadCloudFileService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ){}

    async CreateProductService({body, authUser,files}) {
        const addedBy= authUser.user._id
        const { title, description, stock, categoryId, subCategoryId, subsubCategoryId, brandId, Price, discount } = body;

        const category = await this.categoryService.GetCategoryById(categoryId);
          if (!category) throw new NotFoundException('Category not found');

        const subCategory = await this.subCategoryService.GetSubCategoryById(subCategoryId);
         if (!subCategory) throw new NotFoundException('SubCategory not found');

       const subsubCategory = await this.subsubCategoryService.GetSubsubCategoryById(subsubCategoryId);
        if (!subsubCategory) throw new NotFoundException('SubSubCategory not found');

       const brand = await this.brandService.GetBrandById(brandId);
       if (!brand) throw new NotFoundException('Brand not found');

      const Product = {
        title,
        description,
        stock,
        categoryId: Types.ObjectId.createFromHexString(categoryId),
        subCategoryId: Types.ObjectId.createFromHexString(subCategoryId),
        subsubCategoryId: Types.ObjectId.createFromHexString(subsubCategoryId),
        brandId: Types.ObjectId.createFromHexString(brandId),
        Price,
        discount,
        addedBy
  };

  if (!files?.length) throw new BadRequestException('No files uploaded');

  const folderId= Math.random().toString(36).substring(2,9)
  const folder =`${process.env.CLOUDINARY_FOLDER}/Product/${folderId}`;
  const paths= files.map(file => file.path)
  Product['images']= await this.uploadCloudFileService.uploadfiles(paths, {folder})
  Product['folderId']= folderId

  return await this.productRepository.create(Product)
}

  async buildProductsList(){
    const products = await this.productRepository.find()
    const data = await this.cacheManager.set('list-products' , products, 5000 )
        // const Data = await this.cacheManager.del('list-products'  )
        // await this.cacheManager.clear()
    return data 
  }


  async listProductsService(query:ListProductsQueryDto ) {
    
    const products = await this.cacheManager.get('list-products')
    console.log(products);
    return products
  }

    // const { limit , page , sort , ...filters} = query   
    // const skip = (page - 1) * limit;

    //   if (filters.price) {
    //     filters.finalPrice = filters.price; 
    //     delete filters.price;
    //  }

    // const options ={
    //   limit,
    //   skip,
    //   sort,
    //   filters:FilterMapper(filters)
    // }
    
    //  return await this.productRepository.findMany(options);
    
  
 }