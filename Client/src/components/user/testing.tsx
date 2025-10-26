import React from 'react'

function TestingComp() {
  return (
    <div className='flex flex-col items-center justify-center h-[80vh] space-y-4 text-center h-'>
      <h1 className='text-green-600 font-bold text-3xl'>🎉 Order Placed Successfully!</h1>
      <p className=' text-gray-600'>Your order has been placed. The freelancer will review and accept it soon</p>
      <button className='bg-blue-600 p-2 px-6 text-white rounded-md'>View My Orders</button>
    </div>
  )
}

export default TestingComp
