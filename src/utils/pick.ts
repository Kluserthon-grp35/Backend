/**
 * @description Pick properties from an object
 * @param object Object to pick properties from
 * @param properties Array of properties to pick from object
 * @returns Object with picked properties
 * @example pick({ a: 1, b: 2, c: 3 }, ['a', 'b']) // { a: 1, b: 2 }
 */
export default function pick(object: Record<string, any>, keys: string[]) {
	return keys.reduce(
		(obj, key) => {
			if (object && object.hasOwnProperty(key)) {
				obj[key] = object[key];
			}
			return obj;
		},
		{} as Record<string, any>,
	);
}
