import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';
import { Category } from './category.model';

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'sub_category_name_idx', unique: true },
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name);
    },
    lowercase: true,
    trim: true,
    index: { name: 'sub_category_slug_idx', unique: true },
  })
  slug: string;

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  categoryId: string | Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  addBy: string | Types.ObjectId;

  @Prop({
    type: Object,
  })
  image: object; 

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  updatedBy: string | Types.ObjectId;


  @Prop({type: String})
  folderId: string

  
}

const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

export const SubCategoryModel = MongooseModule.forFeature([{ name: SubCategory.name, schema: SubCategorySchema },]);

export type SubCategoryType = HydratedDocument<SubCategory> & Document;
