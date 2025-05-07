export type ErrorHandler<T> =
  | ({
      ok: true;
    } & Awaited<T>)
  | {
      ok?: never;
      message: string;
    };

export async function errorHandler<T>(
  callback: () => Promise<T>
): Promise<ErrorHandler<T>> {
  try {
    const response = await callback();
    return { ok: true, ...response };
  } catch (error: unknown) {
    const message = (error as Error).message || "Something went wrong";
    return { message };
  }
}
