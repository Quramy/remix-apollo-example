function getMap(): Map<unknown, unknown> {
  const map = (globalThis as any).__getRequestLocalStorage__?.();
  if (!map) {
    throw new Error("Not inside request local scope.");
  }
  return map as Map<unknown, unknown>;
}

export function getContextValue<T>(key: unknown): T | undefined {
  return getMap().get(key) as T | undefined;
}

export function setContextValue<T>(key: unknown, value: T): void {
  getMap().set(key, value);
}

export function cache<T extends () => any, V extends ReturnType<T>>(
  fn: T
): () => V {
  return () => {
    const cachedValue = getContextValue<V>(fn);
    if (cachedValue) return cachedValue;
    const value = fn();
    setContextValue(fn, value);
    return value;
  };
}
