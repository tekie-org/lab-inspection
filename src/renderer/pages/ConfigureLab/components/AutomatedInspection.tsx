import '../ConfigureLab.scss';
import React from 'react';
import Collapsible from './Collapsible';
import { MetaData } from '../interface';

const data = [
  { name: 'RAM', status: 'processing', spec: '2 GB DBR 3' },
  { name: 'Processor', status: 'processing', spec: 'Pentium 32 bit' },
  { name: 'Monitor Specs', status: 'processing', spec: '13 inch - 60 Hz' },
  { name: 'Storage', status: 'processing', spec: '100 GB' },
  { name: 'Internet Speed', status: 'processing', spec: '30 MBPS' },
  { name: 'OS Compatibility', status: 'processing', spec: 'Windows 7' },
  { name: 'Google Chrome', status: 'processing', spec: 'Version 70.0' },
];
const AutomatedInspection = ({
  onChangeMetaData,
  metaDataValue,
}: {
  onChangeMetaData: (metaData: MetaData) => void;
  metaDataValue: MetaData;
}) => {
  const [metaData, setMetaData] = React.useState<MetaData>(metaDataValue);

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
            <h1 className="preview-status-success">Completed</h1>
          </div>
        </div>
        <Collapsible open header="Basic Checks">
          <table>
            <tr>
              <th>Test Criteria</th>
              <th>STATUS</th>
              <th>SPECIFICATION</th>
            </tr>
            {data.map((val) => {
              return (
                <tr key={val.name}>
                  <td>{val.name}</td>
                  <td>{val.status}</td>
                  <td>{val.spec}</td>
                </tr>
              );
            })}
          </table>
        </Collapsible>
        <Collapsible open header="Firewall">
          <table>
            <tr>
              <th>Test Criteria</th>
              <th>STATUS</th>
              <th>SPECIFICATION</th>
            </tr>
            {data.map((val) => {
              return (
                <tr key={val.name}>
                  <td>{val.name}</td>
                  <td>{val.status}</td>
                  <td>{val.spec}</td>
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
