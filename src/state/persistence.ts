type HydrationErrorListener = (error: unknown) => void;

let hydrationError: unknown;
const hydrationErrorListeners = new Set<HydrationErrorListener>();

export function reportHydrationError(error: unknown) {
  hydrationError = error;
  hydrationErrorListeners.forEach((listener) => listener(error));
}

export function getHydrationError() {
  return hydrationError;
}

export function subscribeToHydrationError(listener: HydrationErrorListener) {
  hydrationErrorListeners.add(listener);

  if (hydrationError) {
    listener(hydrationError);
  }

  return () => hydrationErrorListeners.delete(listener);
}
