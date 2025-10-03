import { processScan as runProcessScan } from '@scamshield/jobs';
import { prisma } from '../prisma';

export async function processScan(scanId: string) {
  return runProcessScan({ prisma, scanId });
}
