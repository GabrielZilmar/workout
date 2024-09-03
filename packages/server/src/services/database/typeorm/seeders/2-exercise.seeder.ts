import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Exercise } from '~/modules/exercise/entities/exercise.entity';
import { Muscle } from '~/modules/muscle/entities/muscle.entity';

type MuscleMapType = { [key in string]: string };

const exercises = [
  {
    name: 'Deadlift',
    muscleName: 'All Muscles',
    tutorialUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
  },
  {
    name: 'Squat',
    muscleName: 'Quadriceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=nEQQle9-0NA',
  },
  {
    name: 'Leg press',
    muscleName: 'Quadriceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=s9-zeWzPUmA',
  },
  {
    name: 'Leg extension',
    muscleName: 'Quadriceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=m0FOpMEgero',
  },
  {
    name: 'Lunge',
    muscleName: 'Quadriceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=1LuRcKJMn8w',
  },
  {
    name: 'Pull-up',
    muscleName: 'Back',
    tutorialUrl: 'https://www.youtube.com/watch?v=p40iUjf02j0',
  },
  {
    name: 'Supinated pullover',
    muscleName: 'Back',
    tutorialUrl: 'https://www.youtube.com/watch?v=U8Z9_Ny_uw0',
  },
  {
    name: 'One-arm dumbbell row',
    muscleName: 'Back',
    tutorialUrl: 'https://www.youtube.com/watch?v=xl1YiqQY2vA',
  },
  {
    name: 'Lat pulldown',
    muscleName: 'Back',
    tutorialUrl: 'https://www.youtube.com/watch?v=JGeRYIZdojU',
  },
  {
    name: 'Lateral raise',
    muscleName: 'Shoulders',
    tutorialUrl: 'https://www.youtube.com/watch?v=XPPfnSEATJA',
  },
  {
    name: 'Hammer curl',
    muscleName: 'Biceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=CFBZ4jN1CMI',
  },
  {
    name: 'Cable curl',
    muscleName: 'Biceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=UsaY33N4KEw',
  },
  {
    name: 'Bench',
    muscleName: 'Chest',
    tutorialUrl: 'https://www.youtube.com/watch?v=CjHIKDQ4RQo',
  },
  {
    name: 'Stiff-legged deadlift',
    muscleName: 'Hamstrings',
    tutorialUrl: 'https://www.youtube.com/watch?v=CN_7cz3P-1U',
  },
  {
    name: 'Pelvic thrust',
    muscleName: 'Gluteus',
    tutorialUrl: 'https://www.youtube.com/watch?v=Zp26q4BY5HE',
  },
  {
    name: 'Smith machine calf raise',
    muscleName: 'Calves',
    tutorialUrl: 'https://www.youtube.com/watch?v=1lKjFPrYqf0',
  },
  {
    name: 'Incline Smith machine bench press',
    muscleName: 'Chest',
    tutorialUrl: 'https://www.youtube.com/watch?v=8urE8Z8AMQ4',
  },
  {
    name: 'Machine bench press',
    muscleName: 'Chest',
    tutorialUrl: 'https://www.youtube.com/watch?v=NwzUje3z0qY',
  },
  {
    name: 'Low cable crossover',
    muscleName: 'Chest',
    tutorialUrl: 'https://www.youtube.com/watch?v=wnFEC_34Bls',
  },
  {
    name: 'Cable crossover',
    muscleName: 'Chest',
    tutorialUrl: 'https://www.youtube.com/watch?v=taI4XduLpTk',
  },
  {
    name: 'Front raise',
    muscleName: 'Shoulders',
    tutorialUrl: 'https://www.youtube.com/watch?v=hRJ6tR5-if0',
  },
  {
    name: 'Triceps pushdown (V-bar)',
    muscleName: 'Triceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=WJD82PDO4XI',
  },
  {
    name: 'Skull crusher',
    muscleName: 'Triceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=l3rHYPtMUo8',
  },
  {
    name: 'Neutral-grip machine row',
    muscleName: 'Back',
    tutorialUrl: 'https://www.youtube.com/watch?v=gykcZl_PTD8',
  },
  {
    name: 'Seated cable row',
    muscleName: 'Back',
    tutorialUrl: 'https://www.youtube.com/watch?v=UCXxvVItLoM',
  },
  {
    name: 'Unilateral pulldown',
    muscleName: 'Back',
    tutorialUrl: 'https://www.youtube.com/watch?v=Qed5O9toqT8',
  },
  {
    name: 'Concentration curl',
    muscleName: 'Biceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=VMbDQ8PZazY',
  },
  {
    name: 'One-arm preacher curl',
    muscleName: 'Biceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=fuK3nFvwgXk',
  },
  {
    name: 'Incline dumbbell bench press',
    muscleName: 'Chest',
    tutorialUrl: 'https://www.youtube.com/watch?v=Fv5EYoJfRt4',
  },
  {
    name: 'Pec fly machine',
    muscleName: 'Chest',
    tutorialUrl: 'https://www.youtube.com/watch?v=FDay9wFe5uE',
  },
  {
    name: 'Dumbbell shoulder press',
    muscleName: 'Shoulders',
    tutorialUrl: 'https://www.youtube.com/watch?v=HzIiNhHhhtA',
  },
  {
    name: 'Unilateral triceps pushdown',
    muscleName: 'Triceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=Cp_bShvMY4c',
  },
  {
    name: 'Cable triceps extension',
    muscleName: 'Triceps',
    tutorialUrl: 'https://www.youtube.com/watch?v=JDEDaZTEzGE',
  },
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
      exercises.map(({ name, muscleName, tutorialUrl }) => ({
        name,
        muscleId: muscleMap[muscleName],
        tutorialUrl,
      })),
    );
  }
}
