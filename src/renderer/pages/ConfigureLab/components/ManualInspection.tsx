/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import '../ConfigureLab.scss';
import React from 'react';
import Select from 'react-select';

type InspectionStatus =
  | 'compatible'
  | 'processing'
  | 'incompatible'
  | 'notStarted';

interface ManualChecksInterface {
  name: string;
  key: string;
  description: string;
  status: InspectionStatus;
  spec: string;
  toggleLabels: string[];
}

export const manualChecks: ManualChecksInterface[] = [
  {
    name: 'Mouse',
    description: 'Confirm whether the Mouse is working or not.',
    key: 'mouse',
    status: 'processing',
    spec: '-',
    toggleLabels: ['Working', 'Not Working'],
  },
  {
    name: 'Keyboard',
    description: 'Confirm whether the keyboard is working or not.',
    key: 'keyboard',
    status: 'processing',
    spec: '-',
    toggleLabels: ['Working', 'Not Working'],
  },
  {
    name: 'MS Access',
    description: 'Confirm whether the Canva is working or not.',
    key: 'msAccess',
    status: 'processing',
    spec: '-',
    toggleLabels: ['Installed', 'Not Installed'],
  },
  {
    name: 'Canva',
    description: 'Confirm whether the MS Access is Installed or not',
    key: 'canva',
    status: 'processing',
    spec: '-',
    toggleLabels: ['Working', 'Not Working'],
  },
  {
    name: 'Sticker',
    description: 'Stick Computer Sr.No sticker on to the monitor',
    key: 'sticker',
    status: 'processing',
    spec: '-',
    toggleLabels: ['Completed', 'Pending'],
  },
  {
    name: 'Power Backup',
    description: 'Confirm whether the Power Backup is available or not.',
    key: 'powerBackup',
    status: 'processing',
    spec: '-',
    toggleLabels: ['Yes', 'No'],
  },
];

const ManualInspection = ({
  inspectionData,
  metaDataValue,
  onChangeMetaData,
  setUserComment,
  userComment,
}: {
  inspectionData: {
    inspectionMetaData: any;
    status: 'compatible' | 'processing' | 'incompatible' | 'notStarted';
    allSystemInfo: any;
    manualChecksData?: any;
  };
  metaDataValue: any;
  userComment: string;
  setUserComment: (comment: string) => void;
  onChangeMetaData: (metaData: {
    inspectionMetaData: any;
    status: 'compatible' | 'processing' | 'incompatible' | 'notStarted';
    allSystemInfo: any;
    manualChecksData?: any;
  }) => void;
}) => {
  const [manualChecksData, setManualChecksData] = React.useState<
    ManualChecksInterface[]
  >(
    manualChecks.map((val) => {
      if (inspectionData?.manualChecksData?.length) {
        const check = inspectionData.manualChecksData.find(
          (e: any) => e.key === val.key
        );
        if (check) {
          return {
            ...val,
            status: check.status || val.status,
          };
        }
      }
      return val;
    })
  );

  React.useEffect(() => {
    const updatedInspectionData = {
      ...inspectionData,
      manualChecksData,
    };
    onChangeMetaData(updatedInspectionData);
  }, [manualChecksData]);

  React.useEffect(() => {
    if (metaDataValue?.selectedPowerBackupType?.value !== 'individual') {
      setManualChecksData(
        manualChecks
          .filter((val) => val.key !== 'powerBackup')
          .map((val) => {
            if (inspectionData?.manualChecksData?.length) {
              const check = inspectionData.manualChecksData.find(
                (e: any) => e.key === val.key
              );
              if (check) {
                return {
                  ...val,
                  status: check.status || val.status,
                };
              }
            }
            return val;
          })
      );
    }
  }, [metaDataValue]);

  return (
    <div
      className="scroll-container"
      style={{
        paddingBottom: '200px',
      }}
    >
      <div
        className="configure-lab-header"
        style={{
          marginTop: '40px',
        }}
      >
        {manualChecksData.map((val) => {
          const { status, key } = val;
          if (
            key === 'powerBackup' &&
            metaDataValue?.selectedPowerBackupType?.value !== 'individual'
          ) {
            return null;
          }
          return (
            <div key={val.name} className="manual-check-container">
              <div>
                <span className="manual-check-title">{val.name}</span>
                <span className="manual-check-description">
                  {val.description}
                </span>
              </div>
              <div className="status-toggle">
                <>
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
                    {val.toggleLabels[0] || 'Working'}
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
                      status === 'incompatible' ? 'disabled-active' : ''
                    }
                  >
                    {val.toggleLabels[1] || 'Not Working'}
                  </span>
                </>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="configure-set-container"
        style={{
          margin: 0,
        }}
      >
        <div className="configure-set-1">
          <span>Comments</span>
          <input
            className="configure-set-dropdown"
            value={userComment}
            type="text"
            onChange={(e) => {
              setUserComment(e?.target?.value);
            }}
            placeholder="Add Additional Comments Here"
          />
        </div>
      </div>
    </div>
  );
};

export default ManualInspection;
