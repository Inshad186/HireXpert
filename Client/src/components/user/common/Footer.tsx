import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faLinkedin, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white px-10 pt-20 pb-6 font-normal">
      <div className="grid grid-cols-1 gap-6 pb-8 border-b border-gray-300 md:grid-cols-5">
        <div>
          <h1 className="text-5xl font-K2D font-semibold text-white mb-4">HireXpert</h1>
          <div className="flex ml-2 space-x-4 text-xl">
            <FontAwesomeIcon icon={faLinkedin} className="hover:text-[#191c1b] cursor-pointer" />
            <FontAwesomeIcon icon={faYoutube} className="hover:text-[#191c1b] cursor-pointer" />
            <FontAwesomeIcon icon={faInstagram} className="hover:text-[#191c1b] cursor-pointer" />
            <FontAwesomeIcon icon={faFacebook} className="hover:text-[#191c1b] cursor-pointer" />
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-semibold">CATEGORIES</h2>
          <ul className="space-y-1 text-sm">
            <li>Design</li>
            <li>Video, Photo & Image</li>
            <li>Digital Marketing</li>
            <li>Social Media</li>
            <li>Writing & Translation</li>
            <li>Technology & Programming</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-semibold">ABOUT</h2>
          <ul className="space-y-1 text-sm">
            <li>About us</li>
            <li>Career</li>
            <li>Blogs</li>
            <li>FAQ's</li>
            <li>Contact us</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-semibold">SERVICES</h2>
          <ul className="space-y-1 text-sm">
            <li>Services</li>
            <li>Projects</li>
            <li>Jobs</li>
            <li>Freelancers</li>
            <li>Employers</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-semibold">SUPPORT</h2>
          <ul className="mb-4 space-y-1 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
            <li>Help Center</li>
            <li>Updates</li>
            <li>Documentation</li>
          </ul>
        </div>
      </div>

      <div className="pt-3 text-sm text-center text-gray-400">
        © 2025 HireXpert. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;