import pinataSDK from '@pinata/sdk';
const pinata = pinataSDK('c77d71e91b5bd5bc197c', '7fba28d42362ff86c4dcc6199dbf567296447edbea08f687e6ff3f700b415a96');

export const getIpfsHash = async (data) => {
  const result = await pinata.pinJSONToIPFS(data, null);
  const hash = result.IpfsHash;
  return hash;
};

export const getIpfsHashFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    var headers = new Headers();
    headers.append("pinata_api_key", "c77d71e91b5bd5bc197c");
    headers.append("pinata_secret_api_key", "7fba28d42362ff86c4dcc6199dbf567296447edbea08f687e6ff3f700b415a96");
    var formdata = new FormData();
    formdata.append("file", file);
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: formdata
    };
    fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", requestOptions)
      .then(r => r.json())
      .then(r => {
        resolve(r.IpfsHash);
      })
      .catch(error => reject(error))
  })
};