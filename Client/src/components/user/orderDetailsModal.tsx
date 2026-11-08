import { MessageSquare } from 'lucide-react';
import { OrderDetail } from '@/types/user.type';
import { orderStatusLabel, orderStatusStyle } from '@/utils/orderStatus';

interface Props {
  order: OrderDetail;
  onClose: () => void;
  onMessage: () => void;
}

export function OrderDetailsModal({ order, onClose, onMessage }: Props) {
  const amount = order.paymentDetails?.amount ?? order.gig?.pricing?.basic?.price;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{order.gig?.title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700 text-3xl font-light">×</button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b">
          <div>
            <p className="text-gray-600 text-sm">Order ID</p>
            <p className="text-lg font-semibold">#{String(order._id).slice(-6).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Freelancer</p>
            <p className="text-lg font-semibold">{order.freelancer?.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Amount paid</p>
            <p className="text-xl font-bold text-green-600">{amount !== undefined ? `$${amount}` : '—'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${orderStatusStyle(order.status)}`}>
              {orderStatusLabel(order.status)}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-2">Requirements</p>
          <p className="text-gray-800 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{order.requirements}</p>
        </div>

        <div className="flex gap-4">
          <button onClick={onMessage} className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium">
            <MessageSquare className="w-4 h-4" /> Message Freelancer
          </button>
          <button onClick={onClose} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}