import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { UserWithRoleDto } from '../users/dto/user.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(
    user: any,
    done: (err: Error | null, user: { id: number; role_name: string }) => void,
  ) {
    done(null, { id: user.id, role_name: user.role_name });
  }

  async deserializeUser(
    payload: { id: number; role_name: string },
    done: (err: Error | null, user: UserWithRoleDto) => void,
  ) {
    const user = await this.usersService.findOne(payload.id);
    done(null, user);
  }
}
