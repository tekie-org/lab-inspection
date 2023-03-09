import requestToGraphql from 'utils/requestToGraphQL';

const SCHOOLS_QUERY_STRING = `
  query {
    schools {
      id
      name
      code
      labInspections {
        id
        labName
        labNo
        description
        comment
        labConfiguration {
          totalNumberOfComputers
          totalNumberOfWorkingComputers
          projectInteractivePanel
          speakers
          powerBackupType
          powerBackup
          internetConnection
          internetSpeed
          inspectionDate
          serviceProviderType
        }
        systems {
          id
          serialNo
          uniqueDeviceId
          status
          comment
          inspectionChecks {
            name
            type
            status
            spec
          }
        }
      }
    }
  }
`;

const fetchSchools = async () => {
  const response = await requestToGraphql(SCHOOLS_QUERY_STRING, {});

  return response;
};

export default fetchSchools;
