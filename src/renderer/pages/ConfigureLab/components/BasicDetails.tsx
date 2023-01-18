/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import '../ConfigureLab.scss';
import React from 'react';
import Select from 'react-select/creatable';
import { School } from '../interface';
import colourStyles from '../styles';

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
  selectedSchool: { label: string; value: string } | null;
  selectedLab: { label: string; value: string } | null;
  selectedComputerSrNo: { label: string; value: string } | null;
  onSchoolChange: (e: { label: string; value: string } | null) => void;
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
          <span>Select School</span>
          <Select
            className="configure-set-dropdown"
            // isSearchable={false}
            options={
              schools && schools.length
                ? schools.map((school) => ({
                    label: school.name,
                    value: school.id,
                  }))
                : []
            }
            onChange={(e) => onSchoolChange(e)}
            value={selectedSchool}
            styles={colourStyles}
            placeholder="Select an option"
          />
        </div>
        <div className="configure-set-1">
          <span>Select Lab</span>
          <Select
            className="configure-set-dropdown"
            options={
              schools && schools.length
                ? schools
                    .find((school) => school.name === selectedSchool?.label)
                    ?.labInspections?.map((lab: any) => ({
                      label: lab.labName,
                      value: lab.id,
                    }))
                : []
            }
            onChange={(e) => onLabChange(e)}
            value={selectedLab}
            styles={colourStyles}
            placeholder="Type Lab Name"
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
            placeholder="Type Computer Serial No."
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
