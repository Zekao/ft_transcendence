import { HttpException } from '@nestjs/common';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { MergedOptions } from '../interfaces/options.interface';
export declare const buildSchema: (options: MergedOptions, exception: HttpException) => SchemaObject;
