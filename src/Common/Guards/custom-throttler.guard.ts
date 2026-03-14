import { ThrottlerGuard, ThrottlerException, ThrottlerLimitDetail } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    { limit, ttl }: ThrottlerLimitDetail, // destructure the object
  ): Promise<void> {
    throw new ThrottlerException(
      `too many requests from this IP Please try again after ${ttl} seconds.`,
    );
  }

protected async handleRequest(requestProps) {
    const result = await super.handleRequest(requestProps);

    const { context } = requestProps;
    const res = context.switchToHttp().getResponse();

    res.removeHeader('X-RateLimit-Limit');
    res.removeHeader('X-RateLimit-Remaining');
    res.removeHeader('X-RateLimit-Reset');

    return result;
  }
}
