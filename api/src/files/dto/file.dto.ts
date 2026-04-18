import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class FileDto {
  @Type(() => Number)
  @IsInt({ message: 'ID сотрудника должно быть целым числом' })
  @IsPositive({ message: 'ID сотрудника должно быть положительным числом' })
  employee_id: number;
}
