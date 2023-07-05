import JobList from '../components/JobList';
import {useEffect, useState} from 'react'
import {getJobs} from "../lib/grahql/queries";

function HomePage() {
  const [jobs, setJobs] =useState([]);
  useEffect( () => {
    getJobs().then((result) => {setJobs(result)}).catch(console.error)
  },[])
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
