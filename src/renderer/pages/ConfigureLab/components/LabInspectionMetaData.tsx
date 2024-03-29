/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import '../ConfigureLab.scss';
import React from 'react';
import debounce from 'lodash/debounce';
import Select from 'react-select';
import {
  displayOptions,
  internetOptions,
  powerBackupOptions,
  powerBackupTypeOptions,
  serviceProviderType,
  speakerOptions,
  yesNoOption,
} from 'utils/configurationOptions';
import { MetaData } from '../interface';
import colourStyles from '../styles';

const dateToInput = function (date: any) {
  let dateObj = new Date(date);
  if (!date) dateObj = new Date();
  return (
    `${dateObj.getFullYear()}-${`0${dateObj.getMonth() + 1}`.substr(
      -2,
      2
    )}-${`0${dateObj.getDate()}`.substr(-2, 2)}T` +
    `${`0${dateObj.getHours()}`.substr(
      -2,
      2
    )}:${`0${dateObj.getMinutes()}`.substr(-2, 2)}`
  );
};

const LabInspectionMetaData = ({
  metaDataAlreadyExists,
  onChangeMetaData,
  metaDataValue,
}: {
  metaDataAlreadyExists: boolean;
  onChangeMetaData: (metaData: MetaData) => void;
  metaDataValue: MetaData;
}) => {
  const [metaData, setMetaData] = React.useState<MetaData>(metaDataValue);
  React.useEffect(() => {
    onChangeMetaData(metaData);
  }, [metaData]);

  React.useEffect(() => {
    debounce(() => {
      setMetaData(metaDataValue);
    }, 1)();
  }, [metaDataValue]);
  return (
    <div className="configure-set-container">
      <div className="configure-set-1">
        <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
          <div className="configure-sub-set-container">
            <span>Total Number of Computers</span>
            <input
              className="configure-set-dropdown"
              disabled={metaDataAlreadyExists}
              value={
                !metaData.totalComputers && metaData.totalComputers !== 0
                  ? ''
                  : metaData.totalComputers
              }
              onWheel={(event) => event.currentTarget.blur()}
              type="number"
              min={0}
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
              disabled={metaDataAlreadyExists}
              className="configure-set-dropdown"
              value={
                !metaData.totalWorkingComputers &&
                metaData.totalWorkingComputers !== 0
                  ? ''
                  : metaData.totalWorkingComputers
              }
              type="number"
              min={0}
              onWheel={(event) => event.currentTarget.blur()}
              onChange={(e) =>
                setMetaData({
                  ...metaData,
                  totalWorkingComputers: parseInt(e.target.value, 10),
                })
              }
              placeholder="Enter Total Working Computers"
            />
          </div>
          <div className="configure-sub-set-container">
            <span>Power Backup</span>
            <Select
              isDisabled={metaDataAlreadyExists}
              className="configure-set-dropdown"
              isSearchable={false}
              options={powerBackupOptions}
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
              isDisabled={
                !metaData.selectedPowerBackup?.value ||
                metaData.selectedPowerBackup?.value === 'no' ||
                metaDataAlreadyExists
              }
              isSearchable={false}
              options={powerBackupTypeOptions}
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
          <div className="configure-sub-set-container">
            <span>Speakers</span>
            <Select
              isDisabled={metaDataAlreadyExists}
              className="configure-set-dropdown"
              isSearchable={false}
              options={speakerOptions}
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
            <span>Display</span>
            <Select
              isDisabled={metaDataAlreadyExists}
              className="configure-set-dropdown"
              isSearchable={false}
              options={displayOptions}
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
          <div className="configure-sub-set-container">
            <span>Internet Mode</span>
            <Select
              isDisabled={metaDataAlreadyExists}
              className="configure-set-dropdown"
              isSearchable={false}
              options={internetOptions}
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
          <div className="configure-sub-set-container">
            <span>Internet Speed (In MBPS)</span>
            <input
              className="configure-set-dropdown"
              disabled={metaDataAlreadyExists}
              value={
                !metaData.internetSpeed && metaData.internetSpeed !== 0
                  ? ''
                  : metaData.internetSpeed
              }
              onWheel={(event) => event.currentTarget.blur()}
              type="number"
              min={0}
              onChange={(e) => {
                setMetaData({
                  ...metaData,
                  internetSpeed: parseInt(e.target.value, 10),
                });
              }}
              placeholder="Enter Lab Internet Speed In MBPS"
            />
          </div>
          <div className="configure-sub-set-container">
            <span>Service Provider Type</span>
            <Select
              isDisabled={metaDataAlreadyExists}
              className="configure-set-dropdown"
              isSearchable={false}
              options={serviceProviderType}
              value={metaData.serviceProviderType}
              styles={colourStyles}
              onChange={(e) =>
                setMetaData({
                  ...metaData,
                  serviceProviderType: e,
                })
              }
              placeholder="Select an option"
            />
          </div>
          <div className="configure-sub-set-container">
            <span>Inspection Date</span>
            <input
              style={{
                display: 'inline-block',
                position: 'relative',
              }}
              className="configure-set-dropdown"
              disabled={metaDataAlreadyExists}
              value={`${dateToInput(metaData.inspectionDate)}`}
              type="datetime-local"
              onChange={(e) =>
                setMetaData({
                  ...metaData,
                  inspectionDate: e.target.value,
                })
              }
              placeholder="Enter Total Computers"
            />
          </div>
          <div className="configure-sub-set-container">
            <span>Is Lab Systems Shared (Ex: N-Computing or Thin-client)</span>
            <Select
              isDisabled={metaDataAlreadyExists}
              className="configure-set-dropdown"
              isSearchable={false}
              options={yesNoOption}
              value={metaData.sharedSystemArchSetup}
              styles={colourStyles}
              onChange={(e) =>
                setMetaData({
                  ...metaData,
                  sharedSystemArchSetup: e,
                })
              }
              placeholder="Select an option"
            />
          </div>
          {metaData?.sharedSystemArchSetup?.value === 'yes' ? (
            <div className="configure-sub-set-container">
              <span>Is this Master System ?</span>
              <Select
                isDisabled={metaDataAlreadyExists}
                className="configure-set-dropdown"
                isSearchable={false}
                options={yesNoOption}
                value={metaData.masterSystem}
                styles={colourStyles}
                onChange={(e) =>
                  setMetaData({
                    ...metaData,
                    masterSystem: e,
                  })
                }
                placeholder="Select an option"
              />
            </div>
          ) : null}
          {metaData?.sharedSystemArchSetup?.value === 'yes' &&
          metaData?.masterSystem?.value === 'yes' ? (
            <div className="configure-sub-set-container">
              <span>Number of Systems Connected ?</span>
              <input
                className="configure-set-dropdown"
                disabled={metaDataAlreadyExists}
                value={
                  !metaData.totalNumberOfConnectedSystems &&
                  metaData.totalNumberOfConnectedSystems !== 0
                    ? ''
                    : metaData.totalNumberOfConnectedSystems
                }
                onWheel={(event) => event.currentTarget.blur()}
                type="number"
                min={0}
                onChange={(e) =>
                  setMetaData({
                    ...metaData,
                    totalNumberOfConnectedSystems: parseInt(e.target.value, 10),
                  })
                }
                placeholder="Enter Total Computers Connected"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LabInspectionMetaData;
