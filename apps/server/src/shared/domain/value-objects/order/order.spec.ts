import { HttpStatus } from '@nestjs/common';
import { SharedValueObjectError } from '~/shared/domain/value-objects/errors';
import Order from '~/shared/domain/value-objects/order';

type OrderPublicClass = Order & {
  isValid: () => boolean;
};

describe('Order value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a workout exercise order value object', () => {
    const isValidSpy = jest.spyOn(
      Order as unknown as OrderPublicClass,
      'isValid',
    );

    const orderValue = 3;
    const order = Order.create({ value: orderValue });

    expect(order.value).toBeInstanceOf(Order);
    expect((order.value as Order).value).toBe(orderValue);
    expect(order.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalledWith(orderValue);
  });

  it('Should create a workout exercise order value object with null value', () => {
    const isValidSpy = jest.spyOn(
      Order as unknown as OrderPublicClass,
      'isValid',
    );

    const orderValue = null;
    const order = Order.create({ value: orderValue });

    expect(order.value).toBeInstanceOf(Order);
    expect((order.value as Order).value).toBe(orderValue);
    expect(order.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalledWith(orderValue);
  });

  it('Should not create a workout exercise order value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      Order as unknown as OrderPublicClass,
      'isValid',
    );

    const orderValue = -1;
    const order = Order.create({ value: orderValue });

    expect(order.isLeft()).toBeTruthy();
    expect(order.value).toEqual(
      SharedValueObjectError.create(
        SharedValueObjectError.messages.invalidOrder,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(isValidSpy).toHaveBeenCalled();
  });
});
