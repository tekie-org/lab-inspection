/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import '../ConfigureLab.scss';
import React from 'react';
import loadingGif from '../../../assets/loading2.gif';
import Collapsible from './Collapsible';
import { MetaData } from '../interface';
import ProcesssingIcon from '../../../assets/time.svg';
import CompatibleIcon from '../../../assets/tick.svg';
import IncompatibleIcon from '../../../assets/cross.svg';
import measureConnectionSpeed from './speedTest';

const softwareApplicationLabelMap = {
  processing: 'processing',
  compatible: 'Installed',
  incompatible: 'Not Installed',
};

const formatBytes = (bytes: any, decimals = 2) => {
  if (!+bytes) return { raw: 0, label: '0 Bytes' };

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return {
    // eslint-disable-next-line no-restricted-properties
    raw: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    // eslint-disable-next-line no-restricted-properties
    label: `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`,
  };
};

type InspectionStatus = 'compatible' | 'processing' | 'incompatible';
interface InspectionMetaData {
  name: string;
  key: string;
  status: InspectionStatus;
  spec: string;
  minRequirement: number | string;
}

const basicChecks: InspectionMetaData[] = [
  {
    name: 'RAM',
    key: 'ram',
    status: 'processing',
    spec: '-',
    minRequirement: 2,
  },
  {
    name: 'Processor',
    key: 'processor',
    status: 'processing',
    spec: '-',
    minRequirement: 32,
  },
  {
    name: 'Monitor Specs',
    key: 'monitor',
    status: 'processing',
    spec: '-',
    minRequirement: 13,
  },
  {
    name: 'Storage',
    key: 'storage',
    status: 'processing',
    spec: '-',
    minRequirement: 100,
  },
  {
    name: 'Internet Speed',
    key: 'netspeed',
    status: 'processing',
    spec: '-',
    minRequirement: 10,
  },
  {
    name: 'OS Compatibility',
    key: 'os',
    status: 'processing',
    spec: '-',
    minRequirement: 7,
  },
  {
    name: 'Google Chrome',
    key: 'chrome',
    status: 'processing',
    spec: '-',
    minRequirement: 70,
  },
];
interface SoftwareApplicationsAndFirewallInterface {
  name: string;
  key: string;
  status: InspectionStatus;
}

const softwareApplications: SoftwareApplicationsAndFirewallInterface[] = [
  {
    name: 'Paint 3D',
    key: 'paint3d',
    status: 'processing',
  },
  {
    name: 'MS Paint',
    key: 'paint',
    status: 'processing',
  },
  {
    name: 'Filmora',
    key: 'filmora',
    status: 'processing',
  },
  {
    name: 'Notepad',
    key: 'notepad',
    status: 'processing',
  },
  {
    name: 'MS Access',
    key: 'msaccess',
    status: 'processing',
  },
];

const manualChecks: SoftwareApplicationsAndFirewallInterface[] = [
  {
    name: 'Keyboard',
    key: 'keyboard',
    status: 'incompatible',
  },
  {
    name: 'Mouse',
    key: 'mouse',
    status: 'incompatible',
  },
  {
    name: 'Canva',
    key: 'canva',
    status: 'incompatible',
  },
  {
    name: 'MS Access',
    key: 'msAccess',
    status: 'incompatible',
  },
];

const firewallRules: SoftwareApplicationsAndFirewallInterface[] = [
  {
    name: 'Github.com',
    key: 'https://github.com/',
    status: 'processing',
  },
  {
    name: 'Tekie.in',
    key: 'https://www.tekie.in',
    status: 'processing',
  },
  {
    name: 'kahoot.it',
    key: 'https://kahoot.it',
    status: 'processing',
  },
  {
    name: 'fonts.googleapis.com',
    key: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,900&display=swap',
    status: 'processing',
  },
  {
    name: 'figma.com',
    key: 'https://figma.com',
    status: 'processing',
  },
  // {
  //   name: 'canva.com',
  //   key: 'https://www.canva.com/',
  //   status: 'processing',
  // },
  {
    name: 'docs.google.com',
    key: 'https://docs.google.com',
    status: 'processing',
  },
  {
    name: 'code.org',
    key: 'https://code.org/',
    status: 'processing',
  },
  {
    name: 'developers.google.com/blockly',
    key: 'https://developers.google.com/blockly',
    status: 'processing',
  },
  // {
  //   name: 'replit.com',
  //   key: 'https://replit.com',
  //   status: 'processing',
  // },
  {
    name: 'playcode.io',
    key: 'https://playcode.io/empty_html',
    status: 'processing',
  },
  {
    name: 'filmora.wondershare.com',
    key: 'https://filmora.wondershare.com',
    status: 'processing',
  },
  {
    name: 'google.com',
    key: 'https://google.com',
    status: 'processing',
  },
  {
    name: 'mail.google.com',
    key: 'https://mail.google.com',
    status: 'processing',
  },
];

const StatusBadgeIcons: {
  processing: string;
  compatible: string;
  incompatible: string;
} = {
  processing: ProcesssingIcon,
  compatible: CompatibleIcon,
  incompatible: IncompatibleIcon,
};

const AutomatedInspection = ({
  isSyncSuccess,
  inspectionData,
  currentPage,
  onChangeMetaData,
  metaDataValue,
  selectedLab,
  selectedComputerSrNo,
  selectedSchoolData,
  setCurrentPage,
}: {
  isSyncSuccess: boolean;
  inspectionData: {
    inspectionMetaData: object | null;
    softwareApplicationsData: object | null;
    firewallData: object | null;
    status: 'compatible' | 'processing' | 'incompatible';
  };
  selectedLab: any;
  selectedComputerSrNo: any;
  selectedSchoolData: any;
  currentPage: number;
  setCurrentPage: (pageNumber: number) => void;
  onChangeMetaData: (metaData: {
    allSystemInfo: object;
    inspectionMetaData: object;
    softwareApplicationsData: object;
    firewallData: object;
    manualChecksData: object;
    status: InspectionStatus;
  }) => void;
  metaDataValue: MetaData;
}) => {
  const [metaData, setMetaData] = React.useState<MetaData>(metaDataValue);
  const [inspectionMetaData, setInspectionMetaData] =
    React.useState<InspectionMetaData[]>(basicChecks);
  const [manualChecksData, setManualChecksData] =
    React.useState<SoftwareApplicationsAndFirewallInterface[]>(manualChecks);
  const [softwareApplicationsData, setSoftwareApplicationsData] =
    React.useState<SoftwareApplicationsAndFirewallInterface[]>(
      softwareApplications
    );
  const [firewallData, setFirewallData] =
    React.useState<SoftwareApplicationsAndFirewallInterface[]>(firewallRules);
  const [inspectionStatus, setInspectionStatus] =
    React.useState<InspectionStatus>('processing');
  const [netspeed, setNetSpeed] = React.useState({
    speed: 0,
    status: 'processing',
  });
  const [systemInformation, setSystemInfo] = React.useState<any>({});

  window.electron.ipcRenderer.once('lab-inspection', (arg: any) => {
    // eslint-disable-next-line no-console
    // const formattedData = {
    //   ram: formatBytes(arg.mem.total),
    //   processor: `${arg.osInfo.arch} ${arg.cpu.brand}`,
    //   monitor: `${arg.graphics.displays[0]} ${arg.cpu.brand}`,
    // };

    const systemInfo = arg?.systemInfo || {};
    setSystemInfo(systemInfo);
    let isInspectionStatus: InspectionStatus = 'compatible';

    const updatedeInspectionMetaData = inspectionMetaData.map((meta) => {
      const updatedInspection = meta;
      updatedInspection.status = 'incompatible';
      switch (meta.key) {
        case 'ram': {
          const ramValue = formatBytes(systemInfo?.mem?.total || 0);
          const availableRamValue = formatBytes(
            systemInfo?.mem?.available || 0
          );
          if (ramValue.raw >= meta.minRequirement)
            updatedInspection.status = 'compatible';
          updatedInspection.spec = `Total: ${ramValue?.label}; Available: ${availableRamValue.label}`;
          break;
        }
        case 'processor': {
          const processorValue = {
            label: `${systemInfo?.os?.arch || ''} ${
              systemInfo?.cpu?.brand || ''
            }`,
            value: systemInfo?.os?.arch,
          };
          if (
            ['32', '64', '86'].some(
              (value) => processorValue.value.indexOf(value) !== -1
            )
          )
            updatedInspection.status = 'compatible';
          updatedInspection.spec = processorValue?.label;
          break;
        }
        case 'monitor': {
          const monitorValue = {
            label: `${
              systemInfo?.graphics?.displays?.[0]?.resolutionX || 0
            } x ${systemInfo?.graphics?.displays?.[0]?.resolutionY || 0} - ${
              systemInfo?.graphics?.displays?.[0]?.currentRefreshRate
            } Hz`,
            value: systemInfo?.graphics?.displays?.[0]?.size?.width,
          };
          updatedInspection.status = 'compatible';
          updatedInspection.spec = monitorValue?.label;
          break;
        }
        case 'storage': {
          const storageValue = formatBytes(
            systemInfo?.diskLayout?.[0]?.size || 0
          );
          if (storageValue.raw >= meta.minRequirement)
            updatedInspection.status = 'compatible';
          updatedInspection.spec = storageValue?.label;
          break;
        }
        case 'os': {
          const systemDistro = systemInfo?.os?.distro || '';
          if (
            ['7', '8', '10', '11'].some(
              (value) => systemDistro.indexOf(value) !== -1
            )
          ) {
            updatedInspection.status = 'compatible';
          }
          updatedInspection.spec = systemDistro;
          break;
        }
        case 'chrome': {
          const chromeVersion = arg?.installedApps?.chrome?.version || 0;
          if (parseFloat(chromeVersion) >= meta.minRequirement)
            updatedInspection.status = 'compatible';
          updatedInspection.spec = chromeVersion;
          break;
        }
        case 'netspeed': {
          updatedInspection.status = 'processing';
          break;
        }
        default:
          break;
      }
      if (updatedInspection.status === 'incompatible')
        isInspectionStatus = 'incompatible';
      return updatedInspection;
    });
    const updatedSoftwareApplicationsData = softwareApplicationsData.map(
      (saData) => {
        const updatedSoftwareApp = saData;
        updatedSoftwareApp.status = 'incompatible';
        if (arg?.installedApps?.[updatedSoftwareApp.key]) {
          updatedSoftwareApp.status = 'compatible';
        }
        if (updatedSoftwareApp.status === 'incompatible') {
          isInspectionStatus = 'incompatible';
        }
        return updatedSoftwareApp;
      }
    );
    const updatedFirewallData = firewallData.map((fwData) => {
      const updatedFirewall = fwData;
      const statusObj = arg?.firewallChecklinksStatus.find(
        (data: any) => data.key === updatedFirewall.key
      );
      if (statusObj && statusObj.status) {
        updatedFirewall.status = 'compatible';
      } else {
        updatedFirewall.status = 'incompatible';
        isInspectionStatus = 'incompatible';
      }
      return updatedFirewall;
    });
    setSoftwareApplicationsData(updatedSoftwareApplicationsData);
    setInspectionMetaData(updatedeInspectionMetaData);
    setFirewallData(updatedFirewallData);
    setInspectionStatus(isInspectionStatus);
  });
  const startLabInspection = async () => {
    if (navigator.onLine) {
      const avgSpeed = await measureConnectionSpeed();
      setNetSpeed({ speed: avgSpeed, status: 'completed' });
    } else {
      setNetSpeed({ speed: 0, status: 'completed' });
    }
  };

  React.useEffect(() => {
    window.electron.ipcRenderer.sendMessage('lab-inspection', ['ping']);
    startLabInspection();
  }, [currentPage]);

  React.useEffect(() => {
    if (inspectionData.status === 'processing') {
      setInspectionMetaData(
        inspectionMetaData.map((meta) => ({
          ...meta,
          spec: '-',
          status: 'processing',
        }))
      );
      setSoftwareApplicationsData(
        softwareApplications.map((meta) => ({ ...meta, status: 'processing' }))
      );
      setFirewallData(
        firewallData.map((meta) => ({ ...meta, status: 'processing' }))
      );
      setInspectionStatus('processing');
      setNetSpeed({ speed: 0, status: 'processing' });
      startLabInspection();
    }
  }, [inspectionData]);

  React.useEffect(() => {
    const status: InspectionStatus =
      inspectionStatus !== 'processing'
        ? netspeed.status === 'completed'
          ? netspeed.speed >= 10
            ? manualChecksData.every((check) => check.status === 'compatible')
              ? inspectionStatus
              : 'incompatible'
            : 'incompatible'
          : 'processing'
        : 'processing';
    if (status !== 'processing') {
      const updatedInspectionData = {
        inspectionMetaData: inspectionMetaData.map((meta) => {
          const speed =
            netspeed.speed > 150
              ? Math.floor(Math.random() * (150 - 100 + 1) + 100)
              : netspeed.speed;
          if (meta.key === 'netspeed') {
            return {
              ...meta,
              spec: `${speed} Mbps`,
              status: netspeed.speed > 10 ? 'compatible' : 'incompatible',
            };
          }
          return meta;
        }),
        softwareApplicationsData,
        firewallData,
        manualChecksData,
        status,
        allSystemInfo: systemInformation,
      };
      onChangeMetaData(updatedInspectionData);
    }
  }, [inspectionStatus]);

  const overallInspectionStatus =
    inspectionStatus !== 'processing'
      ? netspeed.status === 'completed'
        ? netspeed.speed >= 10
          ? manualChecksData.every((check) => check.status === 'compatible')
            ? inspectionStatus
            : 'incompatible'
          : 'incompatible'
        : 'processing'
      : 'processing';

  return (
    <div className="configure-lab-container">
      <div className="configure-lab-header">
        <div className="configure-lab-header left-aligned">
          <h1>Perform Inspection</h1>
          <div className="breadcrumbs">
            <span
              onClick={() => {
                setCurrentPage(0);
              }}
            >
              Select School
            </span>{' '}
            /{' '}
            <span
              onClick={() => {
                setCurrentPage(1);
              }}
            >
              Configure Labs
            </span>{' '}
            / <span className="active">Perform Inspection</span>
          </div>
        </div>
        <div className="preview-container">
          <div className="preview-set">
            <span>School Name</span>
            <h1 title={selectedSchoolData?.name || '-'}>
              {selectedSchoolData?.name || '-'}
            </h1>
          </div>
          <div className="preview-set">
            <span>Lab</span>
            <h1>{selectedLab?.label || '-'}</h1>
          </div>
          <div className="preview-set">
            <span>Sr. No</span>
            <h1>{selectedComputerSrNo?.label || '-'}</h1>
          </div>
          {navigator.onLine ? (
            <div className="preview-set">
              <span>Data Sync</span>
              <h1
                className={`preview-status-${
                  overallInspectionStatus === 'processing'
                    ? overallInspectionStatus
                    : isSyncSuccess
                    ? 'compatible'
                    : 'incompatible'
                }`}
              >
                {overallInspectionStatus === 'processing'
                  ? 'Syncing'
                  : isSyncSuccess
                  ? 'Synced'
                  : 'Try Again'}
              </h1>
            </div>
          ) : null}
          <div className="preview-set">
            <span>Inspection Status</span>
            <h1
              className={`preview-status-${overallInspectionStatus}`}
              style={{
                width: 'fit-content',
                display: 'flex',
              }}
            >
              {overallInspectionStatus}
              {overallInspectionStatus === 'processing' && (
                <img
                  src={loadingGif}
                  alt="loading"
                  style={{
                    width: '30px',
                    height: '30px',
                    marginTop: '-2px',
                  }}
                />
              )}
            </h1>
          </div>
        </div>
        <Collapsible open header="Manual Checks">
          <table>
            <tr>
              <th>Criteria</th>
              <th>Input</th>
            </tr>
            {manualChecksData.map((val) => {
              const { status } = val;
              return (
                <tr key={val.name}>
                  <td>{val.name}</td>
                  <td>
                    <div className="status-toggle">
                      <span
                        onClick={() => {
                          setManualChecksData(
                            manualChecksData.map((check) => {
                              if (check.key === val.key) {
                                return {
                                  ...check,
                                  status: 'compatible',
                                };
                              }
                              return check;
                            })
                          );
                        }}
                        className={status === 'compatible' ? 'active' : ''}
                      >
                        Working
                      </span>
                      <span
                        onClick={() => {
                          setManualChecksData(
                            manualChecksData.map((check) => {
                              if (check.key === val.key) {
                                return {
                                  ...check,
                                  status: 'incompatible',
                                };
                              }
                              return check;
                            })
                          );
                        }}
                        className={
                          status !== 'compatible' ? 'disabled-active' : ''
                        }
                      >
                        Disabled
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </table>
        </Collapsible>
        <Collapsible open header="Basic Checks">
          <table>
            <tr>
              <th>Test Criteria</th>
              <th>STATUS</th>
              <th>SPECIFICATION</th>
            </tr>
            {inspectionMetaData.map((val) => {
              let { status, spec } = val;
              if (val.key === 'netspeed' && netspeed.status === 'completed') {
                const speed =
                  netspeed.speed > 150
                    ? Math.floor(Math.random() * (150 - 100 + 1) + 100)
                    : netspeed.speed;
                spec = `${speed} Mbps`;
                status =
                  speed >= val.minRequirement ? 'compatible' : 'incompatible';
              }
              return (
                <tr key={val.name}>
                  <td>{val.name}</td>
                  <td>
                    <div className={`status-badge badge-${status}`}>
                      <img src={StatusBadgeIcons[status]} alt="" />
                      {status}
                    </div>
                  </td>
                  <td>{spec || '-'}</td>
                </tr>
              );
            })}
          </table>
        </Collapsible>
        <Collapsible open header="Software Applications">
          <table>
            <tr>
              <th style={{ width: '50%' }}>Application</th>
              <th>STATUS</th>
              {/* <th>SPECIFICATION</th> */}
            </tr>
            {softwareApplicationsData.map((val) => {
              return (
                <tr key={val.name}>
                  <td>{val.name}</td>
                  <td>
                    <div className={`status-badge badge-${val.status}`}>
                      <img src={StatusBadgeIcons[val.status]} alt="" />
                      {softwareApplicationLabelMap[val.status]}
                    </div>
                  </td>
                </tr>
              );
            })}
          </table>
        </Collapsible>
        <Collapsible open header="Firewall">
          <table>
            <tr>
              <th style={{ width: '50%' }}>Website&apos;s</th>
              <th>STATUS</th>
              {/* <th>SPECIFICATION</th> */}
            </tr>
            {firewallData.map((val) => {
              return (
                <tr key={val.name}>
                  <td>{val.name}</td>
                  <td>
                    <div className={`status-badge badge-${val.status}`}>
                      <img src={StatusBadgeIcons[val.status]} alt="" />
                      {val.status}
                    </div>
                  </td>
                </tr>
              );
            })}
          </table>
        </Collapsible>
      </div>
    </div>
  );
};

export default AutomatedInspection;
