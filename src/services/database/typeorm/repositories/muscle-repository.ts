import { Injectable } from '@nestjs/common';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import { Muscle } from '~/modules/muscle/entities/muscle.entity';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';

@Injectable()
export default class MuscleRepository extends BaseRepository<
  Muscle,
  MuscleDomain
> {
  constructor(muscleMapper: MuscleMapper) {
    super(Muscle, muscleMapper);
  }
}
