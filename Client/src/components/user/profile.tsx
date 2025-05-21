import { FaMapMarkerAlt, FaUser, FaLanguage } from "react-icons/fa";
import { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import DefaultImage from "../../assets/userProfile.png"
import { changeProfile, editUserName, getProfileImage } from "@/api/user.api";
import { setUser } from "@/redux/slices/userSlice";
import { UserStoreType } from "@/types/user.type";

function Profile() {

    const user = useSelector((state:RootState) => state.user)

    const [fetchUser, setFetchUser] = useState<UserStoreType>({} as UserStoreType)
    const [profileImage, setProfileImage] = useState("")
    const [isEditingName, setIsEditingName] = useState(false)
    const [isName, setIsName] = useState(user.name)
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch()

    useEffect(() => {
      const getProfile = async() => {
        try {
          const response = await getProfileImage()
          console.log("Get profile Image Response : ",response)
          if(response.success){
            setProfileImage(response.data.user.profilePicture)
            setFetchUser(response.data.user)
          }
        } catch (error) {
          
        }
      }
      getProfile()
    },[])

    const handleProfileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    if (files.length > 1) {
      alert("Please select only one image")
      return;
    }
    const file = files[0];

    const formData = new FormData()
    formData.append("profileImage",file)
    formData.append("userId",user._id)

    try {
      const response = await changeProfile(formData)
      console.log("RESPONSSE  >>>>>>>>>>>>>>>> : ",response)
      if (response.success) {
      const imageUrl = response.data.user.profilePicture; 
      setProfileImage(imageUrl); 
      setFetchUser(response.data.user)
    }
    } catch (err) {
      console.error(err)
    }
  }

  const handleNameUpdate = async() => {
    if(isEditingName && isName){
      const response = await editUserName(isName)
      console.log("New Edited Name > : ",response.data.newName)
      dispatch(setUser({ name: isName }))
    }else{
      setError(error)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md rounded-md shadow p-6 border border-gray-300">
        <div className="flex flex-col items-center relative">
          <div className="relative w-32 h-32 mb-2">
            <img
              src={profileImage || DefaultImage}
              alt={"User"}
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
            />
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .webp"
              style={{ display: "none" }}
              id="fileInput"
              onChange={handleProfileChange}
            />
            <button
              className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Update
            </button>
          </div>

          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                value={isName}
                onChange={(e) => setIsName(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
              />
              <button
                onClick={handleNameUpdate}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Save
              </button>
            </div>
          ) : (
            <h2
              className="text-xl font-semibold flex items-center gap-1 cursor-pointer"
              onClick={() => setIsEditingName(true)}
            >
              {user.name} <span className="text-sm">✏️</span>
            </h2>
          )}

          <p className="text-gray-600">{user.email}</p>
        </div>

        <hr className="my-4" />

        {/* Info Section */}
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <FaUser className="text-gray-500" />
            <span>Joined in {user.createdAt?.toString()}</span>
          </div>
          <hr />
          <div className="flex items-center gap-2">
            <FaLanguage className="text-gray-500" />
            <span>English (Conversational)</span>
          </div>
        </div>

        <hr className="my-4" />

        {/* Review Section */}
        <div>
          <h3 className="font-semibold mb-3">Reviews from Freelancers</h3>
          <div className="border rounded-md p-4 flex flex-col items-center text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2107/2107957.png"
              alt="Star Review"
              className="w-20 mb-2"
            />
            <p className="text-gray-500 text-sm">
              {user.name} doesn't have any reviews yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
