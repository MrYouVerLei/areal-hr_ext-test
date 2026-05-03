import { Injectable } from '@nestjs/common';
import { Action } from '../action.enum';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  MongoAbility,
} from '@casl/ability';

export type Subjects =
  | 'User'
  | 'Department'
  | 'Organization'
  | 'Position'
  | 'Employee'
  | 'Changelog';
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    if (user.permissions && user.permissions.length > 0) {
      user.permissions.forEach((permission) => {
        can(permission.action as Action, permission.subject as Subjects);
      });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<Subjects>,
    });
  }
}
