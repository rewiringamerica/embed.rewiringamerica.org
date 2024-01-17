export type FetchState<T> =
  | {
      state: 'init';
    }
  | {
      state: 'loading';
    }
  | {
      state: 'complete';
      response: T;
    }
  | {
      state: 'error';
      message: string;
    };
