export interface Product {
  _id?: string;
  index?: number;
  Name?: string;
  FileName?: string;
  Profile?: string;
  Length?: number;
  FullPath?: string;
  Data1?: string;
  Data2?: string;
  Data3?: string;
  Data4?: string;
  Data5?: string;
  Data6?: string;
  Data7?: string;
  Data8?: string;
  Data9?: string;
  Data10?: string;
  Data11?: string;
  Data12?: string | boolean;
}

export interface Batch {
  _id?: string;
  index?: number;
  Data1?: string; // BatchID
  Data2: string;  // Batch name (required)
  Data3: string;  // "<productId>x<count>, ..." (required)
  Data4?: string; // required length
  Data5?: string; // estimated cutting time
  Data6?: string; // profile
  Data7?: string; // cut sequence
  Data8?: string; // status (Waiting/Running/Done)
  Data9?: string; // priority
  Data10?: string; // comment
  Data11?: string; // laser power
  Data12?: boolean; // selection
  FullPath?: string; // "NA" or path
}

export interface MachineStatus {
  state: string;
  progressPct: number;
  currentProduct: string;
}

export interface MachineEvent {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: string;
}

export interface AuthUser {
  sub: string;
  email?: string;
  roles?: string[];
}