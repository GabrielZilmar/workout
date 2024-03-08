export default class UtilClone {
  public static deepInstanceClone<T>(originalInstance: T): T {
    if (typeof originalInstance !== 'object' || !originalInstance) {
      return originalInstance;
    }

    const clonedInstance = Array.isArray(originalInstance)
      ? []
      : Object.create(Object.getPrototypeOf(originalInstance));

    for (const key in originalInstance) {
      if (Object.prototype.hasOwnProperty.call(originalInstance, key)) {
        clonedInstance[key] = UtilClone.deepInstanceClone(
          originalInstance[key],
        );
      }
    }

    return clonedInstance as T;
  }
}
