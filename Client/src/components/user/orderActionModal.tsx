import { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Order } from '@/hooks/useOrderTracking';

interface OrderActionModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (orderId: string) => Promise<{ success: boolean; message: string }>;
  onReject: (orderId: string, reason: string) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
}

export function OrderActionModal({ order, isOpen, onClose, onAccept, onReject, isLoading }: OrderActionModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleAccept = async () => {
    setError(null);
    setSuccess(null);
    const result = await onAccept(order._id);
    
    if (result.success) {
      setSuccess('Order accepted successfully!');
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    setError(null);
    setSuccess(null);
    const result = await onReject(order._id, rejectReason);
    console.log("Rejection Result✅ : ",result)
    if (result.success) {
      setSuccess('Order rejected successfully!');
      setTimeout(() => {
        onClose();
        setSuccess(null);
        setRejectReason('');
        setShowRejectForm(false);
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "PENDING" : return 'bg-yellow-100 text-yellow-800'
      case "ACCEPTED" : return 'bg-lime-100 text-lime-800'
      case "IN_PROGRESS" : return 'bg-blue-100 text-blue-800'
      case "COMPLETED" : return 'bg-green-100 text-green-800'
      case "CANCELLED" : return 'bg-red-100 text-red-800'
      default : return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg- bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">New Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
          <div className='border-b border-slate-700 pb-4'>
            <p className="text-xs text-gray-500 font-semibold uppercase">Gig Title</p>
            <p className="text-lg font-semibold text-gray-800">{order.gig.title}</p>
          </div>

          <div className='border-b border-slate-700 pb-4'>
            <p className="text-xs text-gray-500 font-semibold uppercase">Client Name</p>
            <p className="text-gray-700">{order.client.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className='border-b border-slate-700 pb-4'>
              <p className="text-xs text-gray-500 font-semibold uppercase">Plan</p>
              <p className="text-gray-700 font-medium">{order.plan}</p>
            </div>
            <div className='border-b border-slate-700 pb-4'>
              <p className="text-xs text-gray-500 font-semibold uppercase">Price</p>
              <p className="text-green-700 font-bold ">₹{order.gig.pricing.basic.price}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Status</p>
            <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Rejection Form */}
        {showRejectForm ? (
          <div className="mb-6 bg-red-50 rounded-lg p-4 border border-red-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Rejection
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Tell the client why you're rejecting this order..."
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-600 mt-2">
              The client will see this reason
            </p>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Accept Button */}
          <button
            onClick={handleAccept}
            disabled={isLoading || showRejectForm}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Accepting...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Accept Order
              </>
            )}
          </button>

          {/* Reject Button / Back Button */}
          {showRejectForm ? (
            <button
              onClick={() => setShowRejectForm(false)}
              disabled={isLoading}
              className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
            >
              Back
            </button>
          ) : (
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <XCircle size={20} />
              Reject
            </button>
          )}
        </div>

        {/* Confirm Reject Button */}
        {showRejectForm && (
          <button
            onClick={handleReject}
            disabled={isLoading || !rejectReason.trim()}
            className="w-full mt-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Rejecting...
              </>
            ) : (
              <>
                <XCircle size={20} />
                Confirm Rejection
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}