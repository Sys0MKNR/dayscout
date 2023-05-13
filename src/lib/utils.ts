import hslToHex from "hsl-to-hex";

export function getFromObj<T>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue: any = null
): T {
  return path.split(".").reduce((o, p) => (o ? o[p] : defaultValue), obj) as T;
}

export function convertHSLStringToHex(hsl: string): string {
  const tokens = hsl.split(" ");

  let h = parseFloat(tokens[0]);

  const s = parseFloat(tokens[1].substring(0, tokens[1].length - 1));
  const l = parseFloat(tokens[2].substring(0, tokens[2].length - 1));

  return hslToHex(h, s, l);
}

export function convertHSLToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  let rStr = Math.round((r + m) * 255).toString(16);
  let gStr = Math.round((g + m) * 255).toString(16);
  let bStr = Math.round((b + m) * 255).toString(16);

  if (rStr.length == 1) rStr = "0" + r;
  if (gStr.length == 1) gStr = "0" + g;
  if (bStr.length == 1) bStr = "0" + b;

  return "#" + rStr + gStr + bStr;
}

export function getHexColorFromCSSVar(color: string) {
  // BUG: computedvalue is corrupted when requested too early
  const colorValue = getComputedStyle(
    document.documentElement
  ).getPropertyValue(color);

  console.log(colorValue);

  setTimeout(() => {
    const colorValue = getComputedStyle(
      document.documentElement
    ).getPropertyValue(color);

    console.log(colorValue);
  }, 2000);

  return convertHSLStringToHex(colorValue.trim());
}

export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
export const invlerp = (x: number, y: number, a: number) =>
  clamp((a - x) / (y - x));
export const clamp = (a: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, a));
export const range = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  a: number
) => lerp(x2, y2, invlerp(x1, y1, a));

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type Subset<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? Subset<K[attr]>
    : K[attr] extends object | null
    ? Subset<K[attr]> | null
    : K[attr] extends object | null | undefined
    ? Subset<K[attr]> | null | undefined
    : K[attr];
};
