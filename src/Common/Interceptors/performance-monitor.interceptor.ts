import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";


@Injectable()
export class PerformanceMonitorInterceptors implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const start = Date.now() 
        console.log(`Start Time: ${start}`);
        
        return next.handle().pipe(
            tap(() => {
                const end = Date.now()
                console.log(`Excution Time ${end - start}ms`);
                
            })
        )
    }
}