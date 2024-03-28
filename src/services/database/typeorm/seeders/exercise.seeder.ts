import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Exercise } from '~/modules/exercise/entities/exercise.entity';
import { Muscle } from '~/modules/muscle/entities/muscle.entity';

type MuscleMapType = { [key in string]: string };

const exercises = [
  { name: 'Deadlift', muscleName: 'All Muscles' },
  { name: 'Squat', muscleName: 'Quadriceps' },
  { name: 'Leg press', muscleName: 'Quadriceps' },
  { name: 'Leg extension', muscleName: 'Quadriceps' },
  { name: 'Lunge', muscleName: 'Quadriceps' },
  { name: 'Pull-up', muscleName: 'Back' },
  { name: 'Supinated pullover', muscleName: 'Back' },
  { name: 'One-arm dumbbell row', muscleName: 'Back' },
  { name: 'Lat pulldown', muscleName: 'Back' },
  { name: 'Lateral raise', muscleName: 'Shoulders' },
  { name: 'Hammer curl', muscleName: 'Biceps' },
  { name: 'Cable curl', muscleName: 'Biceps' },
  { name: 'Bench', muscleName: 'Chest' },
  { name: 'Stiff-legged deadlift', muscleName: 'Hamstrings' },
  { name: 'Pelvic thrust', muscleName: 'Gluteus' },
  { name: 'Smith machine calf raise', muscleName: 'Calves' },
  { name: 'Incline Smith machine bench press', muscleName: 'Chest' },
  { name: 'Machine bench press', muscleName: 'Chest' },
  { name: 'Low cable crossover', muscleName: 'Chest' },
  { name: 'Cable crossover', muscleName: 'Chest' },
  { name: 'Front raise', muscleName: 'Shoulders' },
  { name: 'Triceps pushdown (V-bar)', muscleName: 'Triceps' },
  { name: 'Skull crusher', muscleName: 'Triceps' },
  { name: 'Neutral-grip machine row', muscleName: 'Back' },
  { name: 'Seated cable row', muscleName: 'Back' },
  { name: 'Unilateral pulldown', muscleName: 'Back' },
  { name: 'Concentration curl', muscleName: 'Biceps' },
  { name: 'One-arm preacher curl', muscleName: 'Biceps' },
  { name: 'Incline dumbbell bench press', muscleName: 'Chest' },
  { name: 'Pec fly machine', muscleName: 'Chest' },
  { name: 'Dumbbell shoulder press', muscleName: 'Shoulders' },
  { name: 'Unilateral triceps pushdown', muscleName: 'Triceps' },
  { name: 'Cable triceps extension', muscleName: 'Triceps' },
];

export default class ExerciseSeeder implements Seeder {
  track = true;

  public async run(dataSource: DataSource): Promise<void> {
    const muscleRepository = dataSource.getRepository(Muscle);
    const allMuscles = await muscleRepository.find();
    const muscleMap = allMuscles.reduce((acc, muscle) => {
      acc[muscle.name] = muscle.id;
      return acc;
    }, {} as MuscleMapType);

    const repository = dataSource.getRepository(Exercise);
    await repository.insert(
      exercises.map(({ name, muscleName }) => ({
        name,
        muscleId: muscleMap[muscleName],
      })),
    );
  }
}
