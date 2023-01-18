/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import '../ConfigureLab.scss';
import React from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { MetaData } from '../interface';
import colourStyles from '../styles';

const LabInspectionMetaData = ({
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
        <h1>Configure your Labs</h1>
        <span>Fill the below details, if already added skip to proceed</span>
      </div>
      <div className="configure-set-container">
        <div className="configure-set-1">
          <div style={{ display: 'flex', width: '100%' }}>
            <div className="configure-sub-set-container">
              <span>Total Number of Computers</span>
              <CreatableSelect
                className="configure-set-dropdown"
                options={[]}
                value={metaData.totalComputers}
                onChange={(e) =>
                  setMetaData({
                    ...metaData,
                    totalComputers: e,
                  })
                }
                styles={colourStyles}
                placeholder="Enter Total Computers"
              />
            </div>
            <div className="configure-sub-set-container">
              <span>Avg Student Per Class</span>
              <CreatableSelect
                className="configure-set-dropdown"
                options={[]}
                value={metaData.avgNoOfStudents}
                onChange={(e) =>
                  setMetaData({
                    ...metaData,
                    avgNoOfStudents: e,
                  })
                }
                styles={colourStyles}
                placeholder="Enter Avg Number of Students."
              />
            </div>
          </div>
        </div>
        <div className="configure-set-1">
          <div style={{ display: 'flex', width: '100%' }}>
            <div className="configure-sub-set-container">
              <span>Speakers</span>
              <Select
                className="configure-set-dropdown"
                isSearchable={false}
                options={[
                  {
                    value: 'centralisedSpeaker',
                    label: 'Centralised Speaker',
                  },
                  {
                    value: 'headphones',
                    label: 'Headphones',
                  },
                  {
                    value: 'none',
                    label: 'None',
                  },
                ]}
                value={metaData.selectedSpeaker}
                styles={colourStyles}
                onChange={(e) =>
                  setMetaData({
                    ...metaData,
                    selectedSpeaker: e,
                  })
                }
                placeholder="Select an option"
              />
            </div>
            <div className="configure-sub-set-container">
              <span>Power Backup</span>
              <Select
                className="configure-set-dropdown"
                isSearchable={false}
                options={[
                  {
                    value: 'yes',
                    label: 'Yes',
                  },
                  {
                    value: 'no',
                    label: 'No',
                  },
                  {
                    value: 'partial',
                    label: 'Partial',
                  },
                ]}
                value={metaData.selectedPowerBackup}
                styles={colourStyles}
                onChange={(e) =>
                  setMetaData({
                    ...metaData,
                    selectedPowerBackup: e,
                  })
                }
                placeholder="Select an option"
              />
            </div>
          </div>
        </div>
        <div className="configure-set-1">
          <span>Project Interactive Panel</span>
          <Select
            className="configure-set-dropdown"
            isSearchable={false}
            options={[
              {
                value: 'smartBoard',
                label: 'Smart Board',
              },
              {
                value: 'projector',
                label: 'Projector',
              },
              {
                value: 'none',
                label: 'None',
              },
            ]}
            value={metaData.selectedProjector}
            styles={colourStyles}
            onChange={(e) =>
              setMetaData({
                ...metaData,
                selectedProjector: e,
              })
            }
            placeholder="Select an option"
          />
        </div>
      </div>
    </div>
  );
};

export default LabInspectionMetaData;
