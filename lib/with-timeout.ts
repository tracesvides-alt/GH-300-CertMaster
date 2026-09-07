/** Bound storage reads so a blocked database does not leave setup disabled forever. */
export async function withTimeout<T>(operation: PromiseLike<T>, milliseconds = 10000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('読み込みに時間がかかっています。もう一度開始してください。')), milliseconds);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
