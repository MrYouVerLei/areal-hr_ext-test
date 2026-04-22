import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Пароль должен быть строкой' })
  @MaxLength(255, { message: 'Пароль не может быть больше 255 символов' })
  @IsOptional()
  password?: string;

  @IsString({ message: 'Фамилия должна быть строкой' })
  @MaxLength(50, { message: 'Фамилия не может быть больше 50 символов' })
  @IsOptional()
  last_name?: string;

  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(50, { message: 'Имя не может быть больше 50 символов' })
  @IsOptional()
  first_name?: string;

  @IsString({ message: 'Отчество должно быть строкой' })
  @MaxLength(50, { message: 'Отчество не может быть больше 50 символов' })
  @IsOptional()
  patronymic?: string;

  @IsInt({ message: 'ID роли должно быть целым числом' })
  @IsPositive({ message: 'ID роли должно быть положительным числом' })
  @IsOptional()
  role_id?: number;
}
