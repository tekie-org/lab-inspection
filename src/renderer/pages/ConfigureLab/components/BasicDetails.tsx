/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import '../ConfigureLab.scss';
import React from 'react';
import Select from 'react-select/creatable';
import { components } from 'react-select';
import colourStyles from '../styles';
import LabInspectionMetaData from './LabInspectionMetaData';
import { MetaData } from '../interface';

const levenshteinDistance = (s: any, t: any) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
};

const BasicDetails = ({
  certError,
  systemInfoWithSameUuidExists,
  metaDataAlreadyExists,
  isFetching,
  schools,
  selectedSchool,
  selectedLab,
  selectedLabNo,
  onSchoolChange,
  onLabChange,
  onLabNoChange,
  onComputerSrNoChange,
  onChangeMetaData,
  metaDataValue,
}: {
  certError: boolean;
  systemInfoWithSameUuidExists: boolean;
  metaDataAlreadyExists: boolean;
  isFetching: boolean;
  schools: Array<any>;
  selectedSchool: { label: string; value: string; code?: string } | null;
  selectedLab: { label: string; value: string } | null;
  selectedLabNo: { label: string; value: string } | null;
  onSchoolChange: (
    e: { label: string; value: string; code: string } | null
  ) => void;
  onLabChange: (e: { label: string; value: string } | null) => void;
  onLabNoChange: (e: { label: string; value: string } | null) => void;
  onComputerSrNoChange: (e: { label: string; value: string }) => void;
  onChangeMetaData: (metaData: MetaData) => void;
  metaDataValue: MetaData;
}) => {
  const [editMetaData, setEditMetaData] = React.useState<boolean>(false);
  return (
    <div className="configure-set-container scroll-container">
      <div className="configure-set-1">
        <span>School Code</span>
        <div
          style={{
            width: '100%',
            position: 'relative',
          }}
        >
          <input
            className="configure-set-dropdown"
            value={selectedSchool?.code}
            type="text"
            disabled={isFetching}
            onChange={(e) => {
              const schoolDetail = (schools || []).find(
                (school) =>
                  e?.target?.value?.toLowerCase() ===
                  school?.code?.toLowerCase()
              );
              if (schoolDetail?.id) {
                onSchoolChange({
                  code: e?.target?.value,
                  label: schoolDetail?.name,
                  value: schoolDetail?.id,
                });
              } else {
                onSchoolChange({
                  code: e?.target?.value,
                  label: '',
                  value: '',
                });
              }
              onLabChange(null);
              onLabNoChange(null);
              onComputerSrNoChange({ label: '1', value: '1' });
            }}
            placeholder={
              isFetching ? 'Fetching Schools' : 'Please Enter School Code'
            }
          />
          {isFetching && (
            <div className="loading-icon-container">
              <i className="loader" />
            </div>
          )}
        </div>
        <span className="configure-school-name">
          {selectedSchool?.label ? (
            <>School Name: {selectedSchool?.label}</>
          ) : schools && schools.length ? (
            selectedSchool?.code &&
            navigator?.onLine && (
              <span
                style={{
                  color: 'rgba(211, 75, 87, 1)',
                }}
              >
                No Schools found with code &quot;{selectedSchool?.code}&quot;,
                try again.
              </span>
            )
          ) : null}
          {
            certError ? (
              <span
                style={{
                  color: 'rgba(211, 75, 87, 1)',
                }}
              >
                Some Error Occured, Couldn't Fetch Schools. Please follow this <span style={{
                  color: 'rgba(211, 75, 87, 1)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontStyle: 'italic',
                }}
                onClick={() => {
                  window.open('https://smithgajjar.notion.site/Certificate-ERR_INVALID-Solution-be7bdb86652446f3873f4bbb4c0e8faa', '_blank');
                }}><b>Instruction</b></span> if you are on Windows 7 to resolve certification error and try again or continue with school code and download inspection report at the end.
              </span>
            ) : null
          }
        </span>
        {/* <br />
        <Select
          className="configure-set-dropdown"
          options={
            schools && schools.length
              ? schools.map((school) => ({
                  label: `${school.name} (${school.code.toUpperCase()})`,
                  value: school.id,
                }))
              : []
          }
          // isLoading={navigator.onLine}
          noOptionsMessage={() => 'Please Enter School Name'}
          onChange={(e) => onSchoolChange(e)}
          value={selectedSchool}
          styles={colourStyles}
          placeholder="Enter School Name"
        /> */}
      </div>
      <div className="configure-set-1">
        <span>Lab No</span>
        <Select
          className="configure-set-dropdown"
          options={
            schools && schools.length
              ? schools
                  .find((school) => school.id === selectedSchool?.value)
                  ?.labInspections?.map((lab: any) => ({
                    label: lab?.labNo,
                    value: lab.id,
                  }))
              : [{ label: '1', value: '' }]
          }
          components={{
            Option: ({ children, ...props }) => {
              return (
                <components.Option {...props}>
                  {`Lab ${children}`}
                </components.Option>
              );
            },
            SingleValue: ({ children, ...props }) => {
              return (
                <components.SingleValue {...props}>
                  {`Lab ${children}`}
                </components.SingleValue>
              );
            },
            IndicatorSeparator: () => null,
          }}
          isDisabled={
            (schools && schools.length
              ? !selectedSchool?.value
              : !selectedSchool?.code) || systemInfoWithSameUuidExists
          }
          onChange={(e) => onLabNoChange(e)}
          value={selectedLabNo}
          onKeyDown={(e) => {
            if (Number.isNaN(parseInt(e.key, 10)) && e.code !== 'Backspace')
              e.preventDefault();
          }}
          styles={colourStyles}
          placeholder="Select Or Create Lab No"
        />
      </div>
      {/* <div className="configure-set-1">
        <span>Computer Serial No.</span>
        <Select
        className="configure-set-dropdown"
        options={[]}
        value={selectedComputerSrNo}
        onChange={(e) =>
          onComputerSrNoChange(e || { label: '0', value: '0' })
        }
        styles={colourStyles}
        placeholder="Enter Computer Serial No."
        />
      </div> */}
      {selectedLabNo?.label && (
        <>
          <div className="configure-set-1">
            <span>Lab Display Name</span>
            <input
              className="configure-set-dropdown"
              value={selectedLab?.value}
              type="text"
              onChange={(e) => {
                onLabChange({
                  value: e?.target?.value,
                  label: e?.target?.value,
                });
              }}
              placeholder="Enter Lab Display Name"
            />
          </div>
          <div className="lab-configuration-header">
            <span>Lab Details</span>
            <span className="lab-details-bar" />
            {metaDataAlreadyExists && (
              <button
                type="button"
                onClick={() => {
                  setEditMetaData(true);
                }}
              >
                Edit Details
              </button>
            )}
          </div>
          {(metaDataAlreadyExists || !navigator.onLine) && (
            <div
              style={{
                color: 'hsl(0, 0%, 60%)',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '10px',
                textTransform: 'uppercase',
              }}
            >
              (Skip if already addded)
            </div>
          )}
          <LabInspectionMetaData
            metaDataAlreadyExists={
              editMetaData ? !editMetaData : metaDataAlreadyExists
            }
            metaDataValue={metaDataValue}
            onChangeMetaData={(props) => onChangeMetaData(props)}
          />
        </>
      )}
    </div>
  );
};

export default BasicDetails;
