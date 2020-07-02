import * as jsonpath from "jsonpath";
/**
 * Step through data object and apply path transforms.
 *
 * @param {object} data
 * @param {object} path
 * @param {object} result
 * @param {string} key
 */
function walk(data: object, path: any, result: object, key: any = undefined) {
  var fn;

  switch (type(path)) {
    case "string":
      fn = seekSingle;
      break;

    case "array":
      fn = seekArray;
      break;

    case "object":
      fn = seekObject;
      break;
  }

  if (fn) {
    fn(data, path, result, key);
  }
}

/**
 * Determine type of object.
 *
 * @param {object} obj
 * @returns {string}
 */
function type(obj: object) {
  return Array.isArray(obj) ? "array" : typeof obj;
}

/**
 * Get single property from data object.
 *
 * @param {object} data
 * @param {string} pathStr
 * @param {object} result
 * @param {string} key
 */
function seekSingle(data: object, pathStr: string, result: any, key: string) {
  if (pathStr.indexOf("$") < 0) {
    result[key] = pathStr;
  } else {
    var seek = jsonpath.query(data, pathStr) || [];
    result[key] = seek.length ? seek[0] : undefined;
  }
}

/**
 * Get array of properties from data object.
 *
 * @param {object} data
 * @param {array} pathArr
 * @param {object} result
 * @param {string} key
 */
function seekArray(data: object, pathArr: string, result: any, key: string) {
  var subpath = pathArr[1];
  var path = pathArr[0];
  var seek = jsonpath.query(data, path) || [];
  if (seek.length && subpath) {
    result = result[key] = [];

    seek[0].forEach(function (item: any, index: any) {
      walk(item, subpath, result, index);
    });
  } else {
    result[key] = seek;
  }
}

/**
 * Get object property from data object.
 *
 * @param {object} data
 * @param {object} pathObj
 * @param {object} result
 * @param {string} key
 */
function seekObject(data: object, pathObj: string, result: any, key: string) {
  if (typeof key !== "undefined") {
    result = result[key] = {};
  }

  Object.keys(pathObj).forEach(function (name: any) {
    walk(data, pathObj[name], result, name);
  });
}

/**
 * @module jsonpath-object-transform
 * @param {object} data
 * @param {object} path
 * @returns {object}
 */
export function Transformer(data: any, path: any) {
  if (data === undefined) {
    return undefined;
  }

  var result = {};

  walk(data, path, result);

  return result;
}
