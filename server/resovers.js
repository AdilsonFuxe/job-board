import {getJob, getJobs, getJobsByCompany} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";
import {GraphQLError} from "graphql";

export const resolvers = {
  Query: {
    job: (_root, args) => getJob(args.id),
    jobs:  () =>  getJobs(),
    company: async (__root, args) => {
      const company = await getCompany(args.id)
      if(!company) {
        throw new GraphQLError(`No company found with id: ${args.id}`, {
          extensions:{ code: 'Not_FOUND'}
        })
      }
      return company;
    }
  },
  Company: {
    jobs: (company) =>  getJobsByCompany(company.id)
  },
  Job: {
    date: ({createdAt}) => toIsoDate(createdAt),
    company: ({companyId}) => getCompany(companyId)
  }
}

const toIsoDate = x => x.slice(0, 'yyyy-mm-dd'.length)