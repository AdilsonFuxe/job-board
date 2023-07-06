import { useParams } from 'react-router';
import { companies } from '../lib/fake-data';
import {useEffect, useState} from "react";
import {getCompany} from "../lib/grahql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false
  })

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId);
        setState({company, error: false, loading: false})
      }
      catch (e) {
        setState({company: null, error: true, loading: false})
      }
    })()
  }, [companyId]);

  const { company, error, loading } = state;
  if(loading) {
    return <div>Loading...</div>
  }

  if(error) {
    return <div className="has-text-danger">Data unavailable</div>
  }
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>

      <h2 className="subtitle">Jobs at {company.name}</h2>

      <JobList jobs={company.jobs}/>
    </div>
  );
}

export default CompanyPage;
