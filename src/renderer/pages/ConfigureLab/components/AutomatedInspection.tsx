/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import '../ConfigureLab.scss';
import React from 'react';
import Select from 'react-select/creatable';
// import ReactJson from 'react-json-view'
// import loadingGif from '../../../assets/loading2.gif';
// import ProcesssingIcon from '../../../assets/time.svg';
import CompatibleIcon from '../../../assets/tick.svg';
import IncompatibleIcon from '../../../assets/cross.svg';
import colourStyles from '../styles';
import Button from './Button';

export const softwareApplicationLabelMap = {
  notStarted: 'Not Inspected',
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

type InspectionStatus =
  | 'compatible'
  | 'processing'
  | 'incompatible'
  | 'notStarted';
interface InspectionMetaData {
  name: string;
  key: string;
  type: 'basic' | 'software' | 'firewall';
  status: InspectionStatus;
  spec: string;
  minRequirement: number | string;
}

export const automatedChecks: InspectionMetaData[] = [
  {
    name: 'RAM',
    key: 'ram',
    status: 'notStarted',
    spec: '-',
    minRequirement: 2000000000,
    type: 'basic',
  },
  {
    name: 'Processor',
    key: 'processor',
    status: 'notStarted',
    spec: '-',
    minRequirement: 32,
    type: 'basic',
  },
  {
    name: 'Monitor Specs',
    key: 'monitor',
    status: 'notStarted',
    spec: '-',
    minRequirement: 13,
    type: 'basic',
  },
  {
    name: 'Storage',
    key: 'storage',
    status: 'notStarted',
    spec: '-',
    minRequirement: 100,
    type: 'basic',
  },
  // {
  //   name: 'Internet Speed',
  //   key: 'netspeed',
  //   status: 'notStarted',
  //   spec: '-',
  //   minRequirement: 10,
  //   type: 'basic',
  // },
  {
    name: 'OS Compatibility',
    key: 'os',
    status: 'notStarted',
    spec: '-',
    minRequirement: 7,
    type: 'basic',
  },
  {
    name: 'Google Chrome',
    key: 'chrome',
    status: 'notStarted',
    spec: '-',
    minRequirement: 70,
    type: 'basic',
  },
  {
    name: 'MS Paint',
    key: 'paint',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'software',
  },
  {
    name: 'Filmora',
    key: 'filmora',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'software',
  },
  {
    name: 'Notepad',
    key: 'notepad',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'software',
  },
  {
    name: 'Github.com',
    key: 'https://github.com/',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
  {
    name: 'Tekie.in',
    key: 'https://www.tekie.in',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
  {
    name: 'kahoot.it',
    key: 'https://kahoot.it',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
  {
    name: 'fonts.googleapis.com',
    key: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,900&display=swap',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
  {
    name: 'figma.com',
    key: 'https://figma.com',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
  // {
  //   name: 'canva.com',
  //   key: 'https://www.canva.com/',
  //   status: 'notStarted',
  // },
  {
    name: 'docs.google.com',
    key: 'https://docs.google.com',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
  {
    name: 'code.org',
    key: 'https://code.org/',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
  {
    name: 'developers.google.com/blockly',
    key: 'https://developers.google.com/blockly',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
  {
    name: 'playcode.io',
    key: 'https://playcode.io/empty_html',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
  {
    name: 'filmora.wondershare.com',
    key: 'https://filmora.wondershare.com',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
  {
    name: 'google.com',
    key: 'https://google.com',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
  {
    name: 'mail.google.com',
    key: 'https://mail.google.com',
    status: 'notStarted',
    minRequirement: 0,
    spec: '-',
    type: 'firewall',
  },
];

export const StatusBadgeIcons: {
  notStarted: string;
  processing: string;
  compatible: string;
  incompatible: string;
} = {
  notStarted: '',
  processing: '',
  compatible: CompatibleIcon,
  incompatible: IncompatibleIcon,
};

const AutomatedInspection = ({
  systemInfoWithSameUuidExists,
  startInspection,
  inspectionData,
  onChangeMetaData,
  selectedLab,
  selectedComputerSrNo,
  selectedSchoolData,
  onComputerSrNoChange,
  setStartInspection,
}: {
  systemInfoWithSameUuidExists: boolean;
  startInspection: boolean;
  inspectionData: {
    inspectionMetaData: Array<any> | null;
    allSystemInfo: object;
    status: 'compatible' | 'processing' | 'incompatible' | 'notStarted';
  };
  selectedLab: any;
  selectedComputerSrNo: any;
  selectedSchoolData: any;
  onComputerSrNoChange: (e: { label: string; value: string }) => void;
  setStartInspection: (status: boolean) => void;
  onChangeMetaData: (metaData: {
    allSystemInfo: object;
    inspectionMetaData: object;
    status: InspectionStatus;
  }) => void;
}) => {
  const [isWin7, setIsWin7] = React.useState(false);
  const [inspectionMetaData, setInspectionMetaData] = React.useState<
    InspectionMetaData[]
  >(
    automatedChecks.map((val) => {
      if (inspectionData?.inspectionMetaData?.length) {
        const check = inspectionData.inspectionMetaData.find(
          (e: any) => e.key === val.key
        );
        if (check) {
          return {
            ...val,
            status: check.status || val.status,
            spec: check?.spec || val?.spec,
          };
        }
      }
      return val;
    })
  );
  const [inspectionStatus, setInspectionStatus] =
    React.useState<InspectionStatus>(inspectionData.status || 'notStarted');
  const [systemInformation, setSystemInfo] = React.useState<any>(
    inspectionData.allSystemInfo || {}
  );

  window.electron.ipcRenderer.once('lab-inspection', async (arg: any) => {
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
      const systemDistro =
        systemInfo?.os?.distro || `${systemInfo?.os?.platform} 7`;
      const isWin7System = systemDistro.indexOf('7') !== -1;
      if (meta.type === 'basic') {
        switch (meta.key) {
          case 'ram': {
            const ramValue = formatBytes(systemInfo?.mem?.total || 0);
            const availableRamValue = formatBytes(
              systemInfo?.mem?.available || 0
            );
            if (systemInfo?.mem?.total >= meta.minRequirement)
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
                systemInfo?.graphics?.displays?.[0]?.currentRefreshRate || ''
              } Hz`,
              value: systemInfo?.graphics?.displays?.[0]?.size?.width,
            };
            updatedInspection.status = 'compatible';
            updatedInspection.spec = monitorValue?.label;
            break;
          }
          case 'storage': {
            const storageValue = formatBytes(
              systemInfo?.diskLayout?.[0]?.size || arg?.space?.size || 0
            );
            const minRequirement = isWin7System ? 50 : meta.minRequirement;
            if (storageValue.raw >= minRequirement)
              updatedInspection.status = 'compatible';
            updatedInspection.spec = storageValue?.label;
            break;
          }
          case 'os': {
            if (isWin7System) setIsWin7(true);
            if (
              ['7', '8', '10', '11', 'macOS'].some(
                (value) => systemDistro.indexOf(value) !== -1
              )
            ) {
              updatedInspection.status = 'compatible';
            }
            updatedInspection.spec = systemDistro;
            break;
          }
          case 'chrome': {
            const isMacOS = systemDistro.indexOf('macOS') !== -1;
            const chromeVersion =
              arg?.installedApps?.chrome?.Version ||
              arg?.installedApps?.chrome?.version ||
              0;
            if (isMacOS) updatedInspection.status = 'compatible';
            if (parseFloat(chromeVersion) >= meta.minRequirement)
              updatedInspection.status = 'compatible';
            updatedInspection.spec = chromeVersion;
            break;
          }
          default:
            break;
        }
      } else if (meta.type === 'software') {
        const updatedSoftwareApp = meta;
        updatedSoftwareApp.status = 'incompatible';
        if (arg?.installedApps?.[updatedSoftwareApp.key]) {
          updatedSoftwareApp.status = 'compatible';
        }
        if (updatedSoftwareApp.status === 'incompatible') {
          isInspectionStatus = 'incompatible';
        }
      } else if (meta.type === 'firewall') {
        const updatedFirewall = meta;
        const statusObj = arg?.firewallChecklinksStatus.find(
          (data: any) => data.key === updatedFirewall.key
        );
        if (statusObj && statusObj.status) {
          updatedFirewall.status = 'compatible';
        } else {
          updatedFirewall.status = 'incompatible';
          isInspectionStatus = 'incompatible';
        }
      }
      if (updatedInspection.status === 'incompatible')
        isInspectionStatus = 'incompatible';
      return updatedInspection;
    });

    setInspectionMetaData(updatedeInspectionMetaData);
    setInspectionStatus(isInspectionStatus);
  });

  const startLabInspection = async () => {
    setInspectionMetaData(
      inspectionMetaData.map((meta) => ({
        ...meta,
        spec: '-',
        status: 'processing',
      }))
    );
    setInspectionStatus('processing');
    window.electron.ipcRenderer.sendMessage('lab-inspection', ['ping']);
  };

  React.useEffect(() => {
    if (startInspection) startLabInspection();
    setStartInspection(false);
  }, [startInspection]);

  React.useEffect(() => {
    if (inspectionStatus !== 'notStarted') {
      const updatedInspectionData = {
        inspectionMetaData,
        status: inspectionStatus,
        allSystemInfo: systemInformation,
      };
      onChangeMetaData(updatedInspectionData);
    }
  }, [inspectionStatus]);

  return (
    <div
      className="scroll-container"
      style={{
        paddingBottom: '250px',
      }}
    >
      <div className="configure-lab-header">
        <div className="preview-container">
          <div
            className="preview-container"
            style={{
              margin: 0,
              padding: 0,
            }}
          >
            <div className="preview-set">
              <span>School {!navigator.onLine ? 'Code' : 'Name'}</span>
              <h1 title={selectedSchoolData?.name || '-'}>
                {selectedSchoolData?.name || '-'}
              </h1>
            </div>
            <div className="preview-set">
              <span>Lab</span>
              <h1>Lab {selectedLab?.label || '-'}</h1>
            </div>
          </div>
          {inspectionStatus !== 'notStarted' && (
            <Button
              classNames="primary-button"
              style={{
                width: 'fit-content',
                fontSize: '12px',
                height: 'fit-content',
                whiteSpace: 'nowrap',
                fontFamily: 'Inter-Regular',
                padding: '10px 15px',
              }}
              title="Re-run Test"
              isDisabled={inspectionStatus === 'processing'}
              onClick={() => startLabInspection()}
            />
          )}
          {/* {navigator.onLine ? (
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
          </div> */}
        </div>
        <div
          className="configure-set-container"
          style={{
            margin: 0,
          }}
        >
          <div className="configure-set-1">
            <span>Computer Serial No.</span>
            <Select
              className="configure-set-dropdown"
              options={[]}
              value={selectedComputerSrNo}
              onChange={(e) =>
                onComputerSrNoChange(e || { label: '1', value: '1' })
              }
              isDisabled={systemInfoWithSameUuidExists}
              styles={colourStyles}
              placeholder="Enter Computer Serial No."
            />
          </div>
        </div>
        <table>
          <tr>
            <th>Sr.No</th>
            <th>Test Criteria</th>
            <th>Status</th>
            <th>Specification</th>
          </tr>
          {inspectionMetaData.map((val, index) => {
            const { type, status, spec } = val;
            let customStatus: string = status;
            if (type === 'software') {
              customStatus = softwareApplicationLabelMap[val.status];
            }
            if (customStatus === 'notStarted') customStatus = 'Not Inspected';
            if (customStatus === 'processing') customStatus = 'Inspecting';
            return (
              <tr key={val.name}>
                <td>{index + 1}</td>
                <td>{val.name}</td>
                <td>
                  <div className={`status-badge badge-${status}`}>
                    {StatusBadgeIcons[status] && (
                      <img src={StatusBadgeIcons[status]} alt="" />
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
  );
};

export default AutomatedInspection;
