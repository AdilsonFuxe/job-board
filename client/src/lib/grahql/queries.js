import {ApolloClient, InMemoryCache, gql, createHttpLink, ApolloLink, concat} from '@apollo/client';
import {getAccessToken} from "../auth";

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

const JobDetailFragment = gql`
    fragment JobDetails on Job {
        id,
        title,
        description,
        date,
        company {
            id,
            name
        }
    }
`

export const getJobs = async () => {
  const query = gql`
      ${JobDetailFragment}
      query GetJobs {
          jobs {
              ...JobDetails
          }
      }
  `
  const {data} = await apolloClient.query({query})
  return data.jobs;
}

export const getJob = async (id) => {
  const query = gql`
      ${JobDetailFragment}
      query Job($id: ID!) {
          job(id: $id) {
              ...JobDetails
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