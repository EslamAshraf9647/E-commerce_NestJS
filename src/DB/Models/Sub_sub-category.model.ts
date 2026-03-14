import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';
import { SubCategory } from './sub-category.model';

@Schema({ timestamps: true })
export class SubsubCategory {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'Sub_sub-category_name_idx', unique: true },
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name);
    },
    lowercase: true,
    trim: true,
    // index: { name: 'sub_category_slug_idx', unique: true },
  })
  slug: string;

  @Prop({
    type: Types.ObjectId,
    ref: SubCategory.name,
    required: true,
  })
  SubcategoryId: string | Types.ObjectId;

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

const SubsubCategorySchema = SchemaFactory.createForClass(SubsubCategory);

export const SubsubCategoryModel = MongooseModule.forFeature([{ name: SubsubCategory.name, schema: SubsubCategorySchema },]);

export type SubsubCategoryType = HydratedDocument<SubsubCategory> & Document;
