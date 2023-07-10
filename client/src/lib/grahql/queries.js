import {ApolloClient, InMemoryCache, gql, createHttpLink, ApolloLink, concat} from '@apollo/client';
import {GraphQLClient} from 'graphql-request'
import {getAccessToken} from "../auth";

// const client = new GraphQLClient('http://localhost:9000/graphql', {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return {'Authorization': `Bearer ${accessToken}`}
//     }
//     return {};
//   }
// });

const httpLink = createHttpLink({
  uri: 'http://localhost:9000/graphql'
})

const authLink= new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if(accessToken) {
    operation.setContext({
      headers: {'Authorization': `Bearer ${accessToken}`}
    })
  }
  return forward(operation);
})

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache()
});

export const createJob = async ({title, description}) => {
  const mutation = gql`
      mutation CreateJob($input: CreateJobInput!)  {
          job: createJob(input: $input) {
              id
          }
      }
  `
  const {data} = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description
      }
    }
  })
  return data.job;
}

export const getJobs = async () => {
  const query = gql`
      query Query {
          jobs {
              id,
              title,
              date,
              company {
                  id,
                  name
              }
          }
      }
  `
  const {data} = await apolloClient.query({query})
  return data.jobs;
}

export const getJob = async (id) => {
  const query = gql`
      query Job($id: ID!) {
          job(id: $id) {
              id,
              title,
              description,
              date,
              company {
                  id,
                  name
              },
          }
      }
  `
  const {data} = await apolloClient.query({
    query, variables: {
      id
    }
  })
  return data.job;
}

export const getCompany = async (id) => {
  const query = gql`
      query Job($id: ID!) {
          company(id: $id) {
              id,
              name,
              description,
              jobs {
                  id,
                  title,
                  description,
                  date
              }
          }
      }
  `
  const {data} = await apolloClient.query({query, variables: {id}})
  return data.company;
}