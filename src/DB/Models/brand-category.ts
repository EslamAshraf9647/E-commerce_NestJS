import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Brand } from "./brand.model";
import { SubsubCategory } from "./Sub_sub-category.model";
import { User } from ".";




@Schema({timestamps: true})
export class BrandCategory {
  @Prop({ type: Types.ObjectId,
     ref: Brand.name,
    required: true })
    brandId: Types.ObjectId;

  @Prop({ type: Types.ObjectId,
     ref: SubsubCategory.name,
      required: true })
     subSubCategoryId: Types.ObjectId;

     @Prop({ type: Types.ObjectId,
         ref: User.name,
         required: true })
     addedBy: Types.ObjectId;
}


const brandCategorySchema = SchemaFactory.createForClass(BrandCategory);

brandCategorySchema.index({ brandId: 1, subSubCategoryId: 1 },{ unique: true });

export const BrandCategoryModel = MongooseModule.forFeature([{ name: BrandCategory.name, schema: brandCategorySchema }]); 

export type BrandCategoryType = BrandCategory & Document
