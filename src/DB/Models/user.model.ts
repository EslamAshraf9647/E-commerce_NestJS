// class schema

import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Encrypt, Hash } from 'src/Common/Security';
import { GenderEnum, RolesEnum } from 'src/Common/Types';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    index: { name: 'email_unique_idx', unique: true },
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    enum: RolesEnum,
    default: RolesEnum.USER,
  })
  role: string;

  @Prop({
    type: String,
    enum: GenderEnum,
  })
  gender: string;

  @Prop({
    type: Date,
  })
  DOB: Date;

  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  phoneNumber: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isEmailVerified: boolean;
}

// create acutal schema

const userSchema = SchemaFactory.createForClass(User);

// pre-save hook
userSchema.pre('save', async function () {
  const Changes = this.getChanges()?.['$set'];
  if (Changes?.password) {
    this.password = Hash(this.password);
  }

  if (Changes?.phoneNumber) {
    this.phoneNumber = Encrypt(
      this.phoneNumber,
      process.env.ENCRYPTION_KEY as string,
    );
  }
});


// userSchema.index({email: 1}, {unique: true , name: "unique_Email_Index"});

// create model

export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);

//Type

export type UserType = HydratedDocument<User> & Document;
