import React, { useState, useEffect } from 'react'
import { getGigList, updateGigStatus } from '@/api/freelancer.api'

// Full Me

interface GigList {
  _id: string
  title: string
  category: string
  deliveryTime: number
  isActive: boolean
}

function ListedGigsComp() {
  const [list, setList] = useState<GigList[]>([])

  useEffect(() => {
    const gigList = async () => {
      const response = await getGigList()
      console.log("Gig List Response : ",response)
      if (response.success) {
        setList(response.data.gigDetails)
      }
    }
    gigList()
  }, [])

  // handle toggle switch
  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      // call backend API to update
      const response = await updateGigStatus(id, !currentStatus)
      if (response.success) {
        // update UI state immediately
        setList((prev) =>
          prev.map((gig) =>
            gig._id === id ? { ...gig, isActive: !currentStatus } : gig
          )
        )
      }
    } catch (error) {
      console.error('Error updating gig status:', error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold bg-black text-white py-3 rounded-lg shadow-md">
        Gig List
      </h1>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white text-left">
              <th className="p-3">#</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Delivery Time</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((value, index) => (
              <tr
                key={value._id}
                className="border-t border-gray-200 even:bg-gray-50 hover:bg-gray-300 transition"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{value.title || '—'}</td>
                <td className="p-3">{value.category || '—'}</td>
                <td className="p-3">{value.deliveryTime} days</td>
                <td className="p-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={value.isActive}
                      onChange={() => handleToggle(value._id, value.isActive)}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListedGigsComp
