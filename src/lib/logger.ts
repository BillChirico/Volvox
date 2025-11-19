/**
 * Lightweight bridge to the application's centralized error tracking.
 *
 * @param context - Message describing where the error occurred.
 * @param error - The captured error value.
 */
export function reportError(context: string, error: unknown): void {
  const payload = error instanceof Error ? error : new Error(String(error));

  if (typeof globalThis !== "undefined") {
    const maybeProcessLogger = (
      globalThis as {
        processLogger?: { error: (message: string, err: Error) => void };
      }
    ).processLogger;

    if (maybeProcessLogger) {
      maybeProcessLogger.error(context, payload);
      return;
    }
  }

  console.error(`[Volvox] ${context}`, payload);
}
