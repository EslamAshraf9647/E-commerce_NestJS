import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { Brand, Category, SubCategory, SubsubCategory, User } from ".";




@Schema({timestamps: true})
export class Product {

    @Prop({
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index:{name:"product_name_idx"}
    })
    title:string

      @Prop({
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index:{name:"product_slug_idx" , unique: true},
        default: function() {return slugify(this.title)}
    })
    slug:string

    @Prop({
        type: String,
    })
    description: string
    
    @Prop({
        type:[{secure_url:{type: String, required: true }, public_id:{type: String, required: true}}]
    })
    images: {secure_url: string , public_id: string} []

    @Prop({type: Types.ObjectId,ref: User.name})
       addBy: string | Types.ObjectId;
    
    @Prop({type: Types.ObjectId,ref: User.name, })
       updatedBy: string | Types.ObjectId;
    
    @Prop({type: String})
      folderId: string

     @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    required: true,
    index: true,
  })
  categoryId: string |Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: SubCategory.name,
    required: true,
    index: true,
  })
  subCategoryId: string |Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: SubsubCategory.name,
    required: true,
    index: true,
  })
  subsubCategoryId: string |Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Brand.name,
    required: true,
    index: true,
  })
  brandId: string |Types.ObjectId;

  @Prop({
    type: Number,
    required: true
  })
  Price: number

  @Prop({
    type: Number
  })
  discount: number

  @Prop({
    type: Number,
    default: function() {
        return this.Price - (this.Price  * ( (this.discount || 0)) /100)
    }
  })
  finalPrice: number

  @Prop({
    type: Number,
    required: true,
    min: 1
  })
  stock: number

  @Prop({
    type: Number,
    default: 0
  })
  overallRating: number
}

const productSchema= SchemaFactory.createForClass(Product)

export const ProductModel= MongooseModule.forFeature([{name: Product.name , schema: productSchema}])

export type ProductType = HydratedDocument<Product> & Document 