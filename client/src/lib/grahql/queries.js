import {GraphQLClient, gql} from 'graphql-request'
import {getAccessToken} from "../auth";

const client = new GraphQLClient('http://localhost:9000/graphql', {
  headers: () => {
    const accessToken = getAccessToken();
    if(accessToken) {
      return {'Authorization': `Bearer ${accessToken}`}
    }
    return {};
  }
});

export const createJob = async ({title,description}) => {
  const query = gql`
      mutation CreateJob($input: CreateJobInput!)  {
          job: createJob(input: $input) {
              id
          }
      }
  `

  const {job} =  await  client.request(query, { input: {title, description} });
  return job;
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
  const { jobs } = await client.request(query);
  return jobs
}

export  const getJob = async (id) => {
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
  const {job} =  await  client.request(query, { id });
  return job;
}

export  const getCompany = async (id) => {
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
  const { company } = await client.request(query, { id });
  return company;
}