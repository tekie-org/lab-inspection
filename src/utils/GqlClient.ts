/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'isomorphic-fetch';

const isObject = (value: any) => typeof value === 'object' && value !== null;

const extractFiles = (tree: object, treePath = '') => {
  const files: { path: string; file: any }[] = [];

  const recurse = (node: any, nodePath: string) => {
    Object.keys(node).forEach((key) => {
      if (!isObject(node[key])) return;
      const path = `${nodePath}${key}`;
      if (
        (typeof File !== 'undefined' && node[key] instanceof File) ||
        (typeof Blob !== 'undefined' && node[key] instanceof Blob)
      ) {
        files.push({ path, file: node[key] });
        node[key] = null; // eslint-disable-line no-param-reassign
        return;
      }

      if (typeof FileList !== 'undefined' && node[key] instanceof FileList) {
        node[key] = Array.prototype.slice.call(node[key]); // eslint-disable-line no-param-reassign
      }
      recurse(node[key], `${path}.`);
    });
  };

  if (isObject(tree)) {
    recurse(tree, treePath === '' ? treePath : `${treePath}.`);
  }
  return files;
};

export default class GqlClient {
  public url: string;

  constructor({ url }: { url: string }) {
    this.url = url;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async query(query: string, variables: object, options: any) {
    const { headers, ...others } = options;
    const files = extractFiles(variables);
    // Creates a stringfied query
    const graphqlQuery = JSON.stringify({
      query,
      variables,
    });

    let fetchOptions: any = {};
    // sets fetchOption without any body append
    // because there are no files here and we
    // directly assign body to graphqlQuery
    if (files.length) {
      // ...then creates a form object
      const body = new FormData();
      // appends query into body
      body.append('operations', graphqlQuery);
      // apppend files into body
      files.forEach(({ path, file }: any) => {
        let updatedFile = file;
        if (path === 'file') {
          // If file type is of other type,
          // then we are extracting the type and creating a new File with type
          if (updatedFile.name) {
            const fileType = updatedFile.name.split('.')[1];
            const { type } = updatedFile;
            if (fileType) {
              const newFile = new File([updatedFile], updatedFile.name, {
                type: `${type || 'application'}/${fileType}`,
              });
              updatedFile = newFile;
            }
          }
        }
        body.append(path, updatedFile);
      });
      // sets fetchOptions
      fetchOptions = {
        method: 'POST',
        body,
        ...options,
      };
    } else {
      fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: graphqlQuery,
        ...others,
      };
    }
    try {
      // fetches the Data
      // console.log(graphqlQuery)
      const response = await fetch(this.url, fetchOptions);
      const result = await response.json();
      // console.log(JSON.stringify(result, null, 2))
      // Checks if there are any error in result
      if (result.errors) {
        // throw the result
        return result;
      }
      // otherwise just normally return them
      return result;
    } catch (e: any) {
      return {
        data: null,
        errors: e,
      };
    }
  }
}
