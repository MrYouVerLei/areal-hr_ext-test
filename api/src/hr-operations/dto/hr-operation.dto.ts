import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class HrOperationDto {
  @IsNumber({}, { message: 'Зарплата должна быть числом' })
  @IsPositive({ message: 'Зарплата должна быть положительным числом' })
  salary: number;

  @IsString({ message: 'Тип операции должен быть строкой' })
  @MaxLength(255, { message: 'Тип операции не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Тип операции обязателен в заполнении' })
  operation_type: string;

  /*
    неокончательный вариант проверки даты
  */
  @IsDateString({}, { message: 'Дата операции должна быть строкой' })
  @IsNotEmpty({ message: 'Дата операции обязательна в заполнении' })
  operation_date: string;

  @IsInt({ message: 'ID сотрудника должно быть целым числом' })
  @IsPositive({ message: 'ID сотрудника должно быть положительным числом' })
  employee_id: number;

  @IsInt({ message: 'ID должности должно быть целым числом' })
  @IsPositive({ message: 'ID должности должно быть положительным числом' })
  position_id: number;

  @IsInt({ message: 'ID отдела должно быть целым числом' })
  @IsPositive({ message: 'ID отдела должно быть положительным числом' })
  department_id: number;
}
