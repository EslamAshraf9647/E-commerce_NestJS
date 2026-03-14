import { NextFunction, Request, Response } from 'express';
import * as qs from 'qs';

export const RequestQueryParseMiddleware = (req:Request, res:Response, next:NextFunction) => {
    req['parsedQuery'] = qs.parse(req.query)
    next()
}