import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    console.log(value, 'apasih');

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0 || value.name === 'Validation failed') {
      throw new BadRequestException(
        'Validation failed',
        errors.length > 0
          ? Object.values(errors[0].constraints)[0]
          : value.message,
      );
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
