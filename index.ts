interface IAnimateOptions<Value> {
  duration: number;
  getValue: (
    /**
     * The progress of the animation over the time.
     * Between `0` and `1`.
     */
    progress: number
  ) => Value;
  setValue: (value: Value) => void;
  cancellationToken?: {
    cancel: boolean;
  };
}

export default <Value>({
  duration,
  getValue,
  setValue,
  cancellationToken
}: IAnimateOptions<Value>) =>
  new Promise<void>(resolve => {
    const startTimestamp = Date.now();
    const endTimestamp = startTimestamp + duration;
    const loop = () => {
      const now = Date.now();
      if (cancellationToken && cancellationToken.cancel) {
        resolve();
        return;
      }

      if (now >= endTimestamp) {
        setValue(getValue(1));
        resolve();
        return;
      }

      setValue(getValue(Math.min(1, (now - startTimestamp) / duration)));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
