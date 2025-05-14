import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { addDays } from 'date-fns';
import { CREATE_LEFTOVER, UPDATE_LEFTOVER, GET_LEFTOVER } from '../graphql/leftovers';
import { LeftoverInput, LeftoverUpdateInput } from '../types/leftover.types';

export function useLeftoverFormLogic() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [portion, setPortion] = useState(1);
  const [storageLocation, setStorageLocation] = useState<'freezer' | 'fridge'>('fridge');
  const [expiryDate, setExpiryDate] = useState<Date>(addDays(new Date(), 3));
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { loading: fetchLoading, error: fetchError, data } = useQuery(GET_LEFTOVER, {
    variables: { id },
    skip: !isEditing,
  });

  const [createLeftover, { loading: createLoading }] = useMutation(CREATE_LEFTOVER, {
    onCompleted: () => navigate('/'),
    onError: (error) => setError(`Error creating leftover: ${error.message}`),
  });

  const [updateLeftover, { loading: updateLoading }] = useMutation(UPDATE_LEFTOVER, {
    onCompleted: () => navigate('/'),
    onError: (error) => setError(`Error updating leftover: ${error.message}`),
  });

  useEffect(() => {
    if (isEditing && data?.leftover) {
      const leftover = data.leftover;
      setName(leftover.name);
      setDescription(leftover.description || '');
      setPortion(leftover.portion);
      setStorageLocation(leftover.storageLocation);
      setExpiryDate(new Date(Number(leftover.expiryDate)));
      setTags(leftover.tags || []);
    }
  }, [isEditing, data]);

  const handleAddTag = () => {
    if (currentTag.trim()) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name.trim()) {
        setError('Name is required');
        return;
      }
      if (portion <= 0) {
        setError('Portion must be greater than 0');
        return;
      }
      if (!expiryDate || isNaN(expiryDate.getTime())) {
        setError('Please select a valid expiry date');
        return;
      }
      const formattedExpiryDate = expiryDate.getTime().toString();
      const leftoverData = {
        name: name.trim(),
        description: description.trim() || undefined,
        portion,
        storageLocation,
        expiryDate: formattedExpiryDate,
        tags: tags.length > 0 ? tags : undefined,
      };
      if (isEditing) {
        updateLeftover({
          variables: {
            id,
            leftoverInput: leftoverData as LeftoverUpdateInput,
          },
        });
      } else {
        createLeftover({
          variables: {
            leftoverInput: leftoverData as LeftoverInput,
          },
        });
      }
    } catch (error) {
      setError(`An error occurred: ${error}`);
    }
  };

  const isLoading = fetchLoading || createLoading || updateLoading;

  return {
    isEditing,
    name,
    setName,
    description,
    setDescription,
    portion,
    setPortion,
    storageLocation,
    setStorageLocation,
    expiryDate,
    setExpiryDate,
    tags,
    setTags,
    currentTag,
    setCurrentTag,
    error,
    setError,
    fetchLoading,
    fetchError,
    handleAddTag,
    handleRemoveTag,
    handleSubmit,
    isLoading,
    navigate,
  };
}
