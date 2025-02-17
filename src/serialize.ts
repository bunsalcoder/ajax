// const serializeObj = (obj: any) => JSON.stringify(obj);
export const serializeObj = (obj: any, method: string) => {
  if (method.toLowerCase() !== "get") return JSON.stringify(obj);

  const items = Object.keys(obj).reduce((carry: any, key: any) => {
    // carry.push(`${key}=${encodeURIComponent(obj[key])}`);
    carry.push(`${key}=${obj[key]}`);
    return carry;
  }, []);
  return items.join("&");
};

const addValue = (name: string, value: any, searchParams: URLSearchParams) => {
  if (value.toString().length <= 0) return searchParams;
  searchParams.append(name, value);
  return searchParams;
};

const getInputValue = (element: any, data: any) => {
  const nodeType = element.type.toLowerCase();
  const { name, value } = element;

  if (nodeType === "checkbox") {
    const isChecked = element.checked;
    if (!isChecked) return data;
    return addValue(name, value, data);
  }

  return addValue(name, value, data);
};

const getSelectValue = (element: any, data: any) => {
  const { name } = element;
  if (!(element.multiple || false)) {
    const { value } = element;
    return addValue(name, value, data);
  }
  const selectedOptions = [...element.selectedOptions];
  return selectedOptions.reduce((accu, option: any) => {
    const { value } = option;
    return addValue(name, value, data);
  }, data);
};

const getNodeValue = (element: any, data: any) => {
  const nodeName = element.nodeName.toLowerCase();

  if (nodeName === "input") return getInputValue(element, data);
  if (nodeName === "select") return getSelectValue(element, data);

  const { value, name } = element;
  return addValue(name, value, data);
};

const serializeForm = (form: any): any => {
  const elements = [...form.elements];
  return elements.reduce((data, element) => {
    if (element.name || false) {
      const result = getNodeValue(element, data);
      return result;
    }
    return data;
  }, new URLSearchParams());
};

export const isForm = (body: any) => {
  if (!(body || false)) return false;
  return body.nodeName || false
    ? body.nodeName.toLowerCase() === "form"
    : false;
};

const isFormData = (body: any) => body.toString() === "[object FormData]";

export default function serialize(body: any, method: string) {
  if (!body) return null;
  if (isFormData(body)) return body;
  return isForm(body) ? serializeForm(body) : serializeObj(body, method);
}
