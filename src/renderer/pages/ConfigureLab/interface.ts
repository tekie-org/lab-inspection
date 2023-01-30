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
  totalComputers: number | undefined;
  totalWorkingComputers: number | undefined;
  selectedSpeaker: StateLabelData | null;
  selectedPowerBackup: StateLabelData | null;
  selectedPowerBackupType: StateLabelData | null;
  selectedProjector: StateLabelData | null;
  internetMode: StateLabelData | null;
  mediaFiles: any;
}
