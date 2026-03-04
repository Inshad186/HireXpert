import React from 'react'
import { Clock, ClipboardCheck, Truck, CheckCircle, XCircle, X } from 'lucide-react';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    title: string;
    client: string;
    amount: number;
    status: string;
    requirements: string;
}

function OrderModal ({
    isOpen,
    onClose,
    orderId,
    title,
    client,
    amount,
    status,
    requirements
}: OrderModalProps) {

  const getStatusColor = (status: string = '') => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string = '') => {
    switch(status) {
      case 'PENDING': return <Clock size={18} />;
      case 'ACCEPTED': return <ClipboardCheck size={18} />;
      case 'IN_PROGRESS': return <Clock size={18} />;
      case 'DELIVERED': return <Truck size={18} />;
      case 'COMPLETED': return <CheckCircle size={18} />;
      case 'CANCELLED': return <XCircle size={18} />;
      default: return null;
    }
  };

  if(!isOpen) return null

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between mb-6'>
            <h1 className='text-3xl font-bold text-gray-800'>{title}</h1>
            <button
            className=' hover:text-red-600 text-2xl'
            onClick={() => onClose()}>
            <X size={24} className="text-gray-600 hover:text-red-600" />
            </button>
        </div>
        <div className='grid grid-cols-2 gap-6 mb-6 pb-6 border-b'>
            <div>
                <p className='text-gray-700 font-normal'>Order id</p>
                <p className='text-lg font-medium'>{orderId}</p>
            </div>
            <div>
                <p className='text-gray-700 font-normal '>Client</p>
                <p className='text-lg font-medium'>{client}</p>
            </div>
            <div>
                <p className='text-gray-700 font-normal'>Amount</p>
                <p className='text-lg font-medium text-green-600'>₹{amount}</p>
            </div>
            <div>
                <p className='text-gray-700 text-sm font-normal'>Status</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    {status}</span>
            </div>
        </div>
        <div className="mb-4">
        <p className="text-gray-600 text-sm mb-2">Requirements</p>
        <p className="text-gray-800 bg-gray-100 p-4 rounded-lg">{requirements}</p>
        </div>
      </div>
    </div>
  )
}

export default OrderModal
