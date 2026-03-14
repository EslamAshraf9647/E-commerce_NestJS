import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "../base.service";
import { Model } from "mongoose";
import { Cart, CartType } from "../Models";


@Injectable()
export class CartRepository extends BaseService<CartType> {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartType>,
  ) {
    super(cartModel);
  }
}
