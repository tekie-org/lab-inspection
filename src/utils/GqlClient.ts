import fetch from 'isomorphic-fetch';

export default class GqlClient {
  public url: string;

  constructor({ url }: { url: string }) {
    this.url = url;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async query(query: string, variables: object, options: any) {
    const { headers, ...others } = options;
    // Creates a stringfied query
    const graphqlQuery = JSON.stringify({
      query,
      variables,
    });

    // sets fetchOption without any body append
    // because there are no files here and we
    // directly assign body to graphqlQuery
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: graphqlQuery,
      ...others,
    };
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
