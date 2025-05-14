import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_LEFTOVER, DELETE_LEFTOVER, CONSUME_LEFTOVER, CONSUME_PORTION } from '../graphql/leftovers';
import { Leftover } from '../types/leftover.types';

export function useLeftoverDetailsLogic() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [consumeDialogOpen, setConsumeDialogOpen] = useState(false);
  const [consumePortionDialogOpen, setConsumePortionDialogOpen] = useState(false);
  const [portionAmount, setPortionAmount] = useState(0.5);

  const { loading, error, data } = useQuery(GET_LEFTOVER, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteLeftover, { loading: deleteLoading }] = useMutation(DELETE_LEFTOVER, {
    onCompleted: () => navigate('/'),
    onError: (error) => console.error('Delete error:', error),
  });

  const [consumeLeftover, { loading: consumeLoading }] = useMutation(CONSUME_LEFTOVER, {
    onCompleted: () => setConsumeDialogOpen(false),
    onError: (error) => console.error('Consume error:', error),
    refetchQueries: [{ query: GET_LEFTOVER, variables: { id } }],
  });

  const [consumePortion, { loading: consumePortionLoading }] = useMutation(CONSUME_PORTION, {
    onCompleted: () => setConsumePortionDialogOpen(false),
    onError: (error) => console.error('Consume portion error:', error),
    refetchQueries: [{ query: GET_LEFTOVER, variables: { id } }],
  });

  const handleDelete = () => { if (id) deleteLeftover({ variables: { id } }); };
  const handleConsume = () => { if (id) consumeLeftover({ variables: { id } }); };
  const handleConsumePortion = () => { if (id && portionAmount > 0) consumePortion({ variables: { id, amount: portionAmount } }); };

  return {
    loading,
    error,
    data,
    deleteDialogOpen,
    setDeleteDialogOpen,
    consumeDialogOpen,
    setConsumeDialogOpen,
    consumePortionDialogOpen,
    setConsumePortionDialogOpen,
    portionAmount,
    setPortionAmount,
    deleteLoading,
    consumeLoading,
    consumePortionLoading,
    handleDelete,
    handleConsume,
    handleConsumePortion,
  };
}
