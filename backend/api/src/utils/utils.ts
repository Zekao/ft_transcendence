import { isAlphanumeric } from "class-validator";

export function isUuid(id: string): boolean {
  const splited: string[] = id.split("-");
  for (const s in splited) {
    if (!isAlphanumeric(s)) return false;
  }
  return (
    id.length === 36 &&
    splited.length === 5 &&
    splited[0].length === 8 &&
    splited[1].length === 4 &&
    splited[2].length === 4 &&
    splited[3].length === 4 &&
    splited[4].length === 12
  );
}
