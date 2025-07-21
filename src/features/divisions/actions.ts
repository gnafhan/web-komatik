import {
  addDivision as addDivisionFirestore,
  updateDivision as updateDivisionFirestore,
  deleteDivision as deleteDivisionFirestore
} from './utils/division-service';
import { Division } from '@/types';

export async function addDivision(data: Partial<Division>) {
  return addDivisionFirestore(data);
}

export async function updateDivision(id: string, updates: Partial<Division>) {
  return updateDivisionFirestore(id, updates);
}

export async function deleteDivision(id: string) {
  return deleteDivisionFirestore(id);
}
