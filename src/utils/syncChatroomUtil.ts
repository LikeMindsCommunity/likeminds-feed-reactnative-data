export function removeUndefinedKeys<T>(obj: T): T {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result as T;
}
