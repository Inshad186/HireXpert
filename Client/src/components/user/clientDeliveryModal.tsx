import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Star, Download } from 'lucide-react';
import { OrderDetail } from '@/types/user.type';

interface ClientDeliveryModalProps {
  order: OrderDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (orderId: string, feedback: string, rating: number) => Promise<{ success: boolean; message: string }>;
  onRequestRevision: (orderId: string, revisionReason: string, revisionCount: number ) => Promise<{ success: boolean; message: string }>
  isLoading: boolean;
}

export function ClientDeliveryModal({ order, isOpen, onClose, onAccept, onRequestRevision,  isLoading }: ClientDeliveryModalProps) {
  const [step, setStep] = useState<'view' | 'accept' | 'revision'>('view');
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [revisionReason, setRevisionReason] = useState('')
  const [revisionCount, setRevisionCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleAcceptDelivery = async () => {
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }
    if (!feedback.trim()) {
      setError('Please provide feedback');
      return;
    }
    setError(null);
    setSuccess(null);

    const result = await onAccept(order?._id as string, feedback, rating);
    console.log("Result from Cleint Delivery Modal🦑🦑 :",result)
    if (result.success) {
      setSuccess('Order completed! Thank you for your feedback.');
      setTimeout(() => {
        onClose();
        setSuccess(null);
        setRating(0);
        setFeedback('');
        setStep('view');
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  const currentRequestRevision = order.revisionsRequested || 0
  
  const handleRequestRevision = async () => {
    if (!revisionReason.trim()) {
      setError('Please provide a reason for revision');
      return;
    }

    if(currentRequestRevision >= 2){
      setError('Maximum revisions (2) reached')
      return;
    }

    const newRevisionCount = currentRequestRevision + 1
    setError(null);
    setSuccess(null);

    const result = await onRequestRevision(order._id as string, revisionReason, newRevisionCount);

    if (result.success) {
      setSuccess('Revision requested! Freelancer will re-submit the work.');
      setTimeout(() => {
        onClose();
        setRevisionCount(newRevisionCount)
        setSuccess(null);
        setRevisionReason('');
        setStep('view');
      }, 2000);
    } else {
      setError(result.message);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Review Delivery</h2>
            <p className="text-lg font-normal bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 mt-1 pl-4 pr-4 ">{order.gig?.title}</p>
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
              <p className="text-xs text-gray-500 font-semibold uppercase">Freelancer</p>
              <p className="text-gray-800 font-medium">{order.freelancer?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Amount Paid</p>
              <p className="text-gray-800 font-medium">₹{order.gig?.pricing?.basic?.price}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Plan</p>
              <p className="text-gray-800 font-medium">{order.plan}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Status</p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                DELIVERED
              </span>
            </div>
          </div>
        </div>

        {/* VIEW MODE - Show Delivery Files */}
        {step === 'view' && (
          <div className="space-y-6">
            {/* Delivery Files */}
            {order.deliveryFiles && order.deliveryFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Delivery Files</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {order.deliveryFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <span className="text-sm text-gray-700">{file}</span>
                      <a
                        href={file}
                        download
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Notes */}
            {order.deliveryNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Delivery Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{order.deliveryNotes}</p>
                </div>
              </div>
            )}

            {/* Revision Count Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                ℹ️ You can request up to <strong>2 revisions</strong>
                {currentRequestRevision > 0 && (
                  <span className='ml-1'>({currentRequestRevision} used)</span>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('revision')}
                disabled={isLoading}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Request Revision
              </button>
              <button
                onClick={() => setStep('accept')}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                <CheckCircle size={20} />
                Accept Delivery
              </button>
            </div>
          </div>
        )}

        {/* ACCEPT MODE - Rating & Feedback */}
        {step === 'accept' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                ✓ Great! Please rate the freelancer and provide your feedback.
              </p>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rate the Work
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-lg transition-all ${
                      rating >= star
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Star size={28} fill={rating >= star ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  You rated this work {rating} out of 5 stars
                </p>
              )}
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about the work quality, professionalism, and overall experience..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">This feedback will be visible to the freelancer</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('view')}
                disabled={isLoading}
                className="flex-1 bg-gray-400 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={handleAcceptDelivery}
                disabled={isLoading || rating === 0 || !feedback.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Complete Order
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {/* REVISION MODE - Request Revision */}
        {step === 'revision' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                ⚠️ Describe what changes you'd like the freelancer to make.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Revision
              </label>
              <textarea
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                placeholder="Explain what needs to be changed or improved. Be specific so the freelancer understands exactly what you want..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm resize-none"
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-900">
                💡 <strong>Tip:</strong> The freelancer can submit up to 2 revisions. Be clear about your requirements.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('view')}
                disabled={isLoading}
                className="flex-1 bg-gray-400 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={handleRequestRevision}
                disabled={isLoading || !revisionReason.trim()}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Requesting...
                  </>
                ) : (
                  'Request Revision'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}