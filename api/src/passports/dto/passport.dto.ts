import { IsDateString, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class PassportDto {
  @IsString({ message: 'Серия должна быть строкой' })
  @Matches(/^\d{4}/, { message: 'Серия должна содержать 4 цифры' })
  @IsNotEmpty({ message: 'Серия обязательна в заполнении' })
  series: string;

  @IsString({ message: 'Номер должен быть строкой' })
  @Matches(/^\d{6}$/, { message: 'Номер должен содержать 6 цифр' })
  @IsNotEmpty({ message: 'Номер обязателен в заполнении' })
  number: string;

  /*
    неокончательный вариант проверки даты
  */
  @IsDateString({}, { message: 'Дата выдачи должна быть строкой в формате yyyy-mm-dd' })
  @IsNotEmpty({ message: 'Дата выдачи обязательна в заполнении' })
  issue_date: string;

  @IsString({ message: 'Код подразделения должен быть строкой' })
  @Matches(/^\d{3}-\d{3}$/, { message: 'Номер должен содержать 6 цифр в формате: ddd-ddd' })
  @IsNotEmpty({ message: 'Код подразделения обязателен в заполнении' })
  subdivision_code: string;

  @IsString({ message: 'Орган выдачи паспорта должен быть строкой' })
  @MaxLength(255, { message: 'Орган выдачи паспорта не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Орган выдачи паспорта обязателен в заполнении' })
  issuing_authority: string;
}