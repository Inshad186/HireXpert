// components/WorkDeliveryModal.tsx
import { useState } from 'react';
import { X, Play, Upload, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Order } from '@/hooks/useOrderTracking';

interface WorkDeliveryModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStartWork: (orderId: string) => Promise<{ success: boolean; message: string }>;
  onSubmitDelivery: (
    orderId: string,
    files: File[],
    notes: string
  ) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
}

export function WorkDeliveryModal({order, isOpen, onClose, onStartWork, onSubmitDelivery, isLoading }: WorkDeliveryModalProps) {
  const [step, setStep] = useState<'view' | 'deliver'>('view');
  const [deliveryFiles, setDeliveryFiles] = useState<File[]>([]);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleStartWork = async () => {
    setError(null);
    setSuccess(null);
    const result = await onStartWork(order._id);
    
    if (result.success) {
      setSuccess('Work started! You can now submit delivery when ready.');
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setDeliveryFiles((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setDeliveryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitDelivery = async () => {
    if (deliveryFiles.length === 0) {
      setError('Please upload at least one file');
      return;
    }

    if (!deliveryNotes.trim()) {
      setError('Please add delivery notes');
      return;
    }
    setError(null);
    setSuccess(null);

    const result = await onSubmitDelivery(order._id, deliveryFiles, deliveryNotes);

    if (result.success) {
      setSuccess('Delivery submitted successfully!');
      setTimeout(() => {
        onClose();
        setSuccess(null);
        setDeliveryFiles([]);
        setDeliveryNotes('');
        setStep('view');
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Work Details</h2>
            <p className="text-sm text-gray-500 mt-1">{order.gig.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Client</p>
              <p className="text-gray-700 font-medium">{order.client.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Plan</p>
              <p className="text-gray-700 font-medium">{order.plan}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Price</p>
              <p className="text-gray-700 font-medium">₹{order.gig.pricing.basic.price}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Status</p>
              <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* VIEW MODE - Start Work */}
        {step === 'view' && order.status === 'ACCEPTED' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                Click the button below to start working on this order. Once started, you can submit delivery when the work is complete.
              </p>
            </div>

            <button
              onClick={handleStartWork}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>Starting Work...
                </>
              ) : (
                <>
                  <Play size={20} /> Start Work
                </>
              )}
            </button>
          </div>
        )}

        {/* VIEW MODE - Submit Delivery */}
        {step === 'view' && order.status === 'IN_PROGRESS' && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-900">
                Your work is in progress. Submit your delivery files and notes when ready.
              </p>
            </div>

            <button
              onClick={() => setStep('deliver')}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Submit Delivery
            </button>
          </div>
        )}

        {/* DELIVER MODE - File Upload */}
        {step === 'deliver' && order.status === 'IN_PROGRESS' && (
          <div className="space-y-4">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-input"
                accept="*"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload size={32} className="text-gray-400" />
                <p className="text-sm font-semibold text-gray-700">
                  Click to upload files or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  (Images, videos, documents, etc.)
                </p>
              </label>
            </div>

            {/* Uploaded Files List */}
            {deliveryFiles.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Uploaded Files ({deliveryFiles.length})
                </p>
                <div className="space-y-2">
                  {deliveryFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200"
                    >
                      <p className="text-sm text-gray-700 truncate">{file.name}</p>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Delivery Notes
              </label>
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Add notes about your delivery, what's included, how to use, etc..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('view')}
                disabled={isLoading}
                className="flex-1 bg-gray-400 hover:bg-blue-500 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={handleSubmitDelivery}
                disabled={isLoading || deliveryFiles.length === 0 || !deliveryNotes.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Submit Delivery
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}