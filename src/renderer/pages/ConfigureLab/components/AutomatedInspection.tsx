import '../ConfigureLab.scss';
import React from 'react';
import Collapsible from './Collapsible';
import { MetaData } from '../interface';
import ProcesssingIcon from '../../../assets/time.svg';
import CompatibleIcon from '../../../assets/tick.svg';
import IncompatibleIcon from '../../../assets/cross.svg';

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
  onChangeMetaData,
  metaDataValue,
}: {
  onChangeMetaData: (metaData: MetaData) => void;
  metaDataValue: MetaData;
}) => {
  const [metaData, setMetaData] = React.useState<MetaData>(metaDataValue);
  const [inspectionMetaData, setInspectionMetaData] =
    React.useState<InspectionMetaData[]>(basicChecks);

  window.electron.ipcRenderer.once('lab-inspection', (arg: any) => {
    // eslint-disable-next-line no-console
    // const formattedData = {
    //   ram: formatBytes(arg.mem.total),
    //   processor: `${arg.osInfo.arch} ${arg.cpu.brand}`,
    //   monitor: `${arg.graphics.displays[0]} ${arg.cpu.brand}`,
    // };

    const systemInfo = arg?.systemInfo || {};
    console.log('METAAAA DATA:', arg);

    const updatedeInspectionMetaData = inspectionMetaData.map((meta) => {
      const updatedInspection = meta;
      updatedInspection.status = 'incompatible';
      switch (meta.key) {
        case 'ram': {
          const ramValue = formatBytes(systemInfo?.mem?.total || 0);
          if (ramValue.raw >= meta.minRequirement)
            updatedInspection.status = 'compatible';
          updatedInspection.spec = ramValue.label;
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
          updatedInspection.spec = processorValue.label;
          break;
        }
        case 'monitor': {
          const monitorValue = {
            label: `${
              systemInfo?.graphics?.displays?.[0]?.resolutionX || 0
            } X ${systemInfo?.graphics?.displays?.[0]?.resolutionY || 0} ${
              systemInfo?.graphics?.displays?.[0]?.currentRefreshRate
            }`,
            value: systemInfo?.graphics?.displays?.[0]?.size?.width,
          };
          updatedInspection.status = 'compatible';
          updatedInspection.spec = monitorValue.label;
          break;
        }
        case 'storage': {
          const storageValue = formatBytes(
            systemInfo?.diskLayout?.[0]?.size || 0
          );
          if (storageValue.raw >= meta.minRequirement)
            updatedInspection.status = 'compatible';
          updatedInspection.spec = storageValue.label;
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
          // updatedInspection.status =
          break;
        }
        default:
          break;
      }
      return updatedInspection;
    });
    setInspectionMetaData(updatedeInspectionMetaData);
  });

  React.useEffect(() => {
    onChangeMetaData(metaData);
  }, [metaData, onChangeMetaData]);
  return (
    <div className="configure-lab-container">
      <div className="configure-lab-header">
        <div className="preview-container">
          <div className="preview-set">
            <span>School Name</span>
            <h1>Demo School</h1>
          </div>
          <div className="preview-set">
            <span>Lab</span>
            <h1>Primary</h1>
          </div>
          <div className="preview-set">
            <span>Sr. No</span>
            <h1>01</h1>
          </div>
          <div className="preview-set">
            <span>Inspection Status</span>
            <h1 className="preview-status-processing">Processing</h1>
          </div>
        </div>
        <Collapsible open header="Basic Checks">
          <table>
            <tr>
              <th>Test Criteria</th>
              <th>STATUS</th>
              <th>SPECIFICATION</th>
            </tr>
            {inspectionMetaData.map((val) => {
              return (
                <tr key={val.name}>
                  <td>{val.name}</td>
                  <td>
                    <div className={`status-badge badge-${val.status}`}>
                      <img src={StatusBadgeIcons[val.status]} alt="" />
                      {val.status}
                    </div>
                  </td>
                  <td>{val.spec}</td>
                </tr>
              );
            })}
          </table>
        </Collapsible>
        {/* <Collapsible open header="Firewall">
        </Collapsible> */}
      </div>
    </div>
  );
};

export default AutomatedInspection;
