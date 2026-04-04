import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class UserDto {
  @IsString({ message: 'Логин должен быть строкой' })
  @MaxLength(50, { message: 'Логин не может быть больше 50 символов' })
  @IsNotEmpty({ message: 'Логин обязателен в заполнении' })
  login: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MaxLength(255, { message: 'Пароль не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен в заполнении' })
  password: string;

  @IsString({ message: 'Фамилия должна быть строкой' })
  @MaxLength(50, { message: 'Фамилия не может быть больше 50 символов' })
  @IsNotEmpty({ message: 'Фамилия обязательна в заполнении' })
  last_name: string;

  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(50, { message: 'Имя не может быть больше 50 символов' })
  @IsNotEmpty({ message: 'Имя обязательно в заполнении' })
  first_name: string;

  @IsString({ message: 'Отчество должно быть строкой' })
  @MaxLength(50, { message: 'Отчество не может быть больше 50 символов' })
  @IsOptional()
  patronymic?: string;

  @IsInt({ message: 'ID организации должно быть целым числом' })
  @IsPositive({ message: 'ID организации должно быть положительным числом' })
  role_id: number;
}