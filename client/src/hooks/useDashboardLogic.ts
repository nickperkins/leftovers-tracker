import { useQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GET_LEFTOVERS } from '../graphql/leftovers';
import { Leftover, StorageLocation } from '../types/leftover.types';

export function useDashboardLogic() {
  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get('location') as StorageLocation | null;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLeftovers, setFilteredLeftovers] = useState<Leftover[]>([]);

  const { loading, error, data } = useQuery(GET_LEFTOVERS, {
    variables: { location: locationParam },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data?.leftovers) {
      setFilteredLeftovers(
        data.leftovers.filter((leftover: Leftover) =>
          leftover.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leftover.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leftover.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
  }, [data, searchTerm]);

  return {
    loading,
    error,
    filteredLeftovers,
    searchTerm,
    setSearchTerm,
    locationParam,
  };
}
