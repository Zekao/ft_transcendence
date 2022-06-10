import { ContentObject, ExampleObject, ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
export declare type MetaContent = Record<string, ContentObject>;
export declare type Examples = Record<string, ExampleObject | ReferenceObject>;
