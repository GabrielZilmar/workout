import { HttpStatus } from '@nestjs/common';
import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import ExerciseInfo from '~/modules/exercise/domain/value-objects/info';
import ExerciseName from '~/modules/exercise/domain/value-objects/name';
import ExerciseTutorialUrl from '~/modules/exercise/domain/value-objects/tutorial-url';
import { ExerciseDto } from '~/modules/exercise/dto/exercise.dto';
import { SimpleExerciseDto } from '~/modules/exercise/dto/simple-exercise.dto';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';

export type ExerciseDomainProps = {
  name: ExerciseName;
  info: ExerciseInfo | null;
  tutorialUrl: ExerciseTutorialUrl | null;
  muscleId: string;
  muscleDomain?: MuscleDomain;
};

export type ExerciseDomainCreateParams = {
  name: string;
  muscleId: string;
  info?: string;
  tutorialUrl?: string;
  muscleDomain?: MuscleDomain;
};

export type ExerciseDomainUpdateParams = Partial<ExerciseDomainCreateParams>;

export default class ExerciseDomain extends AggregateRoot<ExerciseDomainProps> {
  get name(): ExerciseName {
    return this.props.name;
  }

  get info(): ExerciseInfo | null {
    return this.props.info;
  }

  get tutorialUrl(): ExerciseTutorialUrl | null {
    return this.props.tutorialUrl;
  }

  get muscleId(): string {
    return this.props.muscleId;
  }

  get muscleDomain(): MuscleDomain | undefined {
    return this.props.muscleDomain;
  }

  public toDto() {
    return ExerciseDto.domainToDto(this);
  }

  public toSimpleDto() {
    return SimpleExerciseDto.domainToDto(this);
  }

  public update({
    name,
    info,
    tutorialUrl,
    muscleId,
    muscleDomain,
  }: ExerciseDomainUpdateParams): Either<ExerciseDomainError, ExerciseDomain> {
    if (name) {
      const nameOrError = ExerciseName.create({ value: name });
      if (nameOrError.isLeft()) {
        return left(nameOrError.value);
      }

      this.props.name = nameOrError.value;
    }

    if (info === null) {
      this.props.info = null;
    }
    if (info) {
      const infoOrError = ExerciseInfo.create({ value: info });
      if (infoOrError.isLeft()) {
        return left(infoOrError.value);
      }

      this.props.info = infoOrError.value;
    }

    if (tutorialUrl === null) {
      this.props.tutorialUrl = null;
    }
    if (tutorialUrl) {
      const tutorialUrlOrError = ExerciseTutorialUrl.create({
        value: tutorialUrl,
      });
      if (tutorialUrlOrError.isLeft()) {
        return left(tutorialUrlOrError.value);
      }

      this.props.tutorialUrl = tutorialUrlOrError.value;
    }

    if (muscleId) {
      this.props.muscleId = muscleId;
    }

    if (muscleDomain) {
      this.props.muscleDomain = muscleDomain;
    }

    return right(this);
  }

  private static mountValueObjects(
    props: ExerciseDomainCreateParams,
  ): Either<ExerciseDomainError, ExerciseDomainProps> {
    const nameValueObject = ExerciseName.create({ value: props.name });
    if (nameValueObject.isLeft()) {
      return left(nameValueObject.value);
    }

    let infoValueObject: ExerciseInfo | null = null;
    if (props.info) {
      const exerciseInfoOrError = ExerciseInfo.create({ value: props.info });
      if (exerciseInfoOrError.isLeft()) {
        return left(exerciseInfoOrError.value);
      }

      infoValueObject = exerciseInfoOrError.value;
    }

    let tutorialUrlValueObject: ExerciseTutorialUrl | null = null;
    if (props.tutorialUrl) {
      const tutorialUrlValueObjectOrError = ExerciseTutorialUrl.create({
        value: props.tutorialUrl,
      });
      if (tutorialUrlValueObjectOrError.isLeft()) {
        return left(tutorialUrlValueObjectOrError.value);
      }

      tutorialUrlValueObject = tutorialUrlValueObjectOrError.value;
    }

    const exerciseDomainProps: ExerciseDomainProps = {
      name: nameValueObject.value,
      muscleId: props.muscleId,
      info: infoValueObject,
      tutorialUrl: tutorialUrlValueObject,
      muscleDomain: props.muscleDomain,
    };
    return right(exerciseDomainProps);
  }

  private static isValid({
    name,
    muscleId,
  }: ExerciseDomainCreateParams): boolean {
    const hasAllRequiredProps = !!name && !!muscleId;

    return hasAllRequiredProps;
  }

  public static create(
    props: ExerciseDomainCreateParams,
    id?: UniqueEntityID,
  ): Either<ExerciseDomainError, ExerciseDomain> {
    const isValid = this.isValid(props);
    if (!isValid) {
      return left(
        ExerciseDomainError.create(
          ExerciseDomainError.messages.missingProps,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const valueObjects = this.mountValueObjects(props);
    if (valueObjects.isLeft()) {
      return left(valueObjects.value);
    }

    const exercise = new ExerciseDomain(valueObjects.value, id);
    return right(exercise);
  }
}
