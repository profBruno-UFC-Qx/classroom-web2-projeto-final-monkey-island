export function applyPartialUpdate<T extends object>(
  target: T,
  source: Partial<T>
): T {
  (Object.keys(source) as (keyof T)[]).forEach((key) => {
    const value = source[key];
    if (value !== undefined) {
      target[key] = value;
    }
  });
  return target;
}
