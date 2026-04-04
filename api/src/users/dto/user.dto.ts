export class UserDto {
  login: string;
  password: string;
  last_name: string;
  first_name: string;
  patronymic?: string;
  role_id: number;
}