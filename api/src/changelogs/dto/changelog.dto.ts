import { IsDateString, IsInt, IsISO8601, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class ChangelogDto {
  /*
    неокончательный вариант проверки даты со временем
  */
  @IsString({ message: 'Datetime должен быть строкой' })
  @IsNotEmpty({ message: 'Datetime обязательно в заполнении' })
  date_time: string;

  @IsString({ message: 'Тип объекта должен быть строкой' })
  @MaxLength(255, { message: 'Тип объекта не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Тип объекта обязателен в заполнении' })
  object_type: string;

  @IsString({ message: 'Название поля должно быть строкой' })
  @MaxLength(255, { message: 'Название поля не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Название поля обязательно в заполнении' })
  field_name: string;

  @IsString({ message: 'Старое значение должно быть строкой' })
  @IsOptional()
  old_value?: string;

  @IsString({ message: 'Новое значение должно быть строкой' })
  @IsOptional()
  new_value?: string;

  @IsInt({ message: 'ID пользователя должно быть целым числом' })
  @IsPositive({ message: 'ID пользователя должно быть положительным числом' })
  user_id: number;
}