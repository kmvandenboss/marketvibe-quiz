const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export function transformDatabaseResponse<T>(data: unknown): T {
  if (Array.isArray(data)) {
    return data.map(item => transformDatabaseResponse(item)) as T;
  }

  if (!isObject(data)) {
    return data as T;
  }

  const transformed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const camelKey = toCamelCase(key);
    
    if (Array.isArray(value)) {
      transformed[camelKey] = value.map(item => transformDatabaseResponse(item));
    } else if (isObject(value)) {
      transformed[camelKey] = transformDatabaseResponse(value);
    } else {
      transformed[camelKey] = value;
    }
  }

  return transformed as T;
}
