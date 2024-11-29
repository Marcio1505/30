import API from '../API.redux';

const uploadEndpoints = {
  create: {
    url: 'file',
    method: 'POST',
  },
};

export const uploadFile = async ({
  company,
  arquivo,
  apiOptions = {},
} = {}) => {
  const formData = new FormData();

  formData.append('arquivo', arquivo);
  formData.append('company', JSON.stringify(company));
  return API(apiOptions)({
    url: uploadEndpoints.create.url,
    method: uploadEndpoints.create.method,
    data: formData,
  });
};
