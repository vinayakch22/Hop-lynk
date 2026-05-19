import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateUrl, validateAlias } from '../../utils/validators';

export const CreateUrlModal = ({ isOpen, onClose, onCreated }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleClose = () => {
    reset();
    setShowAdvanced(false);
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      await onCreated({
        originalUrl: data.originalUrl,
        customAlias: data.customAlias || undefined,
        expiresAt: data.expiresAt || undefined,
      });
      toast.success('Short URL created! 🎉');
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create URL');
    }
  };

  const minDate = new Date(Date.now() + 60000).toISOString().slice(0, 16);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Short URL">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Destination URL"
          id="create-url-input"
          type="url"
          placeholder="https://example.com/your-long-url"
          error={errors.originalUrl?.message}
          hint="Paste any http or https URL"
          {...register('originalUrl', { validate: validateUrl })}
        />

        <button
          type="button"
          onClick={() => setShowAdvanced((s) => !s)}
          className="flex items-center gap-2 text-sm text-(--color-brand-600) hover:text-(--color-brand-500) transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Advanced options
        </button>

        {showAdvanced && (
          <div className="space-y-4 p-4 bg-(--bg) rounded-lg border border-(--border) animate-fade-in-up">
            <Input
              label="Custom alias (optional)"
              id="create-alias-input"
              type="text"
              placeholder="my-custom-link"
              error={errors.customAlias?.message}
              hint="3–30 chars: letters, numbers, hyphens, underscores"
              {...register('customAlias', { validate: validateAlias })}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-expiry-input" className="text-sm font-medium text-(--text-secondary)">
                Expiration date (optional)
              </label>
              <input
                id="create-expiry-input"
                type="datetime-local"
                min={minDate}
                className="w-full px-3.5 py-2.5 text-sm bg-(--surface) border border-(--border) rounded-lg text-(--text-primary) input-ring focus:border-(--color-brand-500) transition-all"
                {...register('expiresAt')}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={isSubmitting} id="create-url-submit">
            Create URL
          </Button>
        </div>
      </form>
    </Modal>
  );
};
