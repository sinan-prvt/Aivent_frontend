import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVendorStatus } from "../api/vendor.api";
import {
  Clock,
  Shield,
  FileCheck,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Home,
  ExternalLink,
  Users,
  BarChart
} from "lucide-react";

export default function VendorPending() {
  const navigate = useNavigate();
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [timeSinceApply, setTimeSinceApply] = useState("a few moments");
  const [nextCheck, setNextCheck] = useState(5); // minutes until next auto-check

  // Simulate time elapsed since application
  useEffect(() => {
    const applyTime = sessionStorage.getItem("apply_time");
    if (!applyTime) {
      sessionStorage.setItem("apply_time", new Date().toISOString());
    }

    const updateTimeDisplay = () => {
      const storedTime = sessionStorage.getItem("apply_time");
      if (storedTime) {
        const applyDate = new Date(storedTime);
        const now = new Date();
        const diffMs = now - applyDate;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) {
          setTimeSinceApply("a few moments");
        } else if (diffMins < 60) {
          setTimeSinceApply(`${diffMins} minute${diffMins !== 1 ? 's' : ''}`);
        } else {
          const hours = Math.floor(diffMins / 60);
          setTimeSinceApply(`${hours} hour${hours !== 1 ? 's' : ''}`);
        }
      }
    };

    updateTimeDisplay();
    const interval = setInterval(updateTimeDisplay, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-check status every 5 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      if (nextCheck > 0) {
        setNextCheck(prev => prev - 1);
      } else {
        handleCheckStatus();
        setNextCheck(5);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [nextCheck]);

  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    try {
      // Note: Backend doesn't have a /status/ endpoint yet
      // This is a placeholder for when the endpoint is implemented
      // For now, vendors need to wait for email notification
      const response = await getVendorStatus();
      const status = response?.data?.status;
      if (status === "approved") {
        navigate("/vendor/dashboard");
      } else {
        alert("Your application is still pending approval. You'll receive an email once it's approved.");
      }
    } catch (error) {
      console.error("Error checking status:", error);
      // Endpoint doesn't exist yet, so show a helpful message
      alert("Status check endpoint is not yet available. Please wait for an email notification when your application is approved.");
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleLogout = () => {
    // Clear session data
    sessionStorage.removeItem("vendor_id");
    sessionStorage.removeItem("vendor_email");
    sessionStorage.removeItem("apply_time");
    navigate("/");
  };

  const pendingSteps = [
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Document Verification",
      description: "Our team is reviewing your business documents and information.",
      status: "in-progress"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Background Check",
      description: "Standard security verification for all new vendors.",
      status: "pending"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Final Approval",
      description: "Account activation and dashboard access.",
      status: "pending"
    }
  ];

  const whatToExpect = [
    {
      icon: <Clock className="w-5 h-5" />,
      text: "Typical review time: 24-48 hours"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      text: "You'll receive an email notification once approved"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      text: "We may contact you for additional information"
    }
  ];

  const prepareForLaunch = [
    {
      title: "Set Up Your Store",
      description: "Prepare your product catalog and store information",
      icon: <Home className="w-5 h-5" />
    },
    {
      title: "Understand Policies",
      description: "Review vendor terms, fees, and shipping guidelines",
      icon: <FileCheck className="w-5 h-5" />
    },
    {
      title: "Plan Your Launch",
      description: "Consider promotions for your store opening",
      icon: <BarChart className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Vendor Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Your gateway to our marketplace</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                <div className="mb-6 md:mb-0">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="w-10 h-10 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Approval Pending
                      </h2>
                      <p className="text-gray-600">
                        Your business application is under admin review
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
                        <Clock className="w-4 h-4 mr-2" />
                        Submitted {timeSinceApply} ago
                      </span>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="space-y-6">
                    {pendingSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          step.status === "in-progress" 
                            ? "bg-blue-100 text-blue-600" 
                            : step.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">
                              {step.title}
                            </h3>
                            {step.status === "in-progress" && (
                              <span className="text-sm text-blue-600 font-medium">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-200">
                    <button
                      onClick={handleCheckStatus}
                      disabled={checkingStatus}
                      className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {checkingStatus ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Checking Status...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Check Status Now
                        </>
                      )}
                    </button>
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-gray-500">
                        Auto-check in {nextCheck} minute{nextCheck !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                What to Expect Next
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {whatToExpect.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <div className="text-blue-600">
                        {item.icon}
                      </div>
                    </div>
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Status Overview */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Application Status
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Application ID</span>
                  <span className="font-mono text-sm font-semibold text-gray-900">
                    #{sessionStorage.getItem("vendor_id")?.slice(-8) || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Submitted</span>
                  <span className="font-semibold text-gray-900">{timeSinceApply} ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estimated Time</span>
                  <span className="font-semibold text-amber-600">24-48 hours</span>
                </div>
                <div className="pt-6 border-t border-blue-200">
                  <div className="text-center">
                    <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm">
                      <span className="text-sm font-semibold text-blue-600">
                        Under Review
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prepare for Launch */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Prepare for Launch
              </h3>
              <div className="space-y-4">
                {prepareForLaunch.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
                          {item.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <p className="text-gray-300 mb-6">
                Our vendor support team is here to assist you.
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:vendorsupport@example.com"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>vendorsupport@example.com</span>
                </a>
                <a
                  href="tel:+18005551234"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>1-800-555-1234</span>
                </a>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Support hours: Mon-Fri, 9AM-6PM EST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  How long does approval take?
                </h4>
                <p className="text-gray-600">
                  Most applications are reviewed within 24-48 hours. Complex cases or applications submitted on weekends may take longer.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Will I be notified when approved?
                </h4>
                <p className="text-gray-600">
                  Yes, you'll receive an email notification with login instructions once your application is approved.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Can I edit my application?
                </h4>
                <p className="text-gray-600">
                  Once submitted, applications cannot be edited. If you need to make changes, please contact vendor support.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  What happens after approval?
                </h4>
                <p className="text-gray-600">
                  You'll gain access to your vendor dashboard where you can set up your store, add products, and configure payment methods.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            This page will automatically update when your application status changes.
            You can also refresh manually using the "Check Status Now" button.
          </p>
        </div>
      </div>
    </div>
  );
}