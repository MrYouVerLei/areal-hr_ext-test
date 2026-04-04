import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class PositionDto {
  @IsString({ message: 'Название должно быть строкой' })
  @MaxLength(255, { message: 'Название не может быть больше 255 символов' })
  @IsNotEmpty({ message: 'Название обязательно в заполнении' })
  name: string;
}