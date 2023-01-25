/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import '../ConfigureLab.scss';
import React from 'react';
import Select from 'react-select';
import { MetaData } from '../interface';
import colourStyles from '../styles';

const LabInspectionMetaData = ({
  onChangeMetaData,
  setCurrentPage,
  metaDataValue,
}: {
  onChangeMetaData: (metaData: MetaData) => void;
  setCurrentPage: (pageNumber: number) => void;
  metaDataValue: MetaData;
}) => {
  const [metaData, setMetaData] = React.useState<MetaData>(metaDataValue);

  React.useEffect(() => {
    onChangeMetaData(metaData);
  }, [metaData, onChangeMetaData]);
  return (
    <div className="configure-lab-container">
      <div className="configure-lab-header left-aligned">
        <h1>
          Configure Labs
          <span className="optional-text-muted">(Skip if addded)</span>
        </h1>
        <div className="breadcrumbs">
          <span
            onClick={() => {
              setCurrentPage(0);
            }}
          >
            Select School
          </span>{' '}
          / <span className="active">Configure Labs</span> /{' '}
          <span style={{ cursor: 'default' }}>Perform Inspection</span>
        </div>
      </div>
      <div className="configure-set-container">
        <div className="configure-set-1">
          <div style={{ display: 'flex', width: '100%' }}>
            <div className="configure-sub-set-container">
              <span>Total Number of Computers</span>
              <input
                className="configure-set-dropdown"
                value={metaData.totalComputers}
                type="number"
                onChange={(e) =>
                  setMetaData({
                    ...metaData,
                    totalComputers: parseInt(e.target.value, 10),
                  })
                }
                placeholder="Enter Total Computers"
              />
            </div>
            <div className="configure-sub-set-container">
              <span>Working Computers</span>
              <input
                className="configure-set-dropdown"
                value={metaData.totalWorkingComputers}
                type="number"
                onChange={(e) =>
                  setMetaData({
                    ...metaData,
                    totalWorkingComputers: parseInt(e.target.value, 10),
                  })
                }
                placeholder="Enter Total Working Computers"
              />
            </div>
          </div>
        </div>
        <div className="configure-set-1">
          <div style={{ display: 'flex', width: '100%' }}>
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
            <div className="configure-sub-set-container">
              <span>Power Backup Type</span>
              <Select
                className="configure-set-dropdown"
                isSearchable={false}
                options={[
                  {
                    value: 'centralised',
                    label: 'Centralised',
                  },
                  {
                    value: 'individual',
                    label: 'Individual',
                  },
                ]}
                value={metaData.selectedPowerBackupType}
                styles={colourStyles}
                onChange={(e) =>
                  setMetaData({
                    ...metaData,
                    selectedPowerBackupType: e,
                  })
                }
                placeholder="Select an option"
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
        <div className="configure-set-1">
          <span>Internet Mode</span>
          <Select
            className="configure-set-dropdown"
            isSearchable={false}
            options={[
              {
                value: 'hotspot',
                label: 'Hotspot (Self)',
              },
              {
                value: 'wifi',
                label: 'Wifi',
              },
              {
                value: 'lan',
                label: 'LAN',
              },
              {
                value: 'none',
                label: 'None',
              },
            ]}
            value={metaData.internetMode}
            styles={colourStyles}
            onChange={(e) =>
              setMetaData({
                ...metaData,
                internetMode: e,
              })
            }
            placeholder="Select an option"
          />
        </div>
        <div className="configure-set-1">
          <span>Lab Photos</span>
          <div className="configure-set-dropdown custom-set">
            <div style={{ display: 'flex' }}>
              {Object.values(metaData?.mediaFiles || {})?.length
                ? Object.values(metaData?.mediaFiles).map((file: any) => (
                    <div className="file-preview">{file.name}</div>
                  ))
                : 'Upload Lab Photos Here'}
            </div>
            <button type="button">
              Upload
              <input
                type="file"
                onChange={(e) => {
                  console.log('aasfasf', e.target.files);
                  setMetaData({
                    ...metaData,
                    mediaFiles: e.target.files || [],
                  });
                }}
                multiple
                placeholder="Enter Total Computers"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabInspectionMetaData;
