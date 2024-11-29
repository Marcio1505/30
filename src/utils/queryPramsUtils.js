export const addArrayParam = (params, paramName, values, key = null) => {
  if (values && values.length) {
    if (key) {
      values.forEach((value) => {
        params += `&${paramName}[]=${value[key]}`;
      });
    } else {
      values.split(',').forEach((value) => {
        params += `&${paramName}[]=${value}`;
      });
    }
  }
  return params;
};

export const addArrayParams = (params, arrayOfParameters) => {
  arrayOfParameters.forEach((param) => {
    params = addArrayParam(params, param[0], param[1], param?.[2] || null);
  });
  return params;
};
