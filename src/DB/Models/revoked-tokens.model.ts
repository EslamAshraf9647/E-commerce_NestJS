import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.model';

@Schema({ timestamps: true })
export class RevokedTokens {
  @Prop({
    type: String,
    required: true,
  })
  tokenId: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  userId: string | Types.ObjectId;

  @Prop({
    type: Date,
    required: true,
  })
  expiryDate: Date;
}

const RevokedTokensShema = SchemaFactory.createForClass(RevokedTokens);

export const RevokedTokensModel = MongooseModule.forFeature([
  { name: RevokedTokens.name, schema: RevokedTokensShema },
]);

export type RevokedTokensType = HydratedDocument<RevokedTokens> & Document;
