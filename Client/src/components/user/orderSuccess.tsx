import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Order Placed Successfully!
      </h1>
      <p className="text-gray-600 mb-6">
        Your order has been placed. The freelancer will review and accept it soon.
      </p>
      <Link
        to="/orders"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        View My Orders
      </Link>
    </div>
  );
}

export default OrderSuccess;
