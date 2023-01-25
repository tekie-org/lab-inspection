/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import './ConfigureLab.scss';
import React from 'react';
import base64 from 'base-64';
import requestToGraphql from 'utils/requestToGraphQL';
import uploadFile from 'utils/uploadFile';
import onlineIcon from '../../assets/online.svg';
import offlineIcon from '../../assets/offline.svg';
import {
  BasicDetails,
  LabInspectionMetaData,
  AutomatedInspection,
  Button,
} from './components';
import { MetaData, StateLabelData } from './interface';

const defaultMetaDataValues = {
  totalComputers: undefined,
  totalWorkingComputers: undefined,
  selectedSpeaker: null,
  selectedPowerBackup: null,
  selectedProjector: null,
  internetMode: null,
  selectedPowerBackupType: null,
  mediaFiles: [],
};

const ConfigureLab = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [schools, setSchools] = React.useState<any[] | []>([]);
  const [selectedSchool, setSelectedSchool] =
    React.useState<StateLabelData | null>(null);
  const [selectedLab, setSelectedLab] = React.useState<StateLabelData | null>(
    null
  );
  const [selectedComputerSrNo, setSelectedComputerSrNo] =
    React.useState<StateLabelData>({ label: '1', value: '1' });
  const [metaData, setMetaData] = React.useState<MetaData>(
    defaultMetaDataValues
  );
  const [isQueryProcessing, setIsQueryProcessing] = React.useState(false);
  const [isSyncSuccess, setSyncSuccess] = React.useState(false);
  const [inspectionData, setInspectionData] = React.useState<{
    inspectionMetaData: any;
    softwareApplicationsData: any;
    firewallData: any;
    status: 'compatible' | 'processing' | 'incompatible';
    allSystemInfo: any;
    manualChecksData: any;
  }>({
    inspectionMetaData: null,
    softwareApplicationsData: null,
    firewallData: null,
    status: 'processing',
    allSystemInfo: null,
    manualChecksData: null,
  });

  function arrayToCSV(data: any) {
    const csv = data.map((row: any) => Object.values(row));
    csv.unshift(Object.keys(data[0]));
    return `"${csv.join('"\n"').replace(/,/g, '","')}"`;
  }

  const downloadCSV = function (data: any, csvFileName: string) {
    // Creating a Blob for having a csv file format
    // and passing the data with type
    const blob = new Blob([data], { type: 'text/csv' });

    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob);

    // Creating an anchor(a) tag of HTML
    const a = document.createElement('a');

    // Passing the blob downloading url
    a.setAttribute('href', url);

    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', `${csvFileName}.csv`);

    // Performing a download with click
    a.click();
  };

  const ConfigureLabPages = [
    {
      Component: (
        <BasicDetails
          schools={schools}
          selectedSchool={selectedSchool}
          selectedLab={selectedLab}
          selectedComputerSrNo={selectedComputerSrNo}
          onSchoolChange={(value) => {
            setSelectedSchool(value);
          }}
          onLabChange={(value) => {
            setSelectedLab(value);
          }}
          onComputerSrNoChange={(value) => {
            setSelectedComputerSrNo(value);
          }}
        />
      ),
      title: 'Basic Details',
      buttons: [
        <Button
          classNames="primary-button"
          title="Next"
          isDisabled={!selectedSchool || !selectedLab || !selectedComputerSrNo}
          onClick={() => {
            const schoolId = selectedSchool?.value;
            const inspectionMetaExists = schools
              .find((school) => school.id === schoolId)
              ?.labInspections.find(
                (inspection: any) => inspection.labName === selectedLab?.label
              )?.labConfiguration?.totalNumberOfComputers;
            if (inspectionMetaExists) setCurrentPage(currentPage + 2);
            else setCurrentPage(currentPage + 1);
          }}
        />,
      ],
    },
    {
      Component: (
        <LabInspectionMetaData
          metaDataValue={metaData}
          setCurrentPage={(pageNumber) => setCurrentPage(pageNumber)}
          onChangeMetaData={(metaDataValue) => setMetaData(metaDataValue)}
        />
      ),
      title: 'Lab Inspection',
      buttons: [
        <Button
          classNames="secondary-button"
          title="Skip"
          isDisabled={false}
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        />,
        <Button
          classNames="primary-button"
          title="Next"
          isDisabled={
            metaData &&
            Object.keys(metaData).some(
              (metaName: string) => !metaData[metaName as keyof MetaData]
            )
          }
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        />,
      ],
    },
    {
      Component: (
        <AutomatedInspection
          isSyncSuccess={isSyncSuccess}
          inspectionData={inspectionData}
          currentPage={currentPage}
          metaDataValue={metaData}
          selectedLab={selectedLab}
          selectedComputerSrNo={selectedComputerSrNo}
          setCurrentPage={(pageNumber) => setCurrentPage(pageNumber)}
          selectedSchoolData={
            schools && schools.length
              ? schools.find((school) => school.id === selectedSchool?.value)
              : { name: selectedSchool?.label }
          }
          onChangeMetaData={(metaDataValue) => setInspectionData(metaDataValue)}
        />
      ),
      title: 'Automated Inspection',
      buttons: [
        <Button
          classNames="secondary-button"
          title="Regenerate Report"
          isDisabled={inspectionData.status === 'processing'}
          onClick={() => {
            if (inspectionData.status === 'processing') return;
            window.electron.ipcRenderer.sendMessage('lab-inspection', ['ping']);
            setInspectionData({
              ...inspectionData,
              status: 'processing',
            });
          }}
        />,
        <Button
          classNames="primary-button"
          title="Download Report"
          isDisabled={inspectionData.status === 'processing'}
          onClick={() => {
            if (inspectionData && metaData) {
              let combinedData = {
                schoolName: selectedSchool?.label,
                labName: selectedLab?.label,
                serialNo: selectedComputerSrNo?.label,
                uniqueDeviceId: inspectionData?.allSystemInfo?.system?.uuid,
                status: inspectionData?.status,
                inspectionDate: new Date().toISOString(),
              };
              if (
                inspectionData?.firewallData &&
                inspectionData?.firewallData?.length
              ) {
                inspectionData?.firewallData.forEach((links: any) => {
                  combinedData = {
                    ...combinedData,
                    [links?.name]: links?.status,
                  };
                });
              }
              if (
                inspectionData?.softwareApplicationsData &&
                inspectionData?.softwareApplicationsData?.length
              ) {
                inspectionData?.softwareApplicationsData.forEach(
                  (applications: any) => {
                    combinedData = {
                      ...combinedData,
                      [applications?.key]: applications?.status,
                    };
                  }
                );
              }
              if (
                inspectionData?.manualChecksData &&
                inspectionData?.manualChecksData?.length
              ) {
                inspectionData?.manualChecksData.forEach((manualCheck: any) => {
                  combinedData = {
                    ...combinedData,
                    [manualCheck?.key]: manualCheck?.status,
                  };
                });
              }
              if (
                inspectionData?.inspectionMetaData &&
                inspectionData?.inspectionMetaData?.length
              ) {
                inspectionData?.inspectionMetaData.forEach(
                  (metaDataKey: any) => {
                    combinedData = {
                      ...combinedData,
                      [metaDataKey?.key]: `${metaDataKey?.status} || ${metaDataKey.spec}`,
                    };
                  }
                );
              }
              Object.keys(metaData).forEach((configuration: any) => {
                if (configuration === 'mediaFiles') return;
                let configurationValue =
                  metaData[configuration as keyof MetaData];
                if (configurationValue?.value) {
                  configurationValue = configurationValue?.value;
                }
                combinedData = {
                  ...combinedData,
                  [configuration]: configurationValue,
                };
              });
              console.log('BWER', combinedData);
              const csvData = arrayToCSV([combinedData]);
              let fileName = `${selectedSchool?.label}-${selectedLab?.label}-Sr No ${selectedComputerSrNo.label}`;
              fileName = fileName.split(' ').join('_').toLowerCase();
              downloadCSV(csvData, fileName);
            }
          }}
        />,
      ],
    },
  ];

  async function fetchSchools() {
    // You can await here
    if (navigator.onLine) {
      const res = await requestToGraphql(
        `
        query {
          schools {
            id
            name
            code
            labInspections {
              id
              labName
              description
              labConfiguration {
                totalNumberOfComputers
                projectInteractivePanel
                speakers
                powerBackup
              }
              systems {
                id
                serialNo
                uniqueDeviceId
                status
              }
            }
          }
        }
      `,
        {}
      );
      setSchools(res?.data?.schools || []);
    }
  }

  const addOrUpdateInspectionData = async () => {
    setIsQueryProcessing(true);
    let selectedSchoolData = schools.find(
      (school) => school.id === selectedSchool?.value
    );
    if (!selectedSchoolData && false) {
      const addSchoolQuery = `
        mutation {
          addSchool(
            name: "${selectedSchool?.label}"
            code: "${selectedSchool?.label}"
          ) {
            id
            name
            code
          }
      `;
      const addSchoolResponse = await requestToGraphql(addSchoolQuery, {});
      selectedSchoolData = addSchoolResponse?.data?.addSchool;
    }
    if (selectedSchoolData) {
      let selectedLabData = selectedSchoolData?.labInspections.find(
        (inspection: any) => inspection.labName === selectedLab?.label
      );
      if (!selectedLabData) {
        let labConfigurationString = '';
        const uploadedFiles = [];
        for (const file of metaData.mediaFiles) {
          const uploadedFile = await uploadFile(file, {
            fileBucket: 'python',
          });
          uploadedFiles.push(uploadedFile);
        }
        if (metaData && metaData.totalComputers) {
          labConfigurationString = `
            labConfiguration:{
              totalNumberOfComputers: ${metaData?.totalComputers || '0'}
              totalNumberOfWorkingComputers: ${
                metaData?.totalWorkingComputers || '0'
              }
              projectInteractivePanel: ${metaData?.selectedProjector?.value}
              speakers: ${metaData?.selectedSpeaker?.value}
              powerBackup: ${metaData?.selectedPowerBackup?.value}
              powerBackupType: ${
                metaData?.selectedPowerBackupType?.value || 'none'
              }
              internetConnection: ${metaData?.internetMode?.value || 'none'}
            }
          `;
        }
        let mediaFileConnectString = '';
        if (uploadedFiles?.length) {
          mediaFileConnectString = `
            mediaConnectIds: [${uploadedFiles?.map(
              (file: any) => `"${file?.id}"`
            )}]
          `;
        }
        const addLabQuery = `
          mutation {
            addLabInspection(input:{
              ${labConfigurationString || ''}
              labName: "${selectedLab?.label}"
              inspectionDate: "${new Date().toISOString()}"
            }, schoolConnectId:"${
              selectedSchoolData?.id
            }", ${mediaFileConnectString}) {
              id
              labName
            }
          }
        `;
        const addLabRes = await requestToGraphql(addLabQuery, {});
        selectedLabData = addLabRes?.data?.addLabInspection;
      }

      const inspectedLabDevice = (selectedLabData?.systems || []).find(
        (system: any) =>
          system.uniqueDeviceId === inspectionData?.allSystemInfo?.system?.uuid
      );

      let inspectionChecks = inspectedLabDevice
        ? 'inspectionChecks: { replace: ['
        : 'inspectionChecks: [';
      if (inspectionData && inspectionData.firewallData) {
        inspectionData.firewallData.forEach((link: any) => {
          inspectionChecks += `
            {
              name: "${link.name}",
              type: "firewall",
              status: "${link.status}",
              spec: "${link.key}",
            }
          `;
        });
      }
      if (inspectionData && inspectionData.softwareApplicationsData) {
        inspectionData.softwareApplicationsData.forEach((app: any) => {
          inspectionChecks += `
            {
              name: "${app.name}",
              type: "softwareApplication",
              status: "${app.status}",
              spec: "${app.key}",
            }
          `;
        });
      }
      if (inspectionData && inspectionData.inspectionMetaData) {
        inspectionData.inspectionMetaData.forEach((link: any) => {
          inspectionChecks += `
            {
              name: "${link.name}",
              type: "basic",
              status: "${link.status}",
              spec: "${link.spec}",
            }
          `;
        });
      }
      if (inspectionData && inspectionData.manualChecksData) {
        inspectionData.manualChecksData.forEach((manual: any) => {
          inspectionChecks += `
            {
              name: "${manual.name}",
              type: "manual",
              status: "${manual.status}",
              spec: "${manual.key}",
            }
          `;
        });
      }
      inspectionChecks += inspectedLabDevice ? ']}' : ']';

      const addLabDeviceQuery = `
        mutation {
          ${!inspectedLabDevice ? 'add' : 'update'}LabInspectedDevice(
            ${inspectedLabDevice ? `id: "${inspectedLabDevice?.id}"` : ''}
            input: {
              serialNo: ${parseInt(selectedComputerSrNo?.label, 10)},
              uniqueDeviceId: "${inspectionData?.allSystemInfo?.system?.uuid}",
              inspectionMode: "${navigator.onLine ? 'online' : 'offline'}",
              status: "${inspectionData?.status}",
              ${inspectionChecks}
            }
            inspectionConnectId: "${selectedLabData?.id}"
            schoolConnectId: "${selectedSchoolData?.id}"
          ) {
            id
          }
        }
      `;

      const addLabDeviceRes = await requestToGraphql(addLabDeviceQuery, {});
      if (
        addLabDeviceRes &&
        (addLabDeviceRes?.data?.addLabInspectedDevice?.id ||
          addLabDeviceRes?.data?.updateLabInspectedDevice?.id)
      ) {
        setSyncSuccess(true);
      }
      await fetchSchools();
      setIsQueryProcessing(false);
    }
  };

  React.useEffect(() => {
    if (schools && selectedSchool && selectedLab) {
      const selectedSchoolData = schools.find(
        (school) => school.id === selectedSchool?.value
      );

      if (selectedSchoolData) {
        const selectedLabData = selectedSchoolData?.labInspections.find(
          (inspection: any) => inspection.labName === selectedLab?.label
        );
        if (selectedLabData) {
          const systemSrNos = selectedLabData?.systems.map(
            (system: any) => system.serialNo
          ) || [0];
          setSelectedComputerSrNo({
            label: `${(Math.max(systemSrNos) || 0) + 1}`,
            value: `${(Math.max(systemSrNos) || 0) + 1}`,
          });
        }
      }
    }
  }, [selectedLab]);

  React.useEffect(() => {
    if (
      !isQueryProcessing &&
      inspectionData.allSystemInfo &&
      inspectionData.status !== 'processing' &&
      navigator.onLine
    ) {
      addOrUpdateInspectionData();
    }
  }, [metaData, inspectionData]);

  React.useEffect(() => {
    fetchSchools();
  }, []);

  const currentPageConfiguration = ConfigureLabPages[currentPage];
  return (
    <>
      <div
        className={`onlineOfflineStrip ${
          !navigator?.onLine ? 'offlineStrip' : ''
        }`}
      >
        {navigator.onLine ? (
          <>
            <img src={onlineIcon} alt="inline" />
            You are now connected to the internet.
          </>
        ) : (
          <>
            <img src={offlineIcon} alt="offline" />
            You are currently offline, connect to the internet or download the
            report at the end
          </>
        )}
      </div>
      {currentPageConfiguration?.Component}
      <div className="primary-button-container">
        {currentPageConfiguration?.buttons.map((RenderButton) => RenderButton)}
      </div>
    </>
  );
};

export default ConfigureLab;
