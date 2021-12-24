export default function firstWord(string: string): string {
  return string.split(" ")[0];
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
