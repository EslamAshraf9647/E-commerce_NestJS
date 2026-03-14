import {
  DeleteResult,
  Document,
  Model,
  PopulateOptions,
  QueryFilter,
  SortOrder,
  UpdateQuery,
} from 'mongoose';

interface IFindOneOptions<TDocument> {
  filters: QueryFilter<TDocument>;
  select?: string;
  populateArray?: PopulateOptions[];
}

interface IFindManyOptions<TDocument> {
  filters?: QueryFilter<TDocument>;
  select?: string;
  populateArray?: PopulateOptions[];
  limit?: number;
  skip?: number;
  sort?:{[key:string]: SortOrder}
}


export interface IFindOptions<TDocument> {
  filters?: QueryFilter<TDocument>;
  select?: string;
  populateArray?: PopulateOptions[];
  sort?: Record<string, SortOrder>;
  limit?: number;
  skip?: number;
}

export abstract class BaseService<TDocument extends Document> {
  constructor(private readonly model: Model<TDocument>) {}

  async save(newDocument: TDocument) {
    return await newDocument.save();
  }

  async create(
    document: Parameters<Model<TDocument>['create']>[0],
  ): Promise<TDocument> {
    return this.model.create(document);
  }

//   async create(
//   document: Parameters<Model<TDocument>['create']>[0],
//   options?: { session?: any }
// ): Promise<TDocument> {
//   return this.model.create([document], options).then(res => res[0]);
// }

async find(options?: IFindOptions<TDocument>): Promise<TDocument[]> {

  const {filters = {},select,populateArray,sort,limit,skip} = options || {};

  let query = this.model.find(filters);

  if (select) {query.select(select)}
 if (populateArray?.length) {query.populate(populateArray)}
  if (sort) {query.sort(sort)}
  if (limit) {query.limit(limit);}
  if (skip) {query.skip(skip)}
  return await query.exec();
}

  async findOne({
    filters,
    select = '',
    populateArray = [],
  }: IFindOneOptions<TDocument>): Promise<TDocument | null> {
    if (filters._id)
      return await this.model
        .findById(filters._id, select)
        .populate(populateArray);
    return await this.model.findOne(filters, select).populate(populateArray);
  }

  async findMany({
    filters = {},
    select = '',
    populateArray = [],
    limit=10,
    skip=0,
    sort,
  }: IFindManyOptions<TDocument>): Promise<TDocument[]> {
    // return await this.model.find(filters, select).populate(populateArray);

    let query = this.model.find(filters)
    if (populateArray?.length) {
          query.populate(populateArray);
      }
    if(select) query.select(select)
    if(limit || skip) query.limit(limit).skip(skip)
    if(sort) query.sort(sort)


    return await query
  }

  async deleteOne(filters: QueryFilter<TDocument>) {
    if (filters._id) return await this.model.findByIdAndDelete(filters._id);
    return await this.model.findOneAndDelete(filters);
  }

  async deleteMany(filters: QueryFilter<TDocument>): Promise<DeleteResult> {
    return await this.model.deleteMany(filters);
  }

  async updateOne(
    filters: QueryFilter<TDocument>,
    updateData: UpdateQuery<TDocument>,
    populateArray?: any
  ) {
    if (filters._id)
      return await this.model.findByIdAndUpdate(filters._id, updateData, {new: true}).populate(populateArray);
    return await this.model.findOneAndUpdate(filters, updateData, {new: true}).populate(populateArray);
  }
}
