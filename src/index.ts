import serialize, { isForm, serializeObj } from "./serialize";

export const mode = {
  cors: "cors",
  noCors: "no-cors",
  sameOrigin: "same-origin",
};

export const cache = {
  default: "default",
  noCache: "no-cache",
  reload: "reload",
  forceCache: "force-cache",
  onlyIfCache: "only-if-cache",
};

export const credential = {
  sameOrigin: "same-origin",
  include: "include",
  omit: "omit",
};

export const redirect = {
  follow: "follow",
  manual: "manual",
  error: "error",
};

export const contentType = {
  JSON: "application/json;charset=UTF-8",
  URL_ENCODED: "application/x-www-form-urlencoded",
};

const parseJSON = (text: string, res: any): any => {
  try {
    return JSON.parse(text);
  } catch (error: any) {
    const { statusText, status } = res;
    return {
      error: true,
      code: status,
      message: statusText,
    };
  }
};

// Validate the HTTP error (not 200) and convert
// the response body into text and pass to Error
// To get the catch, developer need to call the following
// method to get the JSON parse object.
// .catch((error) => JSON.parse(error.message))
const handleError = (res: any) => {
  if (res.status >= 300 || res.status < 200) {
    const cloned = res.clone();
    return res.text().then((error: any) => {
      throw parseJSON(error, cloned);
    });
  }
  return res;
};

const strXParam = "x-params-not-found";

const cleanUrl = (url: string): string => {
  const optionalReg = /:\w+\?/g;
  const cleanedUrl = url.replace(optionalReg, "");
  return cleanedUrl;
};

export const getUrlWithParams = (
  url: string,
  params: Record<string, any> = {}
): string => {
  const regex = /:\w+\??/g;
  const keys: string[] = url.match(regex) || [];
  const theUrl = keys.reduce((curUrl: string, key: string) => {
    const cleanedKey = key.replace(/[:?]/g, "");
    const value = params[cleanedKey] || strXParam;
    if (value === strXParam) return curUrl;
    return curUrl.replace(key, encodeURIComponent(value));
  }, url);
  return cleanUrl(theUrl);
};

export const getUrl = (url: string, props: any) => {
  const { query = {}, params = {} } = props;
  const urlWithParams = getUrlWithParams(url, params);
  const queryData = serialize(query, "get").toString();
  if (queryData.trim().length <= 0) return urlWithParams;

  const sign = urlWithParams.indexOf("?") >= 0 ? "&" : "?";
  return `${urlWithParams}${sign}${queryData}`;
};

const getData = (url: string, props: any = {}) => {
  const { method = "get", body = {} } = props;
  const httpMethod = method.toLowerCase();
  const data = serialize(body || false, httpMethod) || "";

  const theUrl = getUrl(url, props);
  switch (httpMethod) {
    case "get":
    case "head":
      return [theUrl, null];
    default:
      return [theUrl, data];
  }
};

const getHeaders = (props: any) => {
  const headers = {
    // accept: contentType.JSON,
    Accept: contentType.JSON,
    /*
    'ajax-request': 'xmlhttprequest',
    'x-requested-with': 'xmlhttprequest',
    'x-origin': 'AJAX Client',
    */
  };
  const { body = false } = props;
  if (isForm(body)) return headers;

  return {
    "Content-Type": contentType.JSON,
    ...headers,
  };
};

const handleResponse = (res: any) => {
  const resContentType = res.headers.get("content-type");
  const isJson = resContentType.indexOf("application/json") !== -1;
  if (isJson) return res.json();
  return res.text();
};

const bodyCheck = (props: any, body: any) => {
  const isEmpty = body === "{}" || body === "";
  if (isEmpty) return props;
  return { ...props, body };
};

/**
 * The ajax function to request to url with props data
 * @param {string} url: Url to be sent to
 * @param {object} pProps: override parameter to be sent
 * @return await
 */
export default function ajax(url: string, pProps: any = {}) {
  const { headers = {} } = pProps;
  const [toUrl, body] = getData(url, pProps);

  const props = {
    method: "get",
    cache: cache.default,
    redirect: redirect.follow,
    credentials: credential.sameOrigin,
    ...pProps,
    headers: {
      ...getHeaders(pProps),
      ...headers,
    },
  };

  const nextProps = bodyCheck(props, body);

  return fetch(toUrl, nextProps).then(handleError).then(handleResponse);
}
