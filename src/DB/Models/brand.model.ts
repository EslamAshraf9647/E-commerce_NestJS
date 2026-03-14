import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { SubsubCategory, User } from ".";


@Schema({timestamps: true})
export class Brand {

    @Prop({
        type: String,
        lowercase:true,
        trim:true

    })
    name:string

     @Prop({
        type: String,
        default: function () {
          return slugify(this.name);
        },
        lowercase: true,
        trim: true,
      })
      slug: string;

      // @Prop({
      //     type: Types.ObjectId,
      //     ref: SubsubCategory.name,
      //     required: true,
      //   })
      //   SubsubcategoryId: string | Types.ObjectId;

    @Prop({type: Types.ObjectId,
           ref: User.name, required: true})
         addBy: string | Types.ObjectId;
      
    @Prop({type: Types.ObjectId,
           ref: User.name, })
         updatedBy: string | Types.ObjectId;
      
    @Prop({type: Object,})
        image: object;
      
    @Prop({type: String})
        folderId: string
}

const brandSchema = SchemaFactory.createForClass(Brand)

export const BrandModel = MongooseModule.forFeature([{name: Brand.name , schema: brandSchema}])

export type BrandType = HydratedDocument<Brand> & Document 


