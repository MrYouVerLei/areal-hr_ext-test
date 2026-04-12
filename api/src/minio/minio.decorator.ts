import { Inject } from '@nestjs/common';
import { MINIO_TOKEN } from '../constants';

export function InjectMinio(): ParameterDecorator {
  return Inject(MINIO_TOKEN);
}
