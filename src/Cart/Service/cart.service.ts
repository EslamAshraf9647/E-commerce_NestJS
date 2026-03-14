import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CartRepository, ProductRepository } from "src/DB/Repositories";



@Injectable()
export class CartService{
    constructor(
        private readonly cartRepository:CartRepository,
        private readonly productRepository:ProductRepository
    ) {}

    async AddtoCartService({body, authUser}){
        const {productId , quantity} = body
        const userId = authUser.user._id

        const product = await this.productRepository.findOne({filters:{_id: productId}})
        if(!product) throw new NotFoundException('product Not Found')

        if(quantity > product.stock) throw new BadRequestException('Not enough quantity')

        const userCart = await this.cartRepository.findOne({filters:{userId}})
        if(!userCart) {
            return await this.cartRepository.create({
                userId,
                products:[{productId, quantity, finalPrice: product.finalPrice}]
            })
        }

        const isProductAdd = userCart.products.find(product => product.productId.equals(productId))
        if(isProductAdd) {
            throw new BadRequestException('product Already added to cart')
        }

        userCart.products.push({productId, quantity, finalPrice: product.finalPrice});
        return await userCart.save();

        // userCart.products.push({productId, quantity , finalPrice: product.finalPrice})
        // await this.productRepository.decrementProductStock( userCart.products)
        // return await userCart.save()
    }

    async RemoveFromCart({productId, authUser}){
        const userId = authUser.user._id

        const product = await this.productRepository.findOne({filters:{_id:productId}})
        if(!product) throw new NotFoundException('product Not Found')

        const userCart = await this.cartRepository.findOne({filters:{userId,'products.productId': productId}})
        if(!userCart) throw new NotFoundException("Cart Not Found")

        userCart.products = userCart.products.filter(product => !product.productId.equals(productId))
        return await userCart.save()
    }

    async updateCartQuantity({productId, quantity, authUser}){
        const userId = authUser.user._id
    
        const product = await this.productRepository.findOne({filters:{_id:productId}})
        if(!product) throw new NotFoundException('product Not Found')
        if(quantity > product.stock) throw new BadRequestException('Not enough quantity')

        const userCart = await this.cartRepository.findOne({filters:{userId,'products.productId': productId}})
        if(!userCart) throw new NotFoundException("Cart Not Found")

        userCart.products.find(product => {
            if(product.productId.equals(productId)){
                product.quantity = quantity
                return product
            }
        })
        return await userCart.save()
    }

    async getMyCart({authUser}){
        const userId = authUser.user._id
        return await this.cartRepository.findOne({filters:{userId} , select : "products subTotal" })

    
    }
}