import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// IPv4 Segment
const v4Seg = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])';
const v4Str = `(?:${v4Seg}\\.){3}${v4Seg}`;
const IPv4Reg = new RegExp(`^${v4Str}$`);

// IPv6 Segment
const v6Seg = '(?:[0-9a-fA-F]{1,4})';
const IPv6Reg = new RegExp('^(?:' +
  `(?:${v6Seg}:){7}(?:${v6Seg}|:)|` +
  `(?:${v6Seg}:){6}(?:${v4Str}|:${v6Seg}|:)|` +
  `(?:${v6Seg}:){5}(?::${v4Str}|(?::${v6Seg}){1,2}|:)|` +
  `(?:${v6Seg}:){4}(?:(?::${v6Seg}){0,1}:${v4Str}|(?::${v6Seg}){1,3}|:)|` +
  `(?:${v6Seg}:){3}(?:(?::${v6Seg}){0,2}:${v4Str}|(?::${v6Seg}){1,4}|:)|` +
  `(?:${v6Seg}:){2}(?:(?::${v6Seg}){0,3}:${v4Str}|(?::${v6Seg}){1,5}|:)|` +
  `(?:${v6Seg}:){1}(?:(?::${v6Seg}){0,4}:${v4Str}|(?::${v6Seg}){1,6}|:)|` +
  `(?::(?:(?::${v6Seg}){0,5}:${v4Str}|(?::${v6Seg}){1,7}|:))` +
')(?:%[0-9a-zA-Z-.:]{1,})?$');

function isIPv4(s: string) {

  return IPv4Reg.test(s);
}

function isIPv6(s: string) {

  return IPv6Reg.test(s);
}

function isIP(s: string): 4 | 6 | 0 {

  if (isIPv4(s)) return 4;
  if (isIPv6(s)) return 6;

  return 0;
}

export function ValidURL(rawUrl: string): boolean {
  let uri: URL;
  try {
    uri = new URL(rawUrl);
  } catch {
    return false;
  }

  const port = uri.port;

  if (
    port &&
    !(
      (uri.protocol !== "http:" && port !== "80") &&
      (uri.protocol !== "https:" && port !== "443")
    )
  ) {
    return false;
  }

  const hostname = uri.hostname;

  if (!hostname) {
    return false;
  }

  if (isIP(hostname)) {
    return false;
  }

  if (hostname.endsWith(".local") || hostname === "localhost") {
    return false;
  }

  return true;
}