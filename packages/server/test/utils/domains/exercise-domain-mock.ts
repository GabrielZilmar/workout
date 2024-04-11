import { v4 as uuid } from 'uuid';
import ExerciseDomain, {
  ExerciseDomainCreateParams,
  ExerciseDomainProps,
} from '~/modules/exercise/domain/exercise.domain';
import { GenericCreateDomainParams } from 'test/utils/types/domain';
import ExerciseName from '~/modules/exercise/domain/value-objects/name';
import ExerciseInfo from '~/modules/exercise/domain/value-objects/info';
import ExerciseTutorialUrl from '~/modules/exercise/domain/value-objects/tutorial-url';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

type MountExerciseDomainParams = Partial<ExerciseDomainCreateParams> &
  GenericCreateDomainParams;

export class ExerciseDomainMock {
  public static readonly exerciseMockCreateParams: Required<ExerciseDomainCreateParams> =
    {
      name: 'Exercise Test 1',
      muscleId: uuid(),
      info: 'Info Test 1',
      tutorialUrl: 'https://www.youtube.com/watch?v=123',
    };

  public static getExerciseCreateParams(
    props?: Partial<ExerciseDomainCreateParams>,
  ) {
    return {
      ...this.exerciseMockCreateParams,
      ...props,
    };
  }

  public static getExerciseDomainProps({
    name,
    info,
    tutorialUrl,
    muscleId = this.exerciseMockCreateParams.muscleId,
  }: Partial<ExerciseDomainCreateParams> = {}) {
    const nameValueObjectOrError = ExerciseName.create({
      value: name ?? this.exerciseMockCreateParams.name,
    });
    const nameValueObject = nameValueObjectOrError.value as ExerciseName;

    const infoValueObjectOrError = ExerciseInfo.create({
      value: info ?? this.exerciseMockCreateParams.info,
    });
    const infoValueObject = infoValueObjectOrError.value as ExerciseInfo;

    const tutorialUrlValueObjectOrError = ExerciseTutorialUrl.create({
      value: tutorialUrl ?? this.exerciseMockCreateParams.tutorialUrl,
    });
    const tutorialUrlValueObject =
      tutorialUrlValueObjectOrError.value as ExerciseTutorialUrl;

    const exerciseDomainProps: ExerciseDomainProps = {
      name: nameValueObject,
      muscleId: muscleId,
      info: infoValueObject,
      tutorialUrl: tutorialUrlValueObject,
    };

    return exerciseDomainProps;
  }

  public static mountExerciseDomain({
    withoutId,
    ...props
  }: MountExerciseDomainParams = {}) {
    const createParams = this.getExerciseCreateParams(props);

    const exerciseParams = {
      params: createParams,
      id: props.id,
    };

    let id: UniqueEntityID | undefined;
    if (!withoutId) {
      id = new UniqueEntityID(exerciseParams.id);
    }

    const exerciseDomain = ExerciseDomain.create(exerciseParams.params, id);
    return exerciseDomain.value as ExerciseDomain;
  }
}
