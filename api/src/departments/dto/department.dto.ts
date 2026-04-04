import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class DepartmentDto {
  @IsString({ message: 'Название должно быть строкой' })
  @MaxLength(255, { message: 'Название не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Название обязательно в заполнении' })
  name: string;

  @IsString({ message: 'Комментарий должен быть строкой' })
  @IsOptional()
  comment?: string;

  @IsInt({ message: 'ID организации должно быть целым числом' })
  @IsPositive({ message: 'ID организации должно быть положительным числом' })
  organization_id: number;

  @IsInt({ message: 'ID родительского отдела должно быть целым числом' })
  @IsPositive({ message: 'ID родительского отдела должно быть положительным числом' })
  @IsOptional()
  parent_id?: number;
}
