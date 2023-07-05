import {getJob, getJobs} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";

export const resolvers = {
  Query: {
    job: (_root, args) => getJob(args.id),
    jobs:  () =>  getJobs(),
    company: (__root, args) => getCompany(args.id)
  },
  Job: {
    date: ({createdAt}) => toIsoDate(createdAt),
    company: ({companyId}) => getCompany(companyId)
  }
}

const toIsoDate = x => x.slice(0, 'yyyy-mm-dd'.length)