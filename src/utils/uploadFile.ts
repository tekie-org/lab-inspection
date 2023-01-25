/* eslint-disable @typescript-eslint/no-explicit-any */
import requestToGraphql from './requestToGraphQL';

const UPLOAD_FILE = () => `
  mutation ($fileInput: FileInput!) {
    uploadFile(fileInput: $fileInput) {
      name
      uri
      id
      type
      createdAt
    }
  }
`;
// const UPLOAD_FILE = () => `
//   mutation ($fileInput: FileInput!, $connectInput: FileConnectInput!) {
//     uploadFile(fileInput: $fileInput, connectInput: $connectInput) {
//       name
//       uri
//       id
//       type
//       createdAt
//     }
//   }
// `;

const uploadFile = async (file: any, fileInfo: any, mappingInfo?: any) => {
  const res = await requestToGraphql(UPLOAD_FILE(), {
    file,
    fileInput: fileInfo,
  });
  const uploadedFileInfo = res?.data?.uploadFile;
  /** When a file is updated,Appending the uri with Date.now() prevents browser to
   show the image with the same uri */
  const fileUri = uploadedFileInfo?.signedUri || uploadedFileInfo?.uri;
  return { ...uploadedFileInfo, uri: fileUri, rawUri: uploadedFileInfo?.uri };
};

export default uploadFile;
