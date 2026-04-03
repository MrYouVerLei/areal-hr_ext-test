import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { AddressDto } from "src/addresses/dto/address.dto";
import { PassportDto } from "src/passports/dto/passport.dto";

export class EmployeeDto {
  last_name: string;
  first_name: string;
  patronymic?: string;
  birth_date: string

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ValidateNested()
  @Type(() => PassportDto)
  passport: PassportDto;
}