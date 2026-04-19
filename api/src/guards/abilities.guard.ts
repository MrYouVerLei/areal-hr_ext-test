import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { CHECK_ABILITY, RequiredRule } from '../casl/abilities.decorator';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];
    if (!rules.length) return true;

    const { user } = context.switchToHttp().getRequest();
    const ability = await this.abilityFactory.createForUser(user);

    return rules.every((rule) => ability.can(rule.action, rule.subject));
  }
}
