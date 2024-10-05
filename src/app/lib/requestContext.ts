function getMap(): Map<string, unknown> {
  const map = (globalThis as any).__getRequestLocalStorage__?.();

  if (!map) {
    throw new Error("Not inside request local scope.");
  }

  return map as Map<string, unknown>;
}

export function getContextValue<T>(key: string): T | undefined {
  return getMap().get(key) as T | undefined;
}

export function setContextValue<T>(key: string, value: T): void {
  getMap().set(key, value);
}

export function cache<T extends () => any, V extends ReturnType<T>>(
  fn: T
): () => V {
  const key = fn.toString();
  return () => {
    const cachedValue = getContextValue<V>(key);
    if (cachedValue) return cachedValue;
    const value = fn();
    setContextValue(key, value);
    return value;
  };
}
