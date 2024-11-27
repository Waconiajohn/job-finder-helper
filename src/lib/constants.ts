export const ATS_PLATFORMS = [
  // Major Enterprise ATS
  {
    id: "workday",
    name: "Workday",
    domain: "myworkday.com OR careers.*.workday.com"
  },
  {
    id: "successfactors",
    name: "SAP SuccessFactors",
    domain: "jobs.sap.com OR careers.*.successfactors.com"
  },
  {
    id: "icims",
    name: "iCIMS",
    domain: "jobs.icims.com"
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    domain: "boards.greenhouse.io"
  },
  {
    id: "lever",
    name: "Lever",
    domain: "jobs.lever.co"
  },
  {
    id: "adp",
    name: "ADP",
    domain: "workforcenow.adp.com"
  },
  {
    id: "taleo",
    name: "Oracle Taleo",
    domain: "taleo.net"
  },
  {
    id: "jobvite",
    name: "Jobvite",
    domain: "jobs.jobvite.com"
  },
  {
    id: "smartrecruiters",
    name: "SmartRecruiters",
    domain: "jobs.smartrecruiters.com"
  },
  {
    id: "bamboohr",
    name: "BambooHR",
    domain: "bamboohr.com/careers"
  },
  {
    id: "ashby",
    name: "Ashby",
    domain: "jobs.ashbyhq.com"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    domain: "linkedin.com/jobs"
  },
  {
    id: "indeed",
    name: "Indeed",
    domain: "indeed.com"
  }
] as const;

export const DATE_RANGES = [
  { value: "1", label: "Last 24 hours" },
  { value: "3", label: "Last 3 days" },
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
  { value: "0", label: "Any time" }
] as const;

export const WORK_LOCATIONS = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" }
] as const;
