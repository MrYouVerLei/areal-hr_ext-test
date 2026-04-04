import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class OrganizationDto {
  @IsString({ message: 'Название должно быть строкой' })
  @MaxLength(255, { message: 'Название не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Название обязательно в заполнении' })
  name: string;

  @IsString({ message: 'Комментарий должен быть строкой' })
  @IsOptional()
  comment?: string;
}