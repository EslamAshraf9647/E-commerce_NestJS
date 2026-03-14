import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RevokedTokens, RevokedTokensType } from '../Models';

@Injectable()
export class RevokedTokensRepository extends BaseService<RevokedTokensType> {
  constructor(
    @InjectModel(RevokedTokens.name)
    private readonly revokedTokensModel: Model<RevokedTokensType>,
  ) {
    super(revokedTokensModel);
  }
}
