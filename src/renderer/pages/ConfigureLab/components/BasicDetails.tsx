/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import '../ConfigureLab.scss';
import React from 'react';
import Select from 'react-select/creatable';
import colourStyles from '../styles';

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
  schools,
  selectedSchool,
  selectedLab,
  selectedComputerSrNo,
  onSchoolChange,
  onLabChange,
  onComputerSrNoChange,
}: {
  schools: Array<any>;
  selectedSchool: { label: string; value: string; code?: string } | null;
  selectedLab: { label: string; value: string } | null;
  selectedComputerSrNo: { label: string; value: string } | null;
  onSchoolChange: (
    e: { label: string; value: string; code: string } | null
  ) => void;
  onLabChange: (e: { label: string; value: string } | null) => void;
  onComputerSrNoChange: (e: { label: string; value: string }) => void;
}) => {
  return (
    <div className="configure-lab-container">
      <div className="configure-lab-header">
        <h1>Configure your Labs</h1>
        <span>Select the school to configure the Labs</span>
      </div>
      <div className="configure-set-container">
        <div className="configure-set-1">
          <span>School Code</span>
          <input
            className="configure-set-dropdown"
            value={selectedSchool?.code}
            type="text"
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
              onComputerSrNoChange({ label: '1', value: '1' });
            }}
            placeholder="Please Enter School Code"
          />
          <span className="configure-school-name">
            {selectedSchool?.label && <>Name: {selectedSchool?.label}</>}
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
          <span>Select Lab</span>
          <Select
            className="configure-set-dropdown"
            options={
              schools && schools.length
                ? schools
                    .find((school) => school.id === selectedSchool?.value)
                    ?.labInspections?.map((lab: any) => ({
                      label: lab.labName,
                      value: lab.id,
                    }))
                : []
            }
            onChange={(e) => onLabChange(e)}
            value={selectedLab}
            styles={colourStyles}
            placeholder="Enter Lab Name"
          />
        </div>
        <div className="configure-set-1">
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
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
