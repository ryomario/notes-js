/**
 * 
 * @param {Array<K>} array 
 * @returns {K}
 */
function first(array) {
    return array[0];
}
/**
 * 
 * @param {Array<K>} array 
 * @returns {K}
 */
function last(array) {
    return array[array.length - 1];
}

/**
 * returns the rest of the items in an array.
 *
 * @param {Array} array
 */
function tail(array) {
    return array.slice(1);
}

/**
 * returns a copy of the collection with array type.
 * @param {Collection} collection - collection eg) node.childNodes, ...
 */
function from(collection) {
    const result = [];
    const length = collection.length;
    let idx = -1;
    while (++idx < length) {
        result[idx] = collection[idx];
    }
    return result;
}

export default {
    first,
    last,
    tail,
    from,
}