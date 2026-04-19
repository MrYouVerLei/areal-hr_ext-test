import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Логин должен быть строкой' })
  @MaxLength(255, { message: 'Логин не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Логин обязателен в заполнении' })
  login: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MaxLength(255, { message: 'Пароль не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен в заполнении' })
  password: string;
}
