import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateUrl, validateAlias } from '../../utils/validators';
import { formatDate } from '../../utils/formatters';

export const EditUrlModal = ({ isOpen, onClose, url, onUpdated }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (url) {
      reset({
        originalUrl: url.originalUrl || '',
        customAlias: url.customAlias || '',
        expiresAt: url.expiresAt ? new Date(url.expiresAt).toISOString().slice(0, 16) : '',
      });
    }
  }, [url, reset]);

  const onSubmit = async (data) => {
    try {
      await onUpdated(url._id, {
        originalUrl: data.originalUrl,
        customAlias: data.customAlias || null,
        expiresAt: data.expiresAt || null,
      });
      toast.success('URL updated successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update URL');
    }
  };

  const minDate = new Date(Date.now() + 60000).toISOString().slice(0, 16);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit URL">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Destination URL"
          id="edit-url-input"
          type="url"
          placeholder="https://example.com"
          error={errors.originalUrl?.message}
          {...register('originalUrl', { validate: validateUrl })}
        />
        <Input
          label="Custom alias"
          id="edit-alias-input"
          type="text"
          placeholder="my-link"
          error={errors.customAlias?.message}
          hint="Leave empty to keep current alias"
          {...register('customAlias', { validate: validateAlias })}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-expiry-input" className="text-sm font-medium text-(--text-secondary)">
            Expiration date
          </label>
          <input
            id="edit-expiry-input"
            type="datetime-local"
            min={minDate}
            className="w-full px-3.5 py-2.5 text-sm bg-(--surface) border border-(--border) rounded-lg text-(--text-primary) input-ring focus:border-(--color-brand-500) transition-all"
            {...register('expiresAt')}
          />
          {url?.expiresAt && (
            <p className="text-xs text-(--text-muted)">Current: {formatDate(url.expiresAt)}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={isSubmitting} id="edit-url-submit">
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
