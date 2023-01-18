/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import './ConfigureLab.scss';
import React from 'react';
import base64 from 'base-64';
import requestToGraphql from 'utils/requestToGraphQL';
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
  totalComputers: null,
  avgNoOfStudents: null,
  selectedSpeaker: null,
  selectedPowerBackup: null,
  selectedProjector: null,
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
  const [inspectionData, setInspectionData] = React.useState<{
    inspectionMetaData: any;
    softwareApplicationsData: any;
    firewallData: any;
    status: 'compatible' | 'processing' | 'incompatible';
    allSystemInfo: any;
  }>({
    inspectionMetaData: null,
    softwareApplicationsData: null,
    firewallData: null,
    status: 'processing',
    allSystemInfo: null,
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
            if (selectedSchool && selectedLab && selectedComputerSrNo) {
              const schoolName = selectedSchool.label;
              const inspectionMetaExists = schools
                .find((school) => school.name === schoolName)
                ?.labInspections.find(
                  (inspection: any) => inspection.labName === selectedLab.label
                )?.labConfiguration?.totalNumberOfComputers;
              if (inspectionMetaExists) setCurrentPage(currentPage + 2);
              else setCurrentPage(currentPage + 1);
            }
          }}
        />,
      ],
    },
    {
      Component: (
        <LabInspectionMetaData
          metaDataValue={metaData}
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
            const isDisabled =
              metaData &&
              Object.keys(metaData).some(
                (metaName: string) => !metaData[metaName as keyof MetaData]
              );
            if (!isDisabled) {
              setCurrentPage(currentPage + 1);
            }
          }}
        />,
      ],
    },
    {
      Component: (
        <AutomatedInspection
          inspectionData={inspectionData}
          currentPage={currentPage}
          metaDataValue={metaData}
          selectedLab={selectedLab}
          selectedComputerSrNo={selectedComputerSrNo}
          selectedSchoolData={
            schools && schools.length
              ? schools.find((school) => school.name === selectedSchool?.label)
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
              const combinedData = {
                schoolName: selectedSchool?.label,
                labName: selectedLab?.label,
                labConfiguration: base64.encode(JSON.stringify(metaData)),
                serialNo: selectedComputerSrNo?.label,
                uniqueDeviceId: inspectionData?.allSystemInfo?.system?.uuid,
                status: inspectionData?.status,
                firewallChecks: inspectionData?.firewallData
                  ? base64.encode(JSON.stringify(inspectionData?.firewallData))
                  : null,
                softwareApplicationChecks:
                  inspectionData?.softwareApplicationsData
                    ? base64.encode(
                        JSON.stringify(inspectionData?.softwareApplicationsData)
                      )
                    : null,
                basicChecks: inspectionData?.inspectionMetaData
                  ? base64.encode(
                      JSON.stringify(inspectionData?.inspectionMetaData)
                    )
                  : null,
                date: new Date().toISOString(),
              };
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
            labInspections {
              id
              labName
              description
              labConfiguration {
                totalNumberOfComputers
                avgNumberOfStudents
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
    const selectedSchoolData = schools.find(
      (school) => school.name === selectedSchool?.label
    );
    let selectedLabData = selectedSchoolData?.labInspections.find(
      (inspection: any) => inspection.labName === selectedLab?.label
    );
    if (!selectedLabData) {
      let labConfigurationString = '';
      if (metaData && metaData.totalComputers) {
        labConfigurationString = `
          labConfiguration:{
            totalNumberOfComputers: ${parseInt(
              metaData?.totalComputers?.value || '0',
              10
            )}
            avgNumberOfStudents: ${parseInt(
              metaData?.avgNoOfStudents?.value || '0',
              10
            )}
            projectInteractivePanel: ${metaData?.selectedProjector?.value}
            speakers: ${metaData?.selectedSpeaker?.value}
            powerBackup: ${metaData?.selectedPowerBackup?.value}
          }
        `;
      }
      const addLabQuery = `
        mutation {
          addLabInspection(input:{
            ${labConfigurationString || ''}
            labName: "${selectedLab?.label}"
            inspectionDate: "${new Date().toISOString()}"
          }, schoolConnectId:"${selectedSchoolData?.id}") {
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

    let firewallChecks = '';
    if (inspectionData && inspectionData.firewallData) {
      firewallChecks = !inspectedLabDevice
        ? 'firewallChecks: ['
        : 'firewallChecks: { replace: [';
      inspectionData.firewallData.forEach((link: any) => {
        firewallChecks += `
          {
            name: "${link.name}",
            type: "firewall",
            status: "${link.status}",
            spec: "${link.key}",
          }
        `;
      });
      firewallChecks += !inspectedLabDevice ? ']' : '] }';
    }
    let softwareApplicationChecks = '';
    if (inspectionData && inspectionData.softwareApplicationsData) {
      softwareApplicationChecks = !inspectedLabDevice
        ? 'applicationChecks: ['
        : 'applicationChecks: { replace: [';
      inspectionData.softwareApplicationsData.forEach((app: any) => {
        softwareApplicationChecks += `
          {
            name: "${app.name}",
            type: "softwareApplication",
            status: "${app.status}",
            spec: "${app.key}",
          }
        `;
      });
      softwareApplicationChecks += !inspectedLabDevice ? ']' : '] }';
    }
    let basicChecks = '';
    if (inspectionData && inspectionData.inspectionMetaData) {
      basicChecks = !inspectedLabDevice
        ? 'basicChecks: ['
        : 'basicChecks: { replace: [';
      inspectionData.inspectionMetaData.forEach((link: any) => {
        basicChecks += `
          {
            name: "${link.name}",
            type: "firewall",
            status: "${link.status}",
            spec: "${link.spec}",
          }
        `;
      });
      basicChecks += !inspectedLabDevice ? ']' : '] }';
    }
    const addLabDeviceQuery = `
      mutation {
        ${!inspectedLabDevice ? 'add' : 'update'}LabInspectedDevice(
          ${inspectedLabDevice ? `id: "${inspectedLabDevice?.id}"` : ''}
          input: {
            serialNo: ${parseInt(selectedComputerSrNo?.label, 10)},
            uniqueDeviceId: "${inspectionData?.allSystemInfo?.system?.uuid}",
            inspectionMode: "${navigator.onLine ? 'online' : 'offline'}",
            status: "${inspectionData?.status}",
            ${firewallChecks}
            ${softwareApplicationChecks}
            ${basicChecks}
          }
          inspectionConnectId: "${selectedLabData?.id}"
          schoolConnectId: "${selectedSchoolData?.id}"
        ) {
          id
        }
      }
    `;

    await requestToGraphql(addLabDeviceQuery, {});
    await fetchSchools();
    setIsQueryProcessing(false);
  };

  React.useEffect(() => {
    if (schools && selectedSchool && selectedLab) {
      const selectedSchoolData = schools.find(
        (school) => school.name === selectedSchool?.label
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
            You are currently offline, connect to the internet or download the report at the end
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
