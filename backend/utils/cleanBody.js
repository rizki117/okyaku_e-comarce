// utils/cleanBody.js
export const cleanBody = (body) => {
  const result = {};

  Object.keys(body).forEach((key) => {
    const cleanKey = key.trim();

    let value = body[key];

    if (typeof value === "string") {
      value = value.trim();
      if (value === "") value = null;
    }

    result[cleanKey] = value;
  });

  return result;
};