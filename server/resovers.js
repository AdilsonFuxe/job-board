import {createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";
import {GraphQLError} from "graphql";

export const resolvers = {
  Query: {
    job: (_root, args) => getJob(args.id),
    jobs: () => getJobs(),
    company: async (__root, args) => {
      const company = await getCompany(args.id)
      if (!company) {
        throw new GraphQLError(`No company found with id: ${args.id}`, {
          extensions: {code: 'Not_FOUND'}
        })
      }
      return company;
    }
  },

  Mutation: {
    createJob: async (__root, {input: {title, description}}, { user }) => {
      if(!user) {
        throw new GraphQLError(`Unauthorized`, {
          extensions: {code: 'Unauthorized'}
        })
      }
      const result = await createJob({companyId: user.companyId, title, description});
      return result;
    },

    deleteJob: async (__root, {id}) => {
      const job = await deleteJob(id);
      return job;
    },

    updatedJob: async (__root, {input: {id, title, description}}) => {
      const job = await updateJob({id, title, description});
      return job;
    },

  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id)
  },
  Job: {
    date: ({createdAt}) => toIsoDate(createdAt),
    company: ({companyId}) => getCompany(companyId)
  }
}

const toIsoDate = x => x.slice(0, 'yyyy-mm-dd'.length)