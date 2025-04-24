import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-tl from-black to-white shadow-md py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold text-gray tracking-wide">
          HireXpert
        </Link>
        <div className="flex gap-4 ">
          <Link
            to="/signup"
            className="bg-black text-white text-lg font-semibold px-6 py-2 rounded-xl"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-black text-white text-lg font-semibold px-6 py-2 rounded-xl"
          >
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
