/**
 * Moves the item to the new position in the input array. Useful for huge arrays where absolute performance is needed.
 *
 * @since 5.2.0
 * @static
 * @memberof array
 * @param array - The array to modify.
 * @param fromIndex - The index of item to move. If negative, it will begin that many elements from the end.
 * @param toIndex - The index of where to move the item. If negative, it will begin that many elements from the end. 
 * @returns A new array with the item moved to the new position.
 * @example
 *
 * const input = ['a', 'b', 'c'];
 * arrayMoveMutable(input, 1, 2);
 * 
 * console.log(input);
 * // => ['a', 'c', 'b']
 */
export function arrayMoveMutable(array: unknown[], fromIndex:number, toIndex:number): void {
	const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

	if (startIndex >= 0 && startIndex < array.length) {
		const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

		const [item] = array.splice(fromIndex, 1);
		array.splice(endIndex, 0, item);
	}
}


/**
 * Clones the given `array`, moves the item to a new position in the new array, and then returns the new array. The given `array` is not mutated.
 *
 * @since 5.2.0
 * @static
 * @memberof array
 * @param array - The array with the item to move. 
 * @param fromIndex - The index of item to move. If negative, it will begin that many elements from the end. 
 * @param toIndex - The index of where to move the item. If negative, it will begin that many elements from the end. 
 * @returns A new array with the item moved to the new position.
 * @example
 *
 * const input = ['a', 'b', 'c'];
 * 
 * arrayMoveImmutable(input, 1, 2);
 * // => ['a', 'c', 'b']
 * 
 * arrayMoveImmutable(input, -1, 0);
 * //=> ['c', 'a', 'b']
 * 
 * arrayMoveImmutable(input, -2, -3);
 * //=> ['b', 'a', 'c']
 */
export function arrayMoveImmutable<ValueType>(array: readonly ValueType[], fromIndex: number, toIndex: number): ValueType[] {
	const newArray = [...array];
	arrayMoveMutable(newArray, fromIndex, toIndex);
	return newArray;
}

export default arrayMoveImmutable;
