interface IAnimateOptions {
  duration: number;
  update: (
    /**
     * The progress of the animation over the time.
     * Between `0` and `1`.
     */
    progress: number
  ) => void;
  cancellationToken?: {
    cancel: boolean;
  };
}

export default ({ duration, update, cancellationToken }: IAnimateOptions) =>
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
        update(1);
        resolve();
        return;
      }

      update(Math.min(1, (now - startTimestamp) / duration));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
