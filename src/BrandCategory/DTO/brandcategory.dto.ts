import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateBrandCategoryBodyDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'brandId must be a valid MongoDB ObjectId' })
  brandId: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'subSubCategoryId must be a valid MongoDB ObjectId' })
  subSubCategoryId: string;
}