import { v4 as uuid } from 'uuid';
import { GenericCreateDomainParams } from 'test/utils/types/domain';
import ExerciseTranslationDomain, {
  ExerciseTranslationDomainCreateParams,
  ExerciseTranslationDomainProps,
} from '~/modules/exercise-translations/domain/exercise-translation.domain';
import { LanguageMap } from '~/modules/exercise-translations/entities/exercise-translation.entity';
import ExerciseTranslationName from '~/modules/exercise-translations/domain/value-objects/name';
import ExerciseTranslationInfo from '~/modules/exercise-translations/domain/value-objects/info';
import ExerciseTranslationLanguage from '~/modules/exercise-translations/domain/value-objects/language';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

type MountExerciseTranslationMountParams =
  Partial<ExerciseTranslationDomainCreateParams> & GenericCreateDomainParams;

export class ExerciseTranslationMock {
  public static readonly exerciseTranslationMockCreateParams: Required<ExerciseTranslationDomainCreateParams> =
    {
      name: 'Exercício',
      info: 'Info',
      language: LanguageMap.PORTUGUESE,
      exerciseId: uuid(),
    };

  public static getExerciseTranslationCreateParams(
    props?: Partial<ExerciseTranslationDomainCreateParams>,
  ) {
    return {
      ...this.exerciseTranslationMockCreateParams,
      ...props,
    };
  }

  public static getExerciseTranslationCreateProps({
    name,
    info,
    language,
    exerciseId = this.exerciseTranslationMockCreateParams.exerciseId,
  }: Partial<ExerciseTranslationDomainCreateParams> = {}) {
    const nameValueObjectOrError = ExerciseTranslationName.create({
      value: name ?? this.exerciseTranslationMockCreateParams.name,
    });
    const nameValueObject =
      nameValueObjectOrError.value as ExerciseTranslationName;

    const infoValueObjectOrError = ExerciseTranslationInfo.create({
      value: info ?? this.exerciseTranslationMockCreateParams.info,
    });
    const infoValueObject =
      infoValueObjectOrError.value as ExerciseTranslationInfo;

    const languageValueObjectOrError = ExerciseTranslationLanguage.create({
      value: language ?? this.exerciseTranslationMockCreateParams.language,
    });
    const languageValueObject =
      languageValueObjectOrError.value as ExerciseTranslationLanguage;

    const translation: ExerciseTranslationDomainProps = {
      name: nameValueObject,
      info: infoValueObject,
      language: languageValueObject,
      exerciseId,
    };
    return translation;
  }

  public static mountExerciseTranslationDomain({
    withoutId,
    ...props
  }: MountExerciseTranslationMountParams = {}) {
    const createParams = this.getExerciseTranslationCreateParams(props);
    const exerciseTranslationParams = {
      params: createParams,
      id: props.id,
    };

    let id: UniqueEntityID | undefined;
    if (!withoutId) {
      id = new UniqueEntityID(exerciseTranslationParams.id);
    }

    const domain = ExerciseTranslationDomain.create(
      exerciseTranslationParams.params,
      id,
    );
    return domain.value as ExerciseTranslationDomain;
  }
}
