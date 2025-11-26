export const toDataURL = (url: string) => {
  return fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
};

export const downloadFile = async (url: string, fileName?: string) => {
  const a = document.createElement('a');
  a.href = await toDataURL(url);
  a.download = fileName ?? 'download';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
