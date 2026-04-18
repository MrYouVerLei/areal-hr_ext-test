import { Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../../addresses/dto/address.dto';
import { PassportDto } from '../../passports/dto/passport.dto';

export class EmployeeDto {
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

  /*
    неокончательный вариант проверки даты
  */
  @IsDateString(
    {},
    { message: 'Дата рождения должна быть строкой в формате yyyy-mm-dd' },
  )
  @IsNotEmpty({ message: 'Дата рождения обязательна в заполнении' })
  birth_date: string;

  @IsDefined({ message: 'Адрес обязателен в заполнении' })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsDefined({ message: 'Паспортные даннные обязательны в заполнении' })
  @ValidateNested()
  @Type(() => PassportDto)
  passport: PassportDto;
}
