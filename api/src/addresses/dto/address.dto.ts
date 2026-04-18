import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AddressDto {
  @IsString({ message: 'Регион должен быть строкой' })
  @MaxLength(255, { message: 'Регион не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Регион обязателен в заполнении' })
  region: string;

  @IsString({ message: 'Населённый пункт должен быть строкой' })
  @MaxLength(255, {
    message: 'Населённый пункт не может быть больше 255 символов',
  })
  @IsNotEmpty({ message: 'Населённый пункт обязателен в заполнении' })
  locality: string;

  @IsString({ message: 'Улица должна быть строкой' })
  @MaxLength(255, { message: 'Улица не может быть больше 255 символов' })
  @IsOptional()
  street?: string;

  @IsString({ message: 'Дом должен быть строкой' })
  @MaxLength(10, { message: 'Дом не может быть больше 10 символов' })
  @IsNotEmpty({ message: 'Дом обязателен в заполнении' })
  house: string;

  @IsString({ message: 'Корпус должен быть строкой' })
  @MaxLength(10, { message: 'Корпус не может быть больше 10 символов' })
  @IsOptional()
  corps?: string;

  @IsString({ message: 'Квартира должна быть строкой' })
  @MaxLength(10, { message: 'Квартира не может быть больше 10 символов' })
  @IsOptional()
  apartment?: string;
}
