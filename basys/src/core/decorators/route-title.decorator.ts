import { SetMetadata } from '@nestjs/common';

export const RouteTitle = (title: string) => SetMetadata('routeTitle', title);