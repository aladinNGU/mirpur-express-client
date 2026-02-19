import { Link, useLocation, useNavigate } from "react-router";
import { ShieldAlert } from "lucide-react";

const Forbidden = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center bg-base-200 px-6">
      <div className="max-w-md w-full bg-base-100 shadow-xl rounded-2xl p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-error/10 p-4 rounded-full">
            <ShieldAlert size={40} className="text-error" />
          </div>
        </div>

        {/* 403 Title */}
        <h1 className="text-5xl font-bold text-error mb-2">403</h1>

        {/* Message */}
        <h2 className="text-xl font-semibold mb-2">Access Forbidden</h2>

        <p className="text-base-content/70 mb-6">
          You do not have permission to access this page. If you believe this is
          a mistake, please contact your administrator.
        </p>

        {/* Show attempted path (optional) */}
        {location.state?.from && (
          <p className="text-sm text-base-content/50 mb-4">
            Attempted URL: {location.state.from}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleGoBack} className="btn btn-outline">
            Go Back
          </button>

          <Link to="/" className="btn btn-primary text-black">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
