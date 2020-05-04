export const asyncFilter = async (arr, predicate): Promise<Array<any>> => {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
};
