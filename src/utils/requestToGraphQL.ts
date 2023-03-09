import GqlClient from './GqlClient';
import config from './config';

const graphqlClient = new GqlClient({
  url: config.apiBaseURL,
});

const requestToGraphql = async (query: string, variables: object) => {
  return graphqlClient.query(query, variables, {
    headers: {
      authorization: config.appToken,
    },
  });
};

export default requestToGraphql;
