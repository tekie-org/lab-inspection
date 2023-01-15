export interface StateLabelData {
  label: string;
  value: string;
}

export interface School {
  name: string;
  id: string;
}

export interface MetaData {
  totalComputers: StateLabelData | null;
  avgNoOfStudents: StateLabelData | null;
  selectedSpeaker: StateLabelData | null;
  selectedPowerBackup: StateLabelData | null;
  selectedProjector: StateLabelData | null;
}
