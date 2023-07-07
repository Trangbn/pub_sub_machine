export default class Maybe<T> {
  private value: T | null;

  private constructor(value: T | null) {
    this.value = value;
  }

  static Some<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  static None<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    if (this.value !== null) {
      return Maybe.Some(fn(this.value));
    }
    return Maybe.None();
  }

  flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    if (this.value !== null) {
      return fn(this.value);
    }
    return Maybe.None();
  }

  getOrElse(defaultValue: T): T {
    return this.value !== null ? this.value : defaultValue;
  }

  isSome(): boolean {
    return this.value !== null;
  }

  isNone(): boolean {
    return this.value === null;
  }

  getValue(): T {
    return this.value
  }
}