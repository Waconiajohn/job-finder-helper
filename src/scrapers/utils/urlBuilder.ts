import { SearchParams } from '@/types';

export const buildQueryParams = (params: SearchParams): Record<string, string> => {
  const searchParams: Record<string, string> = {};

  if (params.keywords) {
    searchParams.query = params.keywords;
  }

  if (params.location) {
    searchParams.location = params.location;
  }

  if (params.department) {
    searchParams.department = params.department;
  }

  return searchParams;
};