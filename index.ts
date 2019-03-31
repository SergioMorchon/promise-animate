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
}

interface IAnimation {
  cancel: () => void;
  promise: Promise<void>;
}

export default <Value>({
  duration,
  getValue,
  setValue
}: IAnimateOptions<Value>): IAnimation => {
  let animationFrame: number | undefined;
  let rejectPromise: () => void;
  const promise = new Promise<void>((resolve, reject) => {
    rejectPromise = reject;
    const startTimestamp = Date.now();
    const endTimestamp = startTimestamp + duration;
    const loop = (now: number) => {
      if (now >= endTimestamp) {
        setValue(getValue(1));
        resolve();
        return;
      }

      setValue(getValue(Math.min(1, (now - startTimestamp) / duration)));
      animationFrame = requestAnimationFrame(loop);
    };
    animationFrame = requestAnimationFrame(loop);
  });
  return {
    promise,
    cancel: () => {
      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }

      rejectPromise();
    }
  };
};
