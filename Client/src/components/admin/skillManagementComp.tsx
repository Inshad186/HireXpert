import { getSkills } from '@/api/admin.api'
import React, {useEffect, useState} from 'react'
import toast from 'react-hot-toast'

function SkillManagementComp() {

  const [skills, setSkills] = useState<{ _id: string, name: string }[]>([])
  const [newSkill, setNewSkill] = useState("")


  useEffect(() => {
    fetchSkills()
  }, [])

const fetchSkills = async () => {
  const response = await getSkills();

  if (response.success) {
    const uniqueSkills = response.data.skills || [];

    const formattedSkills = uniqueSkills.map((skill: string, index: number) => ({
      _id: String(index),
      name: skill,
    }));

    setSkills(formattedSkills);
  } else {
    toast.error(response.error);
  }
};



  return (
    <div className='p-6 text-white '>
      <h1 className='text-left text-2xl font-bold mb-6'>Skills Management</h1>

      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Search"
            className="p-2 border border-gray-300 rounded-l-md w-64 text-black"
          />
          <button className="bg-black text-white px-4 py-2 rounded-r-md">Search</button>
        </div>
        <button className="text-black bg-gray-400 px-4 py-2 rounded-md ml-auto">Add +</button>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full table-auto border-collapse'>
          <thead>
            <tr className='bg-black text-left'>
              <th className='p-3'>Id</th>
              <th className='p-3'>Skills</th>
              <th className='p-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill,index) => (
              <tr key={skill._id} className="border-b border-gray-700">
                <td className='p-3'>{index + 1}</td>
                <td className='p-3'>{skill.name}</td>
                <td className='p-3'>
                  <button className='bg-gray-300 text-black px-3 py-1 rounded mr-2'>Edit</button>
                  <button className='bg-red-700 px-3 py-1 rounded'>Delete</button>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr>
                <td colSpan={2} className="p-4 text-center text-gray-400">No skills found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SkillManagementComp
