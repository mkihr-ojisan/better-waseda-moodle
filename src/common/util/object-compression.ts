export type TypeDef =
    | "string"
    | "number"
    | "boolean"
    | { readonly objectEntries: readonly (readonly [string, TypeDef])[] }
    | { readonly arrayElements: TypeDef }
    | { readonly enumItems: readonly string[] }
    | { readonly recordValues: TypeDef }
    | { readonly nullable: TypeDef };

export type TypeOfTypeDef<T extends TypeDef> = T extends "string"
    ? string
    : T extends "number"
    ? number
    : T extends "boolean"
    ? boolean
    : T extends { readonly objectEntries: readonly (readonly [string, TypeDef])[] }
    ? ObjectEntries<T["objectEntries"]>
    : T extends { readonly arrayElements: TypeDef }
    ? TypeOfTypeDef<T["arrayElements"]>[]
    : T extends { readonly enumItems: readonly string[] }
    ? T["enumItems"][number]
    : T extends { readonly recordValues: TypeDef }
    ? Partial<Record<string, TypeOfTypeDef<T["recordValues"]>>>
    : T extends { readonly nullable: TypeDef }
    ? TypeOfTypeDef<T["nullable"]> | null
    : never;

type ObjectEntries<T extends readonly (readonly [string, TypeDef])[]> = T extends readonly [infer Head, ...infer Tail]
    ? Head extends readonly [string, TypeDef]
        ? Tail extends readonly (readonly [string, TypeDef])[]
            ? { [K in Head[0]]: TypeOfTypeDef<Head[1]> } & ObjectEntries<Tail>
            : never
        : never
    : Record<never, never>;

/**
 * JSON.stringifyしたときに文字数が少なくなるように、オブジェクトを圧縮する。
 *
 * @param typeDef - オブジェクトの型定義
 * @param obj - 圧縮するオブジェクト
 * @returns 圧縮されたオブジェクト
 */
export function compressObject<T extends TypeDef>(typeDef: T, obj: TypeOfTypeDef<T>): unknown {
    if (typeDef === "string") {
        // @ts-expect-error - Type instantiation is excessively deep and possibly infinite.
        return obj;
    } else if (typeDef === "number") {
        return obj;
    } else if (typeDef === "boolean") {
        return obj ? 1 : 0;
    } else if (typeof typeDef === "object") {
        if ("objectEntries" in typeDef) {
            return typeDef.objectEntries.map(([key, typeDef]) => compressObject(typeDef, (obj as any)[key]));
        } else if ("arrayElements" in typeDef) {
            return (obj as any[]).map((item) => compressObject(typeDef.arrayElements, item));
        } else if ("enumItems" in typeDef) {
            return typeDef.enumItems.indexOf(obj as any);
        } else if ("recordValues" in typeDef) {
            return Object.entries(obj as any).map(([key, value]) => [key, compressObject(typeDef.recordValues, value)]);
        } else if ("nullable" in typeDef) {
            return obj === null ? null : compressObject(typeDef.nullable, obj);
        }
    }
    throw Error("invalid typeDef or obj");
}

/**
 * compressObjectされたオブジェクトを解凍する。
 *
 * @param typeDef - オブジェクトの型定義
 * @param compressed - 圧縮されたオブジェクト
 * @returns 解凍されたオブジェクト
 */
export function decompressObject<T extends TypeDef>(typeDef: T, compressed: unknown): TypeOfTypeDef<T> {
    if (typeDef === "string") {
        return compressed as TypeOfTypeDef<T>;
    } else if (typeDef === "number") {
        return compressed as TypeOfTypeDef<T>;
    } else if (typeDef === "boolean") {
        return (compressed !== 0) as TypeOfTypeDef<T>;
    } else if (typeof typeDef === "object") {
        if ("objectEntries" in typeDef) {
            return typeDef.objectEntries.reduce((obj, [key, typeDef], i) => {
                (obj as any)[key] = decompressObject(typeDef, (compressed as any[])[i]);
                return obj;
            }, {} as any);
        } else if ("arrayElements" in typeDef) {
            return (compressed as any[]).map((item) =>
                decompressObject(typeDef.arrayElements, item)
            ) as TypeOfTypeDef<T>;
        } else if ("enumItems" in typeDef) {
            return typeDef.enumItems[compressed as any] as TypeOfTypeDef<T>;
        } else if ("recordValues" in typeDef) {
            return (compressed as any[]).reduce((obj, [key, value]) => {
                (obj as any)[key] = decompressObject(typeDef.recordValues, value);
                return obj;
            }, {} as any) as TypeOfTypeDef<T>;
        } else if ("nullable" in typeDef) {
            return compressed === null ? null : decompressObject(typeDef.nullable, compressed);
        }
    }
    throw Error("invalid typeDef or obj");
}
