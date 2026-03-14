

export const FilterMapper = (filters) => {
    return JSON.parse(JSON.stringify(filters).replace(/lt|lte|gt|gte|regex/g, match => `$${match}`))
}



export const mapPriceToFinalPrice = (filters: any) => {
       if (filters.price) {
           filters.finalPrice = filters.price;
             delete filters.price;
         }
  return filters;
};


