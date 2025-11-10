const trimValue = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const ensureProtocol = (protocol?: string) => {
  if (!protocol) {
    return undefined;
  }
  return protocol.endsWith(':') ? protocol : `${protocol}:`;
};

const stripTrailingSlash = (url?: string) => {
  if (!url) {
    return '';
  }
  return url.replace(/\/+$/, '');
};

const getBrowserHostname = () => {
  if (typeof window !== 'undefined' && window.location.hostname) {
    return window.location.hostname;
  }
  return '127.0.0.1';
};

const getBrowserProtocol = () => {
  if (typeof window !== 'undefined') {
    return window.location.protocol === 'https:' ? 'https:' : 'http:';
  }
  return 'http:';
};

const buildUrl = (protocol: string, hostname: string, port?: string) => {
  const normalizedPort = port && port !== '0' ? `:${port}` : '';
  return `${protocol}//${hostname}${normalizedPort}`;
};

const envApiUrl = trimValue(process.env.REACT_APP_API_URL);
const envApiHost = trimValue(process.env.REACT_APP_API_HOST);
const envApiPort = trimValue(process.env.REACT_APP_API_PORT) || '8899';
const envApiProtocol = ensureProtocol(trimValue(process.env.REACT_APP_API_PROTOCOL));

const detectedProtocol = envApiProtocol || getBrowserProtocol();
const detectedHost = envApiHost || getBrowserHostname();

const fallbackApiUrl = buildUrl(detectedProtocol, detectedHost, envApiPort);

export const API_BASE_URL = stripTrailingSlash(envApiUrl || fallbackApiUrl);

// Debug: print resolved API and WS URLs at runtime in development to help diagnose connection issues
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('[config] API_BASE_URL =', API_BASE_URL);
}
const envWsUrl = trimValue(process.env.REACT_APP_WS_URL);
const envWsProtocol =
  ensureProtocol(trimValue(process.env.REACT_APP_WS_PROTOCOL)) ||
  (API_BASE_URL.startsWith('https://') ? 'wss:' : 'ws:');
const envWsPort = trimValue(
  process.env.REACT_APP_WS_PORT ||
  process.env.REACT_APP_API_WS_PORT ||
  process.env.REACT_APP_API_PORT,
) || envApiPort;

const deriveWsUrlFromHttp = (httpUrl: string) => {
  if (httpUrl.startsWith('https://')) {
    return `wss://${httpUrl.slice('https://'.length)}`;
  }
  if (httpUrl.startsWith('http://')) {
    return `ws://${httpUrl.slice('http://'.length)}`;
  }
  return httpUrl;
};

const fallbackWsUrl = buildUrl(envWsProtocol, detectedHost, envWsPort);

export const WS_BASE_URL = stripTrailingSlash(envWsUrl || deriveWsUrlFromHttp(API_BASE_URL) || fallbackWsUrl);

export const apiPath = (path: string) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const wsPath = (path: string) => `${WS_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
