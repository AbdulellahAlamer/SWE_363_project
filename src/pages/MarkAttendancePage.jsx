import { useEffect, useState } from "react";
import { request } from "../api/client.js";

export default function MarkAttendancePage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [eventInfo, setEventInfo] = useState(null);

  useEffect(() => {
    const markAttendance = async () => {
      try {
        // Get URL parameters using vanilla JavaScript
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get("eventId");

        if (!eventId) {
          setStatus("error");
          setMessage("Invalid QR code: Event ID missing");
          return;
        }

        // Check if user is logged in
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          setStatus("error");
          setMessage("Please log in first to mark attendance");
          return;
        }

        // Make attendance request to backend route
        const data = await request(
          `/events/mark-attendance?eventId=${eventId}`
        );

        setStatus("success");
        setMessage("Attendance marked successfully!");
        setEventInfo(data?.data || data);
        window.location.href = "/my-profile";
      } catch (error) {
        setStatus("error");
        setMessage("Error marking attendance: " + error.message);
      }
    };

    markAttendance();
  }, []);

  const handleGoBack = () => {
    window.location.href = "/events";
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#f5f7fe] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Marking Attendance...
            </h2>
            <p className="text-slate-600">
              Please wait while we process your attendance.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Attendance Marked!
            </h2>
            <p className="text-slate-600 mb-4">{message}</p>
            {eventInfo && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="font-medium text-blue-900">
                  {eventInfo.eventTitle}
                </p>
                <p className="text-sm text-blue-700">
                  Total Attendees: {eventInfo.attendanceCount}
                </p>
              </div>
            )}
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Attendance Failed
            </h2>
            <p className="text-slate-600 mb-4">{message}</p>
          </>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleGoBack}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            View Events
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-300"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
