import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { IS_PUBLIC_KEY } from '../auth/public.decorator';
import { ROLES_KEY } from '../roles/roles.decorator';
import { CHECK_ABILITY, RequiredRule } from '../casl/abilities.decorator';

@Injectable()
export class MultipleAuthorizeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    if (!requiredRoles && !rules.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (
      requiredRoles &&
      requiredRoles.some((role) => user.role_name === role)
    ) {
      return true;
    }

    const ability = this.abilityFactory.createForUser(user);

    return rules.every((rule) => ability.can(rule.action, rule.subject));
  }
}
