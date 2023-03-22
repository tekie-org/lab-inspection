/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import './ConfigureLab.scss';
import React from 'react';
import requestToGraphql from 'utils/requestToGraphQL';
import {
  displayOptions,
  internetOptions,
  powerBackupOptions,
  powerBackupTypeOptions,
  serviceProviderType,
  speakerOptions,
  yesNoOption,
} from 'utils/configurationOptions';
import offlineIcon from '../../assets/offline.svg';
import BadgeSvg from '../../assets/badge.svg';
import { BasicDetails, AutomatedInspection, Button } from './components';
import { MetaData, StateLabelData } from './interface';
import ManualInspection, { manualChecks } from './components/ManualInspection';
import fetchSchoolList from './utils/fetchSchools';
import {
  automatedChecks,
  softwareApplicationLabelMap,
  StatusBadgeIcons,
} from './components/AutomatedInspection';

const defaultMetaDataValues = {
  totalComputers: 0,
  totalWorkingComputers: 0,
  selectedSpeaker: null,
  selectedPowerBackup: null,
  selectedProjector: null,
  internetMode: null,
  internetSpeed: 0,
  selectedPowerBackupType: null,
  serviceProviderType: null,
  inspectionDate: new Date().toISOString(),
  sharedSystemArchSetup: {
    value: 'no',
    label: 'No',
  },
  masterSystem: null,
  totalNumberOfConnectedSystems: 0,
};

const InspectionProgress = ({
  stepperProgress,
  pages,
  currentPage,
}: {
  stepperProgress: any;
  pages: any[];
  currentPage: number;
}) => {
  return (
    <div className="progress-container">
      {pages.map((page, index) => (
        <div
          key={page.title}
          className={`progress-steps ${currentPage === index ? 'active' : ''} ${
            currentPage > index ? 'completed' : ''
          }`}
        >
          <div className="progress-step-label">Step {index + 1}</div>
          <div className="progress-step-title">
            {page.title}
            <span className="progress-step-percentage">
              {stepperProgress[index]()}%
            </span>
          </div>
          {currentPage === index && (
            <>
              <div
                style={{
                  position: 'absolute',
                  bottom: '0px',
                  width: '100%',
                  height: '4px',
                  left: '1px',
                  margin: 0,
                  background: 'rgba(140, 97, 203, 0.4)',
                  transition: 'all .3s ease-in-out',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '0px',
                  width: `${stepperProgress[index]()}%`,
                  height: '4px',
                  left: '1px',
                  margin: 0,
                  background: '#8C61CB',
                  transition: 'all .3s ease-in-out',
                }}
              />
            </>
          )}
        </div>
      ))}
      <span
        className="progress-bar"
        style={{
          background: '#E2E2E2',
        }}
      />
      <span
        className="progress-bar"
        style={{
          width: `${(currentPage / (pages.length - 1)) * 100}%`,
          backgroundColor: '#8C61CB',
        }}
      />
    </div>
  );
};

const ConfigureLab = () => {
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [certError, setCertError] = React.useState<boolean>(false);
  const [schoolFetching, setSchoolFetching] = React.useState<boolean>(false);
  const [metaDataAlreadyExists, setMetaDataAlreadyExists] =
    React.useState<boolean>(false);
  const [schools, setSchools] = React.useState<any[] | []>([]);
  const [selectedSchool, setSelectedSchool] =
    React.useState<StateLabelData | null>(null);
  const [systemInfo, setSystemInfo] = React.useState<any>({});
  const [selectedLab, setSelectedLab] = React.useState<StateLabelData | null>(
    null
  );
  const [selectedLabNo, setSelectedLabNo] =
    React.useState<StateLabelData | null>(null);
  const [systemInfoWithSameUuidExists, setSystemInfoWithSameUuidExists] =
    React.useState<boolean>(false);
  const [previouSelectedLabNo, setPreviouSelectedLabNo] =
    React.useState<StateLabelData | null>(null);
  const [selectedComputerSrNo, setSelectedComputerSrNo] =
    React.useState<StateLabelData>({ label: '1', value: '1' });
  const [metaData, setMetaData] = React.useState<MetaData>(
    defaultMetaDataValues
  );
  const [userComment, setUserComment] = React.useState<string>('');
  const [isQueryProcessing, setIsQueryProcessing] = React.useState(false);
  const [startInspection, setStartInspection] = React.useState(false);
  const [isSyncSuccess, setSyncSuccess] = React.useState(false);
  const [inspectionData, setInspectionData] = React.useState<{
    inspectionMetaData: any;
    status: 'compatible' | 'processing' | 'incompatible' | 'notStarted';
    allSystemInfo: any;
    manualChecksData?: any;
  }>({
    inspectionMetaData: null,
    status: 'notStarted',
    allSystemInfo: null,
    manualChecksData: null,
  });

  function arrayToCSV(data: any) {
    const csv = data.map((row: any) => Object.values(row));
    csv.unshift(Object.keys(data[0]));
    return `"${csv.join('"\n"').replace(/,/g, '","')}"`;
  }

  // eslint-disable-next-line func-names
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

  const downloadReport = () => {
    if (inspectionData && metaData) {
      const combinedData = [
        {
          Category: 'schoolName',
          Status: '-',
          Value: selectedSchool?.label,
          Type: 'schoolName',
        },
        {
          Category: 'schoolCode',
          Status: '-',
          Value: selectedSchool?.code,
          Type: 'schoolCode',
        },
        {
          Category: 'labId',
          Status: '-',
          Value: selectedLabNo?.value,
          Type: 'labId',
        },
        {
          Category: 'labNo',
          Dtatus: '-',
          Value: selectedLabNo?.label || '-',
          Type: 'labNo',
        },
        {
          Category: 'labName',
          Dtatus: '-',
          Value: selectedLab?.label || '-',
          Type: 'labName',
        },
        {
          Category: 'serialNo',
          Dtatus: '-',
          Value: selectedComputerSrNo?.label || '-',
          Type: 'serialNo',
        },
        {
          Category: 'uniqueDeviceId',
          Status: '-',
          Value: inspectionData?.allSystemInfo?.customUUID,
          Type: 'uniqueDeviceId',
        },
        {
          Category: 'inspectionDate',
          Status: '-',
          Value: new Date().toISOString(),
          Type: 'inspectionDate',
        },
      ];
      const allIncompatibleAutomatedInspections =
        inspectionData?.inspectionMetaData?.filter(
          (e: any) => e.status === 'incompatible'
        );
      const allIncompatibleManualInspections =
        inspectionData?.manualChecksData?.filter(
          (e: any) => e.status === 'incompatible'
        );
      const inspectionStatus =
        allIncompatibleAutomatedInspections?.length ||
        allIncompatibleManualInspections?.length
          ? 'incompatible'
          : 'compatible';

      combinedData.push({
        Category: 'status',
        Status: inspectionStatus,
        Value: '-',
        Type: 'status',
      });

      Object.keys(metaData).forEach((configuration: any) => {
        let configurationValue: any = metaData[configuration as keyof MetaData];
        if (
          typeof configurationValue !== 'number' &&
          configurationValue?.value
        ) {
          configurationValue = configurationValue?.value;
        }
        combinedData.push({
          Category: configuration,
          Status: '-',
          Value: configurationValue,
          Type: 'labConfiguration',
        });
      });
      if (
        inspectionData?.inspectionMetaData &&
        inspectionData?.inspectionMetaData?.length
      ) {
        inspectionData?.inspectionMetaData?.forEach((metaDataKey: any) => {
          let Category: string = metaDataKey?.key;
          if (metaDataKey?.type === 'firewall') Category = metaDataKey?.name;
          combinedData.push({
            Category,
            Status: metaDataKey?.status,
            Value: metaDataKey?.spec,
            Type: metaDataKey?.type,
          });
        });
      }
      if (
        inspectionData?.manualChecksData &&
        inspectionData?.manualChecksData?.length
      ) {
        inspectionData?.manualChecksData.forEach((manualCheck: any) => {
          combinedData.push({
            Category: manualCheck?.key,
            Status: manualCheck?.status,
            Value: '-',
            Type: 'manual',
          });
        });
      }
      combinedData.push({
        Category: 'systemInformation',
        Status: '-',
        Value: encodeURIComponent(
          JSON.stringify({
            uuid: inspectionData?.allSystemInfo?.uuid,
            system: inspectionData?.allSystemInfo?.system,
            os: inspectionData?.allSystemInfo?.os,
          })
        ),
        Type: 'systemInformation',
      });
      combinedData.push({
        Category: 'comment',
        Status: '-',
        Value: encodeURIComponent(userComment) || '',
        Type: 'comment',
      });
      const csvData = arrayToCSV(combinedData);
      let fileName = `${
        selectedSchool?.label || selectedSchool?.code || ''
      }-lab_${selectedLabNo?.label}-Sr No ${selectedComputerSrNo.label}`;
      fileName = fileName.split(' ').join('_').toLowerCase();

      // try {
      //   myExcelXML(combinedData, fileName);
      // } catch {
      // }
      downloadCSV(csvData, fileName);
    }
  };

  async function fetchSchools() {
    // You can await here
    if (navigator.onLine) {
      setSchoolFetching(true);
      const res = await fetchSchoolList();
      if (res?.errors) {
        setCertError(res?.errors);
      }
      const schoolList = res?.data?.schools || [];
      setSchools(schoolList);
      // Once we have schools list get system uuid and all other information.
      window.electron.ipcRenderer.sendMessage('system-uuid', [schoolList]);
    }
  }

  const addOrUpdateInspectionData = async () => {
    setIsQueryProcessing(true);
    const selectedSchoolData = schools.find(
      (school) =>
        school.id === selectedSchool?.value ||
        school.name === selectedSchool?.label ||
        school.code === selectedSchool?.code
    );
    if (selectedSchoolData) {
      let selectedLabData = selectedSchoolData?.labInspections.find(
        (inspection: any) =>
          inspection?.labNo?.toString() === selectedLabNo?.label?.toString()
      );
      let labConfigurationString = '';
      labConfigurationString = 'labConfiguration:{';
      if (metaData?.totalComputers || metaData?.totalComputers === 0) {
        labConfigurationString += `totalNumberOfComputers: ${metaData?.totalComputers}, `;
      }
      if (metaData?.internetSpeed || metaData?.internetSpeed === 0) {
        labConfigurationString += `internetSpeed: ${metaData?.internetSpeed}, `;
      }
      if (
        metaData?.totalWorkingComputers ||
        metaData?.totalWorkingComputers === 0
      ) {
        labConfigurationString += `totalNumberOfWorkingComputers: ${metaData?.totalWorkingComputers}, `;
      }
      if (metaData?.selectedProjector?.value) {
        labConfigurationString += `projectInteractivePanel: ${metaData?.selectedProjector?.value}, `;
      }
      if (metaData?.selectedSpeaker?.value) {
        labConfigurationString += `speakers: ${metaData?.selectedSpeaker?.value}, `;
      }
      if (metaData?.selectedPowerBackup?.value) {
        labConfigurationString += `powerBackup: ${metaData?.selectedPowerBackup?.value}, `;
      }
      if (metaData?.selectedPowerBackupType?.value) {
        labConfigurationString += `powerBackupType: ${
          metaData?.selectedPowerBackupType?.value || 'none'
        }, `;
      }
      if (metaData?.internetMode?.value) {
        labConfigurationString += `internetConnection: ${
          metaData?.internetMode?.value || 'none'
        }, `;
      }
      if (metaData?.serviceProviderType?.value) {
        labConfigurationString += `serviceProviderType: ${
          metaData?.serviceProviderType?.value || 'none'
        }, `;
      }
      if (metaData?.sharedSystemArchSetup?.value) {
        labConfigurationString += `sharedSystemArchSetup: ${
          metaData?.sharedSystemArchSetup?.value || 'no'
        }, `;
      }
      if (
        metaData?.sharedSystemArchSetup?.value === 'yes' &&
        metaData?.masterSystem?.value
      ) {
        labConfigurationString += `masterSystem: ${
          metaData?.masterSystem?.value || 'no'
        }, `;
      }
      if (
        metaData?.sharedSystemArchSetup?.value === 'yes' &&
        metaData?.masterSystem?.value === 'yes' &&
        (metaData?.totalNumberOfConnectedSystems ||
          metaData?.totalNumberOfConnectedSystems === 0)
      ) {
        labConfigurationString += `totalNumberOfConnectedSystems: ${metaData?.totalNumberOfConnectedSystems}, `;
      }
      if (metaData?.inspectionDate) {
        labConfigurationString += `inspectionDate: "${
          new Date(metaData?.inspectionDate).toISOString() ||
          new Date().toISOString()
        }", `;
      }
      labConfigurationString += `}`;
      const addLabQuery = `
        mutation {
          ${!selectedLabData ? 'add' : 'update'}LabInspection(
            ${selectedLabData?.id ? `id: "${selectedLabData?.id}"` : ''}
            input:{
            ${labConfigurationString || ''}
            labName: "${selectedLab?.label}"
            labNo: ${parseInt(selectedLabNo?.label || '0', 10)}
            inspectionDate: "${new Date().toISOString()}"
          }, schoolConnectId:"${selectedSchoolData?.id}") {
            id
            labName
          }
        }
      `;
      const addLabRes = await requestToGraphql(addLabQuery, {});
      if (!selectedLabData) {
        selectedLabData = addLabRes?.data?.addLabInspection;
      }

      if (selectedLabData?.id) {
        const inspectedLabDevice = (selectedLabData?.systems || []).find(
          (system: any) =>
            system.uniqueDeviceId === inspectionData?.allSystemInfo?.customUUID
        );

        let inspectionChecks = inspectedLabDevice
          ? 'inspectionChecks: { replace: ['
          : 'inspectionChecks: [';
        if (inspectionData && inspectionData.inspectionMetaData) {
          inspectionData?.inspectionMetaData?.forEach((inspection: any) => {
            let inspectionName = inspection.key;
            if (inspection?.type === 'firewall')
              inspectionName = inspection?.name;
            inspectionChecks += `
              {
                name: "${inspectionName}",
                type: "${inspection.type}",
                status: "${inspection.status}",
                spec: "${inspection.spec || ''}",
              }
            `;
          });
        }
        if (inspectionData && inspectionData.manualChecksData) {
          inspectionData.manualChecksData.forEach((manual: any) => {
            inspectionChecks += `
              {
                name: "${manual.key}",
                type: "manual",
                status: "${manual.status}",
                spec: "${manual.name}",
              }
            `;
          });
        }
        inspectionChecks += inspectedLabDevice ? ']}' : ']';

        const allIncompatibleAutomatedInspections =
          inspectionData?.inspectionMetaData?.filter(
            (e: any) => e.status === 'incompatible'
          );
        const allIncompatibleManualInspections =
          inspectionData?.manualChecksData?.filter(
            (e: any) => e.status === 'incompatible'
          );
        const inspectionStatus =
          allIncompatibleAutomatedInspections?.length ||
          allIncompatibleManualInspections?.length
            ? 'incompatible'
            : 'compatible';

        const systemInformation = {
          uuid: inspectionData?.allSystemInfo?.uuid,
          system: inspectionData?.allSystemInfo?.system,
          os: inspectionData?.allSystemInfo?.os,
          cpu: inspectionData?.allSystemInfo?.cpu,
          graphics: inspectionData?.allSystemInfo?.graphics,
          diskLayout: inspectionData?.allSystemInfo?.diskLayout,
          mem: inspectionData?.allSystemInfo?.mem,
          customUUID: inspectionData?.allSystemInfo?.customUUID,
        };

        const addLabDeviceQuery = `
          mutation {
            ${!inspectedLabDevice ? 'add' : 'update'}LabInspectedDevice(
              ${inspectedLabDevice ? `id: "${inspectedLabDevice?.id}"` : ''}
              input: {
                serialNo: ${parseInt(selectedComputerSrNo?.label, 10)},
                uniqueDeviceId: "${inspectionData?.allSystemInfo?.customUUID}",
                inspectionDate: "${
                  metaData.inspectionDate
                    ? new Date(metaData.inspectionDate).toISOString()
                    : new Date().toISOString()
                }"
                ${
                  userComment && userComment !== ''
                    ? `comment: "${userComment}"`
                    : ''
                }

                inspectionMode: "${navigator.onLine ? 'online' : 'offline'}",
                status: "${inspectionStatus}",
                systemInformation: "${encodeURIComponent(
                  JSON.stringify(systemInformation)
                )}"
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
      }
    }
    await fetchSchools();
    setIsQueryProcessing(false);
  };

  const ConfigureLabPages = [
    {
      Component: (
        <BasicDetails
          certError={certError}
          systemInfoWithSameUuidExists={systemInfoWithSameUuidExists}
          metaDataAlreadyExists={metaDataAlreadyExists}
          isFetching={schoolFetching}
          schools={schools}
          selectedSchool={selectedSchool}
          selectedLab={selectedLab}
          selectedLabNo={selectedLabNo}
          onSchoolChange={(value) => {
            setSelectedSchool(value);
          }}
          onLabChange={(value) => {
            setSelectedLab(value);
          }}
          onLabNoChange={(value) => {
            setPreviouSelectedLabNo(selectedLabNo);
            setSelectedLabNo(value);
          }}
          onComputerSrNoChange={(value) => {
            setSelectedComputerSrNo(value);
          }}
          metaDataValue={metaData}
          onChangeMetaData={(metaDataValue) => setMetaData(metaDataValue)}
        />
      ),
      title: 'Configure Labs',
      buttons: [
        <Button
          classNames="primary-button"
          title="Save & Next"
          key="save&Next"
          isDisabled={
            !selectedSchool?.code ||
            !selectedLabNo ||
            (navigator.onLine &&
              !Object.keys(metaData).every((key) => {
                if (key === 'selectedPowerBackupType') {
                  return metaData?.selectedPowerBackup?.value !== 'no'
                    ? metaData[key as keyof MetaData]
                    : true;
                }
                if (key === 'totalNumberOfConnectedSystems') {
                  return metaData?.sharedSystemArchSetup?.value === 'yes' &&
                    metaData?.masterSystem?.value === 'yes'
                    ? metaData[key as keyof MetaData] === 0
                      ? true
                      : metaData[key as keyof MetaData]
                    : true;
                }
                if (
                  key === 'totalWorkingComputers' ||
                  key === 'totalComputers' ||
                  key === 'internetSpeed'
                ) {
                  return metaData[key as keyof MetaData] === 0
                    ? true
                    : metaData[key as keyof MetaData];
                }
                if (key === 'masterSystem') {
                  return metaData?.sharedSystemArchSetup?.value === 'yes'
                    ? metaData[key as keyof MetaData]
                    : true;
                }
                return metaData[key as keyof MetaData];
              }))
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
          systemInfoWithSameUuidExists={systemInfoWithSameUuidExists}
          startInspection={startInspection}
          inspectionData={inspectionData}
          selectedLab={selectedLabNo}
          selectedComputerSrNo={selectedComputerSrNo}
          selectedSchoolData={
            (schools || []).find(
              (school) => school.id === selectedSchool?.value
            ) || { name: selectedSchool?.code }
          }
          onComputerSrNoChange={(value) => {
            setSelectedComputerSrNo(value);
          }}
          setStartInspection={(status) => setStartInspection(status)}
          onChangeMetaData={(metaDataValue) =>
            setInspectionData({ ...inspectionData, ...metaDataValue })
          }
        />
      ),
      title: 'Automatic Inspection',
      buttons: [
        <Button
          classNames="secondary-button"
          title="Back"
          key="back"
          isDisabled={false}
          onClick={() => setCurrentPage(currentPage - 1)}
        />,
        <Button
          classNames="primary-button"
          title={`${
            inspectionData.status === 'notStarted' ? 'Start Inspection' : 'Next'
          }`}
          key="startInspection"
          isDisabled={inspectionData.status === 'processing'}
          onClick={() => {
            if (inspectionData.status === 'notStarted') {
              setStartInspection(true);
            } else {
              setCurrentPage(currentPage + 1);
            }
          }}
        />,
      ],
    },
    {
      Component: (
        <ManualInspection
          userComment={userComment}
          setUserComment={(value) => setUserComment(value)}
          metaDataValue={metaData}
          inspectionData={inspectionData}
          onChangeMetaData={(metaDataValue) => setInspectionData(metaDataValue)}
        />
      ),
      title: 'Manual Inspection',
      buttons: [
        <Button
          classNames="secondary-button"
          title="Back"
          key="manualBack"
          isDisabled={false}
          onClick={() => setCurrentPage(currentPage - 1)}
        />,
        <Button
          classNames="primary-button"
          isLoading={isQueryProcessing}
          key="submit"
          title={`Submit (${
            inspectionData.manualChecksData?.filter(
              (e: any) => e.status !== 'processing' && e.status !== 'notStarted'
            ).length || 0
          }/${inspectionData.manualChecksData?.length || 0})`}
          isDisabled={
            (inspectionData?.manualChecksData?.filter(
              (e: any) => e.status !== 'processing' && e.status !== 'notStarted'
            ).length || 0) !== (inspectionData?.manualChecksData?.length || 0)
          }
          onClick={async () => {
            if (navigator.onLine) {
              await addOrUpdateInspectionData();
            }
            setTimeout(() => {
              setCurrentPage(currentPage + 1);
            }, 800);
          }}
        />,
      ],
    },
  ];

  React.useEffect(() => {
    if (schools && selectedSchool && selectedLabNo && !isQueryProcessing) {
      const selectedSchoolData = schools.find(
        (school) => school.id === selectedSchool?.value
      );

      if (selectedSchoolData) {
        const selectedLabData = selectedSchoolData?.labInspections.find(
          (inspection: any) => inspection?.labNo === selectedLabNo?.label
        );
        setSelectedComputerSrNo({
          label: '1',
          value: '1',
        });
        if (selectedLabData) {
          let systemSrNos = selectedLabData?.systems.map(
            (system: any) => system.serialNo
          ) || [0];
          const existingSystem =
            selectedLabData?.systems.filter(
              (system: any) => system.uniqueDeviceId === systemInfo?.customUUID
            ) || [];
          if (existingSystem[0]) {
            setSystemInfoWithSameUuidExists(true);
            if (existingSystem[0]?.comment) {
              setUserComment(existingSystem[0]?.comment);
            }
          }
          if (existingSystem[0]?.serialNo) {
            setSelectedComputerSrNo({
              label: `${existingSystem[0].serialNo}`,
              value: `${existingSystem[0].serialNo}`,
            });
          } else {
            if (!systemSrNos?.length) systemSrNos = [0];
            setSelectedComputerSrNo({
              label: `${(Math.max(...systemSrNos) || 0) + 1}`,
              value: `${(Math.max(...systemSrNos) || 0) + 1}`,
            });
          }
          // setMetaData(defaultMetaDataValues);
          const inspectionChecks = existingSystem[0]?.inspectionChecks || [];
          setInspectionData({
            ...inspectionData,
            allSystemInfo: systemInfo,
            manualChecksData: manualChecks.map((e) => {
              const existingCheck = inspectionChecks.find(
                (check: any) => check.spec === e.key
              );
              return {
                ...e,
                status: existingCheck?.status || 'notStarted',
              };
            }),
            inspectionMetaData: automatedChecks.map((e) => {
              const existingCheck = inspectionChecks.find((check: any) => {
                if (check.type === 'firewall') {
                  return check.name === e.name;
                }
                return check.name === e.key;
              });
              return {
                ...e,
                status: existingCheck?.status || 'notStarted',
                spec: existingCheck?.spec || '-',
              };
            }),
            status: existingSystem[0]?.status || 'notStarted',
          });
        }
      }
    }
  }, [selectedLabNo, selectedSchool]);

  React.useEffect(() => {
    fetchSchools();
    window.electron.ipcRenderer.on('system-uuid', async (arg: any) => {
      setSchoolFetching(false);
      const schooList = arg?.schoolList;
      setSystemInfo(arg?.allSystemInfo);
      try {
        localStorage.setItem('internal-log', JSON.stringify(arg));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
      if (schooList?.length && false) {
        schooList.forEach((e: any) => {
          if (e?.labInspectedDevices?.length) {
            const filteredDevice = e.labInspectedDevices.filter(
              (lab: any) =>
                lab?.uniqueDeviceId === arg?.allSystemInfo?.customUUID
            );
            if (filteredDevice.length) {
              setSystemInfoWithSameUuidExists(true);
              setSelectedSchool({
                code: e?.code,
                label: e?.name,
                value: e?.id,
              });
              setSelectedLabNo({
                label: filteredDevice[0]?.inspection?.labNo,
                value: filteredDevice[0]?.inspection?.id,
              });
              setSelectedLab({
                label: filteredDevice[0]?.inspection?.labName,
                value: filteredDevice[0]?.inspection?.labName,
              });
              setSelectedComputerSrNo({
                label: filteredDevice[0]?.serialNo,
                value: filteredDevice[0]?.serialNo,
              });
              if (filteredDevice[0]?.comment) {
                setUserComment(filteredDevice[0]?.comment);
              }
            }
          }
        });
      }
    });
    const schoolFromLS = localStorage.getItem('selectedSchool');
    const labFromLS = localStorage.getItem('selectedLab');
    const srNoFromLS = localStorage.getItem('selectedComputerSrNo');
    if (schoolFromLS) setSelectedSchool(JSON.parse(schoolFromLS));
    if (labFromLS) setSelectedLab(JSON.parse(labFromLS));
    if (srNoFromLS) setSelectedComputerSrNo(JSON.parse(srNoFromLS));
  }, []);

  React.useEffect(() => {
    if (false) {
      if (selectedSchool)
        localStorage.setItem('selectedSchool', JSON.stringify(selectedSchool));
      if (selectedLab)
        localStorage.setItem('selectedLab', JSON.stringify(selectedLab));
      if (selectedComputerSrNo)
        localStorage.setItem(
          'selectedComputerSrNo',
          JSON.stringify(selectedComputerSrNo)
        );
    }
  }, [selectedComputerSrNo, selectedLab, selectedSchool]);

  React.useEffect(() => {
    if (selectedLabNo?.value !== previouSelectedLabNo?.value) {
      if (selectedSchool) {
        const selectedSchoolData = schools.find(
          (school) => school.id === selectedSchool?.value
        );
        if (selectedSchoolData) {
          const selectedLabData = selectedSchoolData?.labInspections.find(
            (inspection: any) => inspection.id === selectedLabNo?.value
          );
          if (selectedLabData) {
            setPreviouSelectedLabNo(selectedLabNo);
            const configuration = selectedLabData?.labConfiguration;
            setSelectedLab({
              label: selectedLabData?.labName,
              value: selectedLabData?.labName,
            });
            setMetaDataAlreadyExists(true);
            const updatedData = {
              totalComputers: configuration?.totalNumberOfComputers,
              internetSpeed: configuration?.internetSpeed,
              totalWorkingComputers:
                configuration?.totalNumberOfWorkingComputers,
              selectedSpeaker:
                speakerOptions.find(
                  (e) => e.value === configuration?.speakers
                ) || null,
              selectedPowerBackup:
                powerBackupOptions.find(
                  (e) => e.value === configuration?.powerBackup
                ) || null,
              selectedProjector:
                displayOptions.find(
                  (e) => e.value === configuration?.projectInteractivePanel
                ) || null,
              internetMode:
                internetOptions.find(
                  (e) => e.value === configuration?.internetConnection
                ) || null,
              selectedPowerBackupType:
                powerBackupTypeOptions.find(
                  (e) => e.value === configuration?.powerBackupType
                ) || null,
              serviceProviderType:
                serviceProviderType.find(
                  (e) => e.value === configuration?.serviceProviderType
                ) || null,
              sharedSystemArchSetup: yesNoOption.find(
                (e) => e.value === configuration?.sharedSystemArchSetup
              ) || { value: 'no', label: 'No' },
              masterSystem:
                yesNoOption.find(
                  (e) => e.value === configuration?.masterSystem
                ) || null,
              totalNumberOfConnectedSystems:
                configuration?.totalNumberOfConnectedSystems,
              inspectionDate: new Date().toISOString(),
            };
            setMetaData(updatedData);
          } else {
            setPreviouSelectedLabNo(selectedLabNo);
            setMetaDataAlreadyExists(false);
            setUserComment('');
            setSelectedLab({
              label: '',
              value: '',
            });
            setMetaData(defaultMetaDataValues);
          }
        }
      }
    }
  }, [selectedLabNo]);

  const currentPageConfiguration = ConfigureLabPages[currentPage];
  return (
    <>
      {(!navigator.onLine || certError) && (
        <div className="onlineOfflineStrip offlineStrip">
          <img src={offlineIcon} alt="offline" />
          {!certError
            ? 'You are currently offline, connect to the internet or'
            : 'Please'}{' '}
          download the report at the end
        </div>
      )}
      <div
        onDoubleClick={() => {
          if (navigator?.clipboard && systemInfo) {
            navigator.clipboard
              .writeText(JSON.stringify(systemInfo, null, 2))
              .then(() => {
                // eslint-disable-next-line no-alert
                alert('Internal Logs Copied');
                return null;
              })
              .catch(() => {
                return null;
              });
          }
        }}
        style={{
          width: '10px',
          height: '40px',
          cursor: 'pointer',
          position: 'absolute',
          bottom: 50,
          left: 0,
        }}
      />
      <div className="configure-lab-master-container">
        <div className="configure-centerred-container">
          {/* <ReactJson src={systemInfo} /> */}
          {currentPageConfiguration ? (
            <>
              <div className="configure-lab-container">
                <div className="configure-lab-header">
                  <h1>{currentPageConfiguration?.title}</h1>
                </div>
                <InspectionProgress
                  stepperProgress={{
                    0: () => {
                      let progress = 0;
                      if (!selectedSchool?.value) return progress;
                      if (navigator.onLine && selectedSchool?.value)
                        progress += 25;
                      if (!selectedSchool?.code) return progress;
                      if (!navigator.onLine && selectedSchool?.code)
                        progress += 25;
                      if (selectedLabNo) progress += 25;
                      const metakeysCompleted = Object.keys(metaData).filter(
                        (e) => {
                          if (e === 'selectedPowerBackupType') {
                            return metaData?.selectedPowerBackup?.value !== 'no'
                              ? metaData[e as keyof MetaData]
                              : true;
                          }
                          if (e === 'totalNumberOfConnectedSystems') {
                            return metaData?.sharedSystemArchSetup?.value ===
                              'yes' && metaData?.masterSystem?.value === 'yes'
                              ? metaData[e as keyof MetaData] === 0
                                ? true
                                : metaData[e as keyof MetaData]
                              : true;
                          }
                          if (
                            e === 'totalWorkingComputers' ||
                            e === 'totalComputers' ||
                            e === 'internetSpeed'
                          ) {
                            return metaData[e as keyof MetaData] === 0
                              ? true
                              : metaData[e as keyof MetaData];
                          }
                          if (e === 'masterSystem') {
                            return metaData?.sharedSystemArchSetup?.value ===
                              'yes'
                              ? metaData[e as keyof MetaData]
                              : true;
                          }
                          return metaData[e as keyof typeof metaData];
                        }
                      );
                      progress +=
                        (metakeysCompleted.length /
                          Object.keys(metaData).length) *
                        50;
                      return progress?.toFixed(0);
                    },
                    1: () => {
                      if (!inspectionData?.inspectionMetaData?.length) return 0;
                      return (
                        ((inspectionData?.inspectionMetaData?.filter(
                          (e: any) =>
                            e.status !== 'processing' &&
                            e?.status !== 'notStarted'
                        ).length || 0) /
                          (inspectionData?.inspectionMetaData?.length || 0)) *
                        100
                      )?.toFixed(0);
                    },
                    2: () => {
                      if (!inspectionData?.manualChecksData?.length) return 0;
                      return (
                        ((inspectionData?.manualChecksData?.filter(
                          (e: any) =>
                            e.status !== 'processing' &&
                            e?.status !== 'notStarted'
                        ).length || 0) /
                          (inspectionData?.manualChecksData?.length || 0)) *
                        100
                      )?.toFixed(0);
                    },
                  }}
                  pages={ConfigureLabPages}
                  currentPage={currentPage}
                />
                {currentPageConfiguration?.Component}
              </div>
              <div className="primary-button-container">
                {currentPageConfiguration?.buttons.map(
                  (RenderButton) => RenderButton
                )}
              </div>
            </>
          ) : (
            <>
              <div className="configure-lab-container">
                <div
                  className="scroll-container"
                  style={{
                    paddingBottom: '100px',
                  }}
                >
                  <div className="configure-lab-congrats-container">
                    <div
                      style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '0 1 80%',
                      }}
                    >
                      <h1>
                        Congratulations, Inspection
                        <br />
                        Completed.
                      </h1>
                      <div
                        className="preview-container"
                        style={{ margin: 0, marginTop: 10 }}
                      >
                        <div
                          className="preview-container"
                          style={{
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          <div className="preview-set">
                            <span>School Name</span>
                            <h1
                              title={
                                navigator.onLine
                                  ? selectedSchool?.label
                                  : selectedSchool?.code || '-'
                              }
                            >
                              {navigator.onLine
                                ? selectedSchool?.label
                                : selectedSchool?.code || '-'}
                            </h1>
                          </div>
                          <div
                            className="preview-set"
                            style={{
                              flex: '0 0 20%',
                            }}
                          >
                            <span>Lab No</span>
                            <h1>Lab {selectedLabNo?.label || '-'}</h1>
                          </div>
                          <div className="preview-set">
                            <span>Computer Sr No.</span>
                            <h1>{selectedComputerSrNo?.label || '-'}</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                    <img
                      src={BadgeSvg}
                      alt="Badge"
                      style={{
                        flex: 1,
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                      }}
                    />
                  </div>
                  <div className="inspection-summary-container">
                    <div className="inspection-summary-header">
                      Inspection Summary
                      <span>
                        Inspection summary below, check for any errors.
                      </span>
                    </div>
                    <table style={{ width: '-webkit-fill-available' }}>
                      <tr>
                        <th>Components</th>
                        <th
                          style={{
                            textAlign: 'center',
                          }}
                        >
                          Status
                        </th>
                        <th
                          style={{
                            textAlign: 'left',
                          }}
                        >
                          Specification
                        </th>
                      </tr>
                      {inspectionData?.inspectionMetaData
                        ?.sort((a: any) =>
                          a?.status === 'incompatible' ? -1 : 1
                        )
                        .map((val: any) => {
                          const { type, status, spec } = val;
                          let customStatus: string = status;
                          const systemDistro =
                            systemInfo?.os?.distro ||
                            `${systemInfo?.os?.platform} 7`;
                          const isWin7 = systemDistro.indexOf('7') !== -1;
                          if (type === 'software') {
                            customStatus =
                              softwareApplicationLabelMap[
                                val.status as keyof typeof softwareApplicationLabelMap
                              ];
                          }
                          if (customStatus === 'notStarted')
                            customStatus = 'Not Inspected';
                          if (customStatus === 'processing')
                            customStatus = 'Inspecting';
                          return (
                            <tr key={val.name}>
                              <td>{val.name}</td>
                              <td>
                                <div className={`status-badge badge-${status}`}>
                                  {StatusBadgeIcons[
                                    status as keyof typeof StatusBadgeIcons
                                  ] && (
                                    <img
                                      src={
                                        StatusBadgeIcons[
                                          status as keyof typeof StatusBadgeIcons
                                        ]
                                      }
                                      alt=""
                                    />
                                  )}
                                  {customStatus}
                                </div>
                              </td>
                              <td>{spec || '-'}</td>
                            </tr>
                          );
                        })}
                    </table>
                  </div>
                </div>
              </div>
              <div className="primary-button-container">
                <Button
                  classNames="secondary-button"
                  title="Back"
                  isDisabled={false}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
                <Button
                  classNames="primary-button"
                  title="Download Report"
                  isDisabled={false}
                  onClick={() => {
                    downloadReport();
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfigureLab;
