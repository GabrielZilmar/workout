import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Muscle } from '~/modules/muscle/entities/muscle.entity';

type MuscleMapType = { [key in Muscles]: string };

type Muscles =
  | 'quadriceps'
  | 'hamstrings'
  | 'gluteus'
  | 'chest'
  | 'back'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'shoulders'
  | 'trapezius'
  | 'abs'
  | 'obliques'
  | 'calves'
  | 'all';

const MuscleMap: MuscleMapType = {
  quadriceps: 'Quadriceps',
  hamstrings: 'Hamstrings',
  gluteus: 'Gluteus Maximus',
  chest: 'Chest (Pectorals)',
  back: 'Back',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  shoulders: 'Shoulders',
  trapezius: 'Trapezius',
  abs: 'Abdominals',
  obliques: 'Obliques',
  calves: 'Calves',
  all: 'All Muscles',
};

export default class MuscleSeeder implements Seeder {
  /**
   * Track seeder execution.
   */
  track = true;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Muscle);
    await repository.insert(Object.values(MuscleMap).map((name) => ({ name })));
  }
}
