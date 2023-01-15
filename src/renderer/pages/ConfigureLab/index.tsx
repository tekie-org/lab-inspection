/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import './ConfigureLab.scss';
import React from 'react';
import requestToGraphql from 'utils/requestToGraphQL';
import {
  BasicDetails,
  LabInspectionMetaData,
  AutomatedInspection,
  Button,
} from './components';
import { MetaData, School, StateLabelData } from './interface';

const defaultMetaDataValues = {
  totalComputers: null,
  avgNoOfStudents: null,
  selectedSpeaker: null,
  selectedPowerBackup: null,
  selectedProjector: null,
};

const ConfigureLab = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [schools, setSchools] = React.useState<School[] | []>([]);
  const [selectedSchool, setSelectedSchool] =
    React.useState<StateLabelData | null>(null);
  const [selectedLab, setSelectedLab] = React.useState<StateLabelData | null>(
    null
  );
  const [selectedComputerSrNo, setSelectedComputerSrNo] =
    React.useState<StateLabelData | null>(null);
  const [metaData, setMetaData] = React.useState<MetaData>(
    defaultMetaDataValues
  );

  const ConfigureLabPages = [
    {
      Component: (
        <BasicDetails
          schools={schools}
          selectedSchool={selectedSchool}
          selectedLab={selectedLab}
          selectedComputerSrNo={selectedComputerSrNo}
          onSchoolChange={(value) => {
            setSelectedSchool(value);
          }}
          onLabChange={(value) => {
            setSelectedLab(value);
          }}
          onComputerSrNoChange={(value) => {
            setSelectedComputerSrNo(value);
          }}
        />
      ),
      title: 'Basic Details',
      buttons: [
        <Button
          classNames="primary-button"
          title="Next"
          isDisabled={!selectedSchool || !selectedLab || !selectedComputerSrNo}
          onClick={() => {
            if (selectedSchool && selectedLab && selectedComputerSrNo) {
              if (ConfigureLabPages.length - 1 > currentPage) {
                setCurrentPage(currentPage + 1);
              } else {
                setCurrentPage(0);
              }
            }
          }}
        />,
      ],
    },
    {
      Component: (
        <LabInspectionMetaData
          metaDataValue={metaData}
          onChangeMetaData={(metaDataValue) => setMetaData(metaDataValue)}
        />
      ),
      title: 'Lab Inspection',
      buttons: [
        <Button
          classNames="secondary-button"
          title="Skip"
          isDisabled={false}
          onClick={() => {
            setCurrentPage(2);
          }}
        />,
        <Button
          classNames="primary-button"
          title="Next"
          isDisabled={!selectedSchool || !selectedLab || !selectedComputerSrNo}
          onClick={() => {
            if (selectedSchool && selectedLab && selectedComputerSrNo) {
              if (ConfigureLabPages.length - 1 > currentPage) {
                setCurrentPage(currentPage + 1);
              } else {
                setCurrentPage(0);
              }
            }
          }}
        />,
      ],
    },
    {
      Component: (
        <AutomatedInspection
          metaDataValue={metaData}
          onChangeMetaData={(metaDataValue) => setMetaData(metaDataValue)}
        />
      ),
      title: 'Automated Inspection',
      buttons: [
        <Button
          classNames="secondary-button"
          title="Regenerate Report"
          isDisabled={false}
          onClick={() => {
            setCurrentPage(2);
          }}
        />,
        <Button
          classNames="primary-button"
          title="Download Report"
          isDisabled={!selectedSchool || !selectedLab || !selectedComputerSrNo}
          onClick={() => {
            if (selectedSchool && selectedLab && selectedComputerSrNo) {
              if (ConfigureLabPages.length - 1 > currentPage) {
                setCurrentPage(currentPage + 1);
              } else {
                setCurrentPage(0);
              }
            }
          }}
        />,
      ],
    },
  ];

  React.useEffect(() => {
    console.log('metaData: ', metaData);
  }, [metaData]);

  React.useEffect(() => {
    async function fetchSchools() {
      // You can await here
      const res = await requestToGraphql(
        // labInspection {
        //   totalNumberOfComputers
        //   avgNumberOfStudents
        //   projectInteractivePanel
        //   speakers
        //   powerBackup
        // }
        `
          query {
            schools {
              id
              name
            }
          }
        `,
        {}
      );
      setSchools(res.data.schools || []);
    }
    fetchSchools();
  }, []);

  const currentPageConfiguration = ConfigureLabPages[currentPage];
  return (
    <>
      {currentPageConfiguration.Component}
      <div className="primary-button-container">
        {currentPageConfiguration.buttons.map((RenderButton) => RenderButton)}
      </div>
    </>
  );
};

export default ConfigureLab;
