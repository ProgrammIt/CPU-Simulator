/**
 * This method converts a single numerical value contained in a given string between the specified number systems.
 * @param s A string containing a numerical value, which will be converted.
 * @param sourceSystem A decimal value representing the base of the source system.
 * @param targetSystem A decimal value representing the base of the destination system.
 * @returns A character string containing the value transferred to the target system.
*/
function convertNumeralSystem(
  s: string,
  sourceSystem: number,
  targetSystem: number
): string {
  return parseInt(s, sourceSystem).toString(targetSystem);
}