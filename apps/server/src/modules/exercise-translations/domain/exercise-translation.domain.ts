import { HttpStatus } from '@nestjs/common';
import { ExerciseTranslationDomainError } from '~/modules/exercise-translations/domain/error';
import ExerciseTranslationInfo from '~/modules/exercise-translations/domain/value-objects/info';
import ExerciseTranslationLanguage from '~/modules/exercise-translations/domain/value-objects/language';
import ExerciseTranslationName from '~/modules/exercise-translations/domain/value-objects/name';
import { ExerciseTranslationDTO } from '~/modules/exercise-translations/dto/exercise-translation.dto';
import { Languages } from '~/modules/exercise-translations/entities/exercise-translation.entity';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';

export type ExerciseTranslationDomainProps = {
  name: ExerciseTranslationName;
  info: ExerciseTranslationInfo | null;
  language: ExerciseTranslationLanguage;
  exerciseId: string;
};

export type ExerciseTranslationDomainCreateParams = {
  name: string;
  info?: string;
  language: Languages;
  exerciseId: string;
};

export default class ExerciseTranslationDomain extends AggregateRoot<ExerciseTranslationDomainProps> {
  get name(): ExerciseTranslationName {
    return this.props.name;
  }

  get info(): ExerciseTranslationInfo | null {
    return this.props.info;
  }

  get language(): ExerciseTranslationLanguage {
    return this.props.language;
  }

  get exerciseId(): string {
    return this.props.exerciseId;
  }

  public toDto() {
    return ExerciseTranslationDTO.domainToDto(this);
  }

  private static mountValueObjects(
    props: ExerciseTranslationDomainCreateParams,
  ): Either<ExerciseTranslationDomainError, ExerciseTranslationDomainProps> {
    const nameValueObjectOrError = ExerciseTranslationName.create({
      value: props.name,
    });
    if (nameValueObjectOrError.isLeft()) {
      return left(nameValueObjectOrError.value);
    }
    let infoValueObject: ExerciseTranslationInfo | null = null;
    if (props.info) {
      const infoOrError = ExerciseTranslationInfo.create({ value: props.info });
      if (infoOrError.isLeft()) {
        return left(infoOrError.value);
      }
      infoValueObject = infoOrError.value;
    }
    const languageValueObjectOrError = ExerciseTranslationLanguage.create({
      value: props.language,
    });
    if (languageValueObjectOrError.isLeft()) {
      return left(languageValueObjectOrError.value);
    }
    const exerciseTranslationDomainProps: ExerciseTranslationDomainProps = {
      name: nameValueObjectOrError.value,
      info: infoValueObject,
      language: languageValueObjectOrError.value,
      exerciseId: props.exerciseId,
    };
    return right(exerciseTranslationDomainProps);
  }

  private static isValid({
    name,
    exerciseId,
  }: ExerciseTranslationDomainCreateParams): Either<
    ExerciseTranslationDomainError,
    boolean
  > {
    const isMissingProps = !name || !exerciseId;
    if (isMissingProps) {
      return left(
        ExerciseTranslationDomainError.create(
          ExerciseTranslationDomainError.messages.missingProps,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
    return right(true);
  }

  public static create(
    props: ExerciseTranslationDomainCreateParams,
    id?: UniqueEntityID,
  ): Either<ExerciseTranslationDomainError, ExerciseTranslationDomain> {
    const isValid = this.isValid(props);
    if (isValid.isLeft()) {
      return left(isValid.value);
    }
    const valueObjects = this.mountValueObjects(props);
    if (valueObjects.isLeft()) {
      return left(valueObjects.value);
    }
    const exerciseTranslation = new ExerciseTranslationDomain(
      valueObjects.value,
      id,
    );
    return right(exerciseTranslation);
  }
}
