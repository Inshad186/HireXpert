import { addSkills, editSkills, getCategories, getSkills } from '@/api/admin.api'
import React, {useEffect, useState} from 'react'
import toast from 'react-hot-toast'

function SkillManagementComp() {

  const [skills, setSkills] = useState<{ _id: string, name: string, category: string }[]>([])
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [showCategory, setShowCategory] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editedSkillName, setEditedSkillName] = useState("");
  const [skillsGrouped, setSkillsGrouped] = useState<{ [category: string]: { _id: string, name: string }[] }>({});

  

  useEffect(() => {
    fetchSkills()
    fetchCategories()
  }, [])

const fetchSkills = async () => {
  const response = await getSkills();
  if (response.success) {
    setSkillsGrouped(response.data.skills);
  } else {
    toast.error(response.error);
  }
};


const fetchCategories = async () => {
  try {
    const response = await getCategories();
    console.log("Get Categories >> : ",response.data)
    if (response.success) {
      setCategories(response.data.categories); // Assuming response returns { categories: [...] }
    } else {
      toast.error(response.error || "Failed to fetch categories");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    toast.error("An unexpected error occurred");
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
        <div className='flex space-x-4 ml-auto'>
          <button 
          onClick={() => {
            setShowCategory(true)
          }}
          className='text-black bg-gray-400 px-4 py-2 rounded-md '>Category +</button>
          <button 
          onClick={() => {
            setShowAddModal(true)
          }}
          className="text-black bg-gray-400 px-4 py-2 rounded-md ">Add +</button>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full table-auto border-collapse'>
          <thead>
            <tr className='bg-black text-left'>
              <th className='p-3'>Id</th>
              <th className='p-3'>Categories</th>
              <th className='p-3'>Skills</th>
              <th className='p-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
  {Object.entries(skillsGrouped).map(([category, skills], index) => (
    <tr key={category} className="border-b border-gray-700">
      <td className='p-3'>{index + 1}</td>
      <td className='p-3'>{category}</td>
      <td className='p-3'>
        {skills.map(skill => skill.name).join(', ')}
      </td>
      <td className='p-3'>
        {/* Optional: Add edit/delete for category or skills */}
        <button className='bg-gray-300 text-black px-3 py-1 rounded mr-2'>Edit</button>
        <button className='bg-red-700 px-3 py-1 rounded'>Delete</button>
      </td>
    </tr>
  ))}
  {Object.keys(skillsGrouped).length === 0 && (
    <tr>
      <td colSpan={4} className="p-4 text-center text-gray-400">No skills found</td>
    </tr>
  )}
</tbody>

        </table>

        {/* {Add new Category} */}

        {showCategory && (
          <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50'>
            <div className='bg-white text-black rounded-lg w-96 p-6'>
              <h2 className='text-xl font-bold text-black text-center mb-4'>Add New Category</h2>
              <input
              value={newCategory} 
              placeholder='Enter new Category'
              onChange={(e) => setNewCategory(e.target.value)}
              className='text-black w-full border p-2 mb-4'/>
              <div className='flex justify-end space-x-4'>
              <button className='text-white bg-green-600 rounded px-4 py-2'>Save</button>
              <button 
              onClick={() => {
                setShowCategory(false)
              }}
              className='text-white bg-gray-400 rounded px-4 py-2'>Cancel</button>
            </div>
            </div>
          </div>
        )}

        {/* {Add new Skill Modal } */}

        {showAddModal && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg p-6 w-96'>
              <h2 className="text-xl font-bold mb-4 text-black text-center">Add New Skill</h2>
              <input 
              className='w-full border p-2 mb-4 text-black'
              placeholder='Enter new skill' 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}/>
              <div className='flex justify-end space-x-3'>
                <button 
                onClick = {async() => {
                  if(!newSkill.trim()) return toast.error("Skill name cannot be empty")
                    const response = await addSkills(newSkill.trim())

                  if(response.success){
                    toast.success("Skill added Successfully")
                    setShowAddModal(false)
                    setNewSkill("")
                    fetchSkills()
                  }else{
                    toast.error(response.error || "Failed to add skill")
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
                <button
                onClick={() => {
                  setShowAddModal(false)
                }} 
                className='bg-gray-400 text-white rounded py-2 px-4'>Cancel</button>
              </div>
            </div>
          </div>
        )}


        {/* {Edit Skill Modal } */}

        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-bold mb-4 text-black">Edit Skill</h2>
              <input
                className="w-full border p-2 mb-4 rounded text-black"
                value={editedSkillName}
                onChange={(e) => setEditedSkillName(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={async () => {
                    if (!editedSkillName.trim()) return toast.error("Skill name cannot be empty");
                      const skillIndex = parseInt(editingSkillId!); 
                      const oldName = skills[skillIndex].name;
                    const res = await editSkills(oldName, editedSkillName);
                    if (res.success) {
                      toast.success("Skill updated");
                      fetchSkills();
                      setShowEditModal(false);
                      setEditingSkillId(null);
                    } else {
                      toast.error(res.error);
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSkillId(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default SkillManagementComp
