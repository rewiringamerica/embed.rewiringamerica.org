export type FetchState<T> =
  | {
      state: 'init';
    }
  | {
      state: 'loading';
      /**
       * If the previous state was loading, this may or may not contain the
       * response value from that state.
       */
      previousResponse?: T;
    }
  | {
      state: 'complete';
      response: T;
    }
  | {
      state: 'error';
      message: string;
    };
