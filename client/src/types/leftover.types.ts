export type StorageLocation = 'freezer' | 'fridge';

export interface Leftover {
  id: string;
  name: string;
  description?: string | null;
  portion: number;
  storageLocation: StorageLocation;
  storedDate: string;
  expiryDate: string;
  ingredients?: string[] | null;
  tags?: string[] | null;
  consumed: boolean;
  consumedDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface LeftoverInput {
  name: string;
  description?: string;
  portion?: number;
  storageLocation: StorageLocation;
  expiryDate: string;
  ingredients?: string[];
  tags?: string[];
}

export interface LeftoverUpdateInput {
  name?: string;
  description?: string;
  portion?: number;
  storageLocation?: StorageLocation;
  expiryDate?: string;
  ingredients?: string[];
  tags?: string[];
  consumed?: boolean;
  consumedDate?: string;
}