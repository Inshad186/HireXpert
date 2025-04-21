import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white px-4 py-4">
      <div className="container flex items-center justify-center">
        <Link to={"/"} className="text-2xl font-medium text-">HireXpert</Link>
      </div>
    </nav>
  )
}

export default Navbar
