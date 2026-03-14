import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested, IsMongoId, MinLength, IsPositive, IsInt, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from "class-validator";
import { Type } from "class-transformer";
import { SortOrder, Types } from "mongoose";

@ValidatorConstraint({ name: 'discount-price', async: false })
export class DiscountLessThanBasePriceValidator implements ValidatorConstraintInterface {
    validate(discount: number, data: ValidationArguments) {
        return discount <= data.object['Price']
    }

    defaultMessage(): string {
        return 'Discount should be less than or equal to base price'
    }
}


export class CreateProductBodyDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  @MinLength(3,{message:'minLength at least 3 characters'})
  title: string;

  @IsString({ message: 'description must be a string' })
  @IsOptional()
  description?: string;

  @IsMongoId({ message: 'categoryId must be a valid Mongo ID' })
  @Type(() => Types.ObjectId)
  @IsNotEmpty({ message: 'categoryId is required' })
  categoryId: string;

  @IsMongoId({ message: 'subCategoryId must be a valid Mongo ID' })
  @Type(() => Types.ObjectId)
  @IsNotEmpty({ message: 'subCategoryId is required' })
  subCategoryId: string;

  @IsMongoId({ message: 'subsubCategoryId must be a valid Mongo ID' })
  @Type(() => Types.ObjectId)
  @IsNotEmpty({ message: 'subsubCategoryId is required' })
  subsubCategoryId: string;

  @IsMongoId({ message: 'brandId must be a valid Mongo ID' })
  @Type(() => Types.ObjectId)
  @IsNotEmpty({ message: 'brandId is required' })
  brandId: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Type(() => Number)
  Price: number;

  @IsNumber({}, { message: 'discount must be a number' })
  @Type(() => Number)
  @IsOptional()
  @Validate(DiscountLessThanBasePriceValidator)
  discount?: number;

  @IsNumber({}, { message: 'stock must be a number' })
  @Type(() => Number)
  @IsPositive({message:'Stock must be positive'})
  @IsInt({message:"Stock must be Integeer"})
  stock: number;
}


export class ListProductsQueryDto {

    
    @IsOptional()
    @IsInt({message:'Page must be an integer'})
    @Type(() => Number)
    @IsNotEmpty({message:'Limit should not be empty'})
    limit: number

    @IsOptional()
    @Type(() => Number)
    @IsInt({message:'Page must be an integer'})
    @MinLength(1,{message:'Page must be at least 1'})
    page: number = 1;


    @IsOptional()
    @IsString({message:'Sort must be a string'})
    sort: {[ key: string]: SortOrder}


    [key: string]: any;

}
