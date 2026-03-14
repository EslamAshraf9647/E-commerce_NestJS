import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';


@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    // index: { name: 'category_name_idx', unique: true },
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name);
    },
    lowercase: true,
    trim: true,
    index: { name: 'category_slug_idx', unique: true },
  })
  slug: string;

  @Prop({type: Types.ObjectId,ref: User.name, required: true})
   addBy: string | Types.ObjectId;

   @Prop({type: Types.ObjectId,ref: User.name, })
   updatedBy: string | Types.ObjectId;

  @Prop({type: Object,})
  image: object;

  @Prop({type: String})
  folderId: string
}

const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({name:1}, {unique:true , name:"uniqu_name_idx"})

export const CategoryModel = MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema },]);

export type CategoryType = HydratedDocument<Category> & Document;
