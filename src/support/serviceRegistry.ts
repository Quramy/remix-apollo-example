(globalThis as any).__look_up__map__ = new Map<string, unknown>();

const map = (globalThis as any).__look_up__map__ as Map<string, unknown>;

export type ServiceMeta = {
  readonly key: string;
  readonly value: unknown;
};

export function lookupService<
  T extends ServiceMeta,
  K extends T["key"] = T["key"]
>(key: K): T["value"] {
  const value = map.get(key);
  if (!value) {
    throw new Error(`cannot lookup service: ${key}`);
  }
  return value as T["value"];
}

export function registerService({ key, value }: ServiceMeta) {
  map.set(key, value);
}
