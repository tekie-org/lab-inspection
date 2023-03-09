/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StateLabelData {
  code?: string;
  label: string;
  value: string;
}

export interface School {
  name: string;
  id: string;
}

export interface MetaData {
  totalComputers: number | null;
  totalWorkingComputers: number | null;
  selectedSpeaker: StateLabelData | null;
  selectedPowerBackup: StateLabelData | null;
  selectedPowerBackupType: StateLabelData | null;
  selectedProjector: StateLabelData | null;
  internetMode: StateLabelData | null;
  internetSpeed: number | null;
  serviceProviderType: StateLabelData | null;
  inspectionDate: string | null;
  sharedSystemArchSetup: StateLabelData | null;
  masterSystem: StateLabelData | null;
  totalNumberOfConnectedSystems: number | null;
}
