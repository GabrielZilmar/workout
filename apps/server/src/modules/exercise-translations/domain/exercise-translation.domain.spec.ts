import { HttpStatus } from '@nestjs/common';
import { ExerciseTranslationDomainError } from '~/modules/exercise-translations/domain/error';
import ExerciseTranslationDomain, {
  ExerciseTranslationDomainCreateParams,
  ExerciseTranslationDomainProps,
} from '~/modules/exercise-translations/domain/exercise-translation.domain';
import {
  LanguageMap,
  Languages,
} from '~/modules/exercise-translations/entities/exercise-translation.entity';

type ExerciseTranslationDomainPublicClass = ExerciseTranslationDomain & {
  props: ExerciseTranslationDomainProps;
};

describe('ExerciseTranslationDomain', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const validParams: ExerciseTranslationDomainCreateParams = {
    name: 'Agachamento',
    info: 'Um exercício composto para os quadríceps',
    language: LanguageMap.PORTUGUESE,
    exerciseId: 'exercise-id-123',
  };

  it('should create a valid ExerciseTranslationDomain', () => {
    const domain = ExerciseTranslationDomain.create(validParams);

    expect(domain.isRight()).toBeTruthy();
    const value = domain.value as ExerciseTranslationDomain;

    expect(value).toBeInstanceOf(ExerciseTranslationDomain);
    expect(value.name.value).toBe(validParams.name);
    expect(value.info?.value).toBe(validParams.info);
    expect(value.language.value).toBe(validParams.language);
    expect(value.exerciseId).toBe(validParams.exerciseId);
  });

  it('should not create if required fields are missing', () => {
    const invalidParams: ExerciseTranslationDomainCreateParams = {
      name: '',
      info: '',
      language: LanguageMap.PORTUGUESE,
      exerciseId: '',
    };

    const result = ExerciseTranslationDomain.create(invalidParams);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      ExerciseTranslationDomainError.create(
        ExerciseTranslationDomainError.messages.missingProps,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should not create if name VO is invalid', () => {
    const invalidParams: ExerciseTranslationDomainCreateParams = {
      ...validParams,
      name: 'a', // invalid
    };

    const result = ExerciseTranslationDomain.create(invalidParams);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      ExerciseTranslationDomainError.create(
        ExerciseTranslationDomainError.messages.invalidName,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should not create if language VO is invalid', () => {
    const invalidParams = {
      ...validParams,
      language: 'invalid-language' as Languages,
    };

    const result = ExerciseTranslationDomain.create(invalidParams);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      ExerciseTranslationDomainError.create(
        ExerciseTranslationDomainError.messages.invalidLanguage,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should allow creating without info (nullable)', () => {
    const paramsWithoutInfo: ExerciseTranslationDomainCreateParams = {
      ...validParams,
      info: undefined,
    };

    const result = ExerciseTranslationDomain.create(paramsWithoutInfo);

    expect(result.isRight()).toBeTruthy();
    const domain = result.value as ExerciseTranslationDomainPublicClass;

    expect(domain.info).toBeNull();
    expect(domain.name.value).toBe(validParams.name);
  });
});
