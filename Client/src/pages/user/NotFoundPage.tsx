import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-[120px] font-extrabold text-gray-800 leading-none">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist or was moved.  
        Please check the URL or return to the homepage.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-gray-800 hover:bg-black text-white rounded-lg font-medium transition-all duration-200"
      >
        Go Home
      </button>
    </div>
  );
}

export default NotFoundPage;
