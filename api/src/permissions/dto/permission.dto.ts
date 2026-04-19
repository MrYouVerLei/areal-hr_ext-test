import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class PermissionDto {
  @IsString({ message: 'Действие должно быть строкой' })
  @MaxLength(255, { message: 'Действие не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Действие обязательно в заполнении' })
  action: string;

  @IsString({ message: 'Субъект должен быть строкой' })
  @MaxLength(255, { message: 'Субъект не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Субъект обязателен в заполнении' })
  subject: string;

  @IsInt({ message: 'ID роли должно быть целым числом' })
  @IsPositive({ message: 'ID роли должно быть положительным числом' })
  role_id: number;
}
