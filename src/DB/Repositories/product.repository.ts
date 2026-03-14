import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductType } from '../Models';
import { RealTimeGateway } from 'src/Common/GateWays/websocket.getway';


@Injectable()
export class ProductRepository extends BaseService<ProductType> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductType>,
    private readonly realTimeGateway: RealTimeGateway,
  ) {
    super(productModel);
  }

  async decrementProductStock(products) {
    for (const product of products) {
        const isProductUpdated = await this.updateOne({_id: product.productId}, { $inc: { stock: -product.quantity } }); 
        if (!isProductUpdated)  continue;
        this.realTimeGateway.emitProductStockUpdate(product.productId, isProductUpdated.stock);
    }
  }

  async IncrementProductStock(products) {
    for (const product of products) {
        const isProductUpdated = await this.updateOne({_id: product.productId}, { $inc: { stock: product.quantity } }); 
        if (!isProductUpdated)  continue;
        this.realTimeGateway.emitProductStockUpdate(product.productId, isProductUpdated.stock);
    }
}
}
