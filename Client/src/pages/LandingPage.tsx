import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"


function LandingPage() {
  const navigate = useNavigate()
  return (
    <div>
      <h1 className="text-red-700 text-3xl">This is my LandingPage</h1>
      <div className="flex gap-4">
      <Button onClick={() => navigate("/login")}>Login</Button>
      <Button onClick={() => navigate("/signUp")}>SignUp</Button>
      </div>
    </div>
  )
}

export default LandingPage
