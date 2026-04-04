import { IsDate, IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class FileDto {
  @IsString({ message: 'Название должно быть строкой' })
  @MaxLength(255, { message: 'Название не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Название обязательно в заполнении' })
  name: string;

  @IsString({ message: 'Путь к файлу должен быть строкой' })
  @MaxLength(255, { message: 'Путь к файлу не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Путь к файлу обязателен в заполнении' })
  file_path: string;

  @IsInt({ message: 'ID сотрудника должно быть целым числом' })
  @IsPositive({ message: 'ID сотрудника должно быть положительным числом' })
  employee_id: number;
}