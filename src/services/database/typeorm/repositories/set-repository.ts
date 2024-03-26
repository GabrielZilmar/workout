import SetDomain from '~/modules/set/domain/set.domain';
import { Set } from '~/modules/set/entities/set.entity';
import SetMapper from '~/modules/set/mappers/set.mapper';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';

export default class SetRepository extends BaseRepository<Set, SetDomain> {
  mapper: SetMapper;

  constructor(setMapper: SetMapper) {
    super(Set, setMapper);
  }
}
