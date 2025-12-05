import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import NavigationBar from "../components/NavigationBar.jsx";
import Button from "../components/Button.jsx";
import SectionCard from "../components/SectionCard.jsx";
import PostCard from "../components/PostCard.jsx";
import PopupForm from "../components/PopupForm.jsx";
import { fetchEvents } from "../api/events.js";
// import { isObjectId } from "../api/clubs.js";

export default function PresidentPage() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  const qrRef = useRef(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [clubsError, setClubsError] = useState(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setEventsLoading(true);
        const data = await fetchEvents();
        setEvents(data);
        setEventsLoading(false);
      } catch (err) {
        console.log(err, clubsError);
        setEventsError("Failed to load events.");
        setEventsLoading(false);
      }
    };

    const loadClubs = async () => {
      try {
        setClubsLoading(true);
        const { fetchClubs } = await import("../api/clubs.js");
        const { fetchCurrentUser } = await import("../api/users.js");

        // Get current user info
        const currentUser = await fetchCurrentUser();

        // Get all clubs and filter for ones where current user is president
        const clubsData = await fetchClubs();

        const myPresidentialClubs = clubsData.filter((club) => {
          // Check if the current user is the president of this club
          return (
            club.raw.president &&
            (club.raw.president._id === currentUser.id ||
              club.raw.president === currentUser.id ||
              (typeof club.raw.president === "object" &&
                club.raw.president._id === currentUser.raw._id))
          );
        });

        setClubs(myPresidentialClubs);
        setClubsLoading(false);

        // Load posts after clubs are loaded
        if (myPresidentialClubs.length > 0) {
          loadPosts(myPresidentialClubs);
        } else {
          setPostsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load clubs:", err);
        setClubsError("Failed to load clubs.");
        setClubsLoading(false);
        setPostsLoading(false);
      }
    };

    const loadPosts = async (clubsArray) => {
      try {
        console.log("[DEBUG] Loading posts - clubsArray:", clubsArray);
        setPostsLoading(true);
        const { fetchPosts } = await import("../api/posts.js");
        const postsData = await fetchPosts();
        console.log("[DEBUG] Raw posts data from API:", postsData);

        // Log each post's ID structure
        postsData.forEach((post, index) => {
          console.log(`[DEBUG] Post ${index}:`, {
            id: post.id,
            _id: post._id,
            rawId: post.raw?._id,
            title: post.title,
            fullPost: post,
          });
        });

        // Filter posts for the president's club if available
        if (clubsArray && clubsArray.length > 0) {
          console.log("[DEBUG] Filtering posts for club ID:", clubsArray[0].id);
          const clubPosts = postsData.filter((post) => {
            const match =
              post.club === clubsArray[0].id ||
              post.clubId === clubsArray[0].id;
            console.log(
              `[DEBUG] Post ${post.title} - club: ${post.club}, clubId: ${post.clubId}, matches: ${match}`
            );
            return match;
          });
          console.log("[DEBUG] Filtered club posts:", clubPosts);
          setPosts(clubPosts);
        } else {
          console.log("[DEBUG] No club filtering, setting all posts");
          setPosts(postsData);
        }

        setPostsLoading(false);
      } catch (err) {
        console.error("[DEBUG] Failed to load posts:", err);
        setPostsError("Failed to load posts.");
        setPostsLoading(false);
      }
    };

    loadEvents();
    loadClubs();
  }, []);

  // Copy QR value as link (or text)
  const handleCopyLink = () => {
    if (qrValue) {
      navigator.clipboard.writeText(qrValue);
    }
  };

  // Download QR code as image
  const handleDownloadQR = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector("svg");
      if (!svg) return;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const canvas = document.createElement("canvas");
      const img = new window.Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngFile;
        downloadLink.download = "qr-code.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src =
        "data:image/svg+xml;base64," +
        window.btoa(unescape(encodeURIComponent(svgString)));
    }
  };

  // Post edit handler
  const handlePostEdit = (post) => {
    setEditingPost(post);
  };

  // Post delete handler
  const handlePostDelete = async (postId) => {
    console.log("[DEBUG] === POST DELETE START ===");
    console.log("[DEBUG] Received postId:", postId, typeof postId);
    console.log("[DEBUG] Current posts state:", posts);

    const postToDelete = posts.find((p) => {
      const currentId = p.raw?._id || p.id || p._id;
      console.log(
        `[DEBUG] Checking post ${p.title}: currentId=${currentId}, matches=${
          currentId === postId
        }`
      );
      return currentId === postId;
    });

    console.log("[DEBUG] Found post to delete:", postToDelete);

    if (!postToDelete) {
      console.log("[DEBUG] ERROR: Post not found in current state!");
      alert("Post not found in current state. Please refresh the page.");
      return;
    }

    if (confirm("Are you sure you want to delete this post?")) {
      try {
        console.log("[DEBUG] User confirmed deletion");
        console.log("[DEBUG] Attempting to delete post with ID:", postId);
        const { request } = await import("../api/client.js");

        // First, let's try to fetch the post to see if it exists
        console.log("[DEBUG] Checking if post exists in database...");
        try {
          const checkResponse = await request(`/posts/${postId}`);
          console.log("[DEBUG] Post exists in database:", checkResponse);
        } catch (checkError) {
          console.log("[DEBUG] Post doesn't exist in database:", checkError);
          console.log("[DEBUG] Removing from frontend state anyway");
          setPosts((prevPosts) => {
            const filtered = prevPosts.filter((post) => {
              const currentPostId = post.raw?._id || post.id || post._id;
              return currentPostId !== postId;
            });
            console.log("[DEBUG] New posts state after removal:", filtered);
            return filtered;
          });
          alert("Post was already deleted or doesn't exist in database.");
          return;
        }

        console.log("[DEBUG] Making DELETE request to /posts/" + postId);
        const response = await request(`/posts/${postId}`, {
          method: "DELETE",
        });
        console.log("[DEBUG] Delete response:", response);

        console.log("[DEBUG] Updating posts state - removing deleted post");
        setPosts((prevPosts) => {
          const filtered = prevPosts.filter((post) => {
            const currentPostId = post.raw?._id || post.id || post._id;
            const shouldKeep = currentPostId !== postId;
            console.log(
              `[DEBUG] Post ${post.title}: currentId=${currentPostId}, shouldKeep=${shouldKeep}`
            );
            return shouldKeep;
          });
          console.log(
            "[DEBUG] New posts state after successful deletion:",
            filtered
          );
          return filtered;
        });

        console.log("[DEBUG] Post deleted successfully!");
      } catch (error) {
        console.error("[DEBUG] Failed to delete post - full error:", error);
        console.error("[DEBUG] Error message:", error.message);
        console.error("[DEBUG] Error stack:", error.stack);
        alert(`Failed to delete post: ${error.message}. Please try again.`);
      }
    } else {
      console.log("[DEBUG] User cancelled deletion");
    }
    console.log("[DEBUG] === POST DELETE END ===");
  };

  // Close post editor
  const closePostEditor = () => {
    setEditingPost(null);
  };

  // Event edit handler
  const handleEventEdit = (event) => {
    setEditingEvent(event);
  };

  // Event delete handler
  const handleEventDelete = async (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const { request } = await import("../api/client.js");
        await request(`/events/${eventId}`, { method: "DELETE" });
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
      } catch (error) {
        console.error("Failed to delete event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  // Close event editor
  const closeEventEditor = () => {
    setEditingEvent(null);
  };

  // Handle email notification
  const handleNotifyByEmail = async (event) => {
    if (
      confirm(
        `Send email notification to all registered students for "${event.title}"?`
      )
    ) {
      try {
        const { request } = await import("../api/client.js");
        const response = await request(`/events/${event.id}/notify`, {
          method: "POST",
          body: JSON.stringify({}),
        });

        // Show success message with details
        const results = response.results || [];
        const successCount = results.filter((r) => r.status === "sent").length;
        const failCount = results.filter((r) => r.status === "failed").length;

        if (failCount > 0) {
          // Check for specific error types
          const limitErrors = results.filter(
            (r) =>
              r.error?.includes("trial account") || r.error?.includes("limit")
          );

          if (limitErrors.length > 0) {
            alert(
              `Email service trial limit reached. Found ${results.length} registered student(s) but emails cannot be sent due to MailerSend trial account limits. Upgrade the email service to send notifications.`
            );
          } else {
            alert(
              `Notifications sent: ${successCount} successful, ${failCount} failed. Check console for details.`
            );
          }
          console.log("Email notification results:", results);
        } else {
          alert(
            `Successfully sent email notifications to ${successCount} registered students!`
          );
        }
      } catch (error) {
        console.error("Failed to send email notifications:", error);
        alert("Failed to send email notifications. Please try again.");
      }
    }
  };

  // Determine president's club from fetched clubs
  const presidentClub = clubs.length > 0 ? clubs[0] : null;
  // Fallback stats if needed
  // const stats = presidentClub
  //   ? Object.entries(presidentClub.stats || {}).map(([label, value]) => ({
  //       label,
  //       value,
  //     }))
  //   : [];

  return (
    <div className="min-h-screen bg-[#f5f7fe]">
      <NavigationBar active="/president" type="president" />
      <main className="px-4 md:px-8 py-6 max-w-[1600px] mx-auto ml-0 md:ml-64 pt-16 md:pt-6">
        {/* Club Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-[#e9f0ff] rounded-2xl shadow p-6 lg:p-8 mb-8 gap-6">
          <div className="flex items-center gap-4 sm:gap-6 w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-200 flex items-center justify-center text-2xl sm:text-3xl font-bold text-blue-700">
              {presidentClub ? presidentClub.initials : "?"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                {presidentClub ? presidentClub.name : "No club found"}
              </h1>
              <div className="text-slate-500 text-sm sm:text-base lg:text-lg">
                President Dashboard
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
            <Button
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-base"
              onClick={() => setShowEventForm(true)}
            >
              Create Event
            </Button>
            <Button
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-base"
              onClick={() => setShowCreatePostForm(true)}
            >
              Create Post
            </Button>
          </div>
        </div>

        {/* Event Creation Popup */}
        {showEventForm && presidentClub && presidentClub.id && (
          <PopupForm
            method="POST"
            submitLabel="Create Event"
            fields={[
              {
                name: "title",
                label: "Title",
                dataType: "string",
                placeholder: "Event Title",
              },
              {
                name: "description",
                label: "Description",
                dataType: "text",
                placeholder: "Describe the event",
              },
              {
                name: "date",
                label: "Date",
                dataType: "date",
                placeholder: "Event Date",
              },
              {
                name: "type",
                label: "Event Type",
                dataType: "select",
                options: [
                  { value: "", label: "Select Event Type" },
                  { value: "Workshop", label: "Workshop" },
                  { value: "Hackathon", label: "Hackathon" },
                  { value: "Seminar", label: "Seminar" },
                  { value: "Competition", label: "Competition" },
                  { value: "Meetup", label: "Meetup" },
                  { value: "Other", label: "Other" },
                ],
              },
              {
                name: "image",
                label: "Event Image",
                dataType: "file",
                placeholder: "Upload event image",
                optional: true,
              },
              { name: "club", label: "Club", dataType: "hidden" },
            ]}
            initialValues={{ club: presidentClub.id }}
            onClose={() => setShowEventForm(false)}
            endpoint="/events"
          />
        )}
        {showEventForm && (!presidentClub || !presidentClub.id) && (
          <div className="p-4 text-red-600">
            {clubsLoading
              ? "Loading club data..."
              : "No club found for president. Cannot create event."}
          </div>
        )}

        {/* Post Creation Popup */}
        {showCreatePostForm && presidentClub && presidentClub.id && (
          <PopupForm
            method="POST"
            submitLabel="Create Post"
            fields={[
              {
                name: "title",
                label: "Title",
                dataType: "string",
                placeholder: "Post Title",
              },
              {
                name: "description",
                label: "Body",
                dataType: "textarea",
                placeholder: "Write your post content here...",
              },
              {
                name: "tag",
                label: "Tag",
                dataType: "select",
                options: [
                  { value: "ANNOUNCEMENT", label: "Announcement" },
                  { value: "RESOURCES", label: "Resources" },
                  { value: "EVENT", label: "Event" },
                  { value: "NEWS", label: "News" },
                  { value: "GENERAL", label: "General" },
                ],
              },
              {
                name: "image",
                label: "Post Image",
                dataType: "file",
                placeholder: "Upload post image",
                optional: true,
              },
              { name: "club", label: "Club", dataType: "hidden" },
            ]}
            initialValues={{ club: presidentClub.id }}
            onClose={() => setShowCreatePostForm(false)}
            endpoint="/posts"
          />
        )}
        {showCreatePostForm && (!presidentClub || !presidentClub.id) && (
          <div className="p-4 text-red-600">
            {clubsLoading
              ? "Loading club data..."
              : "No club found for president. Cannot create post."}
          </div>
        )}

        {/* Attendance Check-In */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900">
            Attendance Check-In
          </h2>
          <a
            href="#"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Generate a QR for live scans
          </a>
          <SectionCard className="flex gap-8 items-center">
            <div className="flex-1">
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Select Event</div>
                <select
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  <option value="">Select an event</option>
                  {events.length === 0 ? (
                    <option value="" disabled>
                      {eventsLoading ? "Loading events..." : "No events found"}
                    </option>
                  ) : (
                    events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} @{" "}
                        {ev.date
                          ? new Date(ev.date).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "TBA"}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <Button
                className="w-full bg-blue-600 text-white"
                onClick={() => {
                  if (!selectedEvent) {
                    alert("Please select an event first");
                    return;
                  }
                  const event = events.find((ev) => ev.id === selectedEvent);
                  if (event) {
                    // Create a URL that will trigger attendance marking when scanned
                    const attendanceUrl = `${window.location.origin}/mark-attendance?eventId=${event.id}`;
                    setQrValue(attendanceUrl);
                    setQrGenerated(true);
                  }
                }}
              >
                Generate QR
              </Button>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-40 h-40 flex items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-[#f5f7fe] mb-2"
                ref={qrRef}
              >
                {qrGenerated && qrValue ? (
                  <QRCode
                    value={qrValue}
                    size={140}
                    style={{ width: 140, height: 140 }}
                  />
                ) : (
                  <span className="text-2xl text-blue-400 font-bold">QR</span>
                )}
              </div>
              <div className="text-xs text-slate-500 text-center mb-2">
                Display this code at the venue. Students can scan using the
                KFUPM Clubs app to check in.
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-600"
                  disabled={!qrGenerated}
                  onClick={handleDownloadQR}
                >
                  Download QR
                </Button>
                <Button
                  variant="ghost"
                  className="text-blue-600"
                  disabled={!qrGenerated}
                  onClick={handleCopyLink}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Manage Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Manage Events
          </h2>
          {eventsError && (
            <p className="text-sm text-red-600 mb-3">{eventsError}</p>
          )}
          {eventsLoading ? (
            <p className="text-sm text-slate-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-slate-500">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className="flex flex-col bg-white rounded-2xl shadow p-6"
                >
                  {ev.imageData || ev.imageURL ? (
                    <img
                      src={ev.imageData || ev.imageURL}
                      alt={ev.title}
                      className="h-24 rounded-xl mb-4 w-full object-cover"
                    />
                  ) : (
                    <div className="h-24 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 mb-4" />
                  )}
                  {editingId === ev.id ? (
                    <>
                      <input
                        className="text-lg font-semibold text-slate-900 mb-2 border rounded p-1"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, title: e.target.value }))
                        }
                      />
                      <textarea
                        className="text-slate-500 text-sm mb-2 border rounded p-1"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-semibold text-slate-900 mb-1">
                        {ev.title}
                      </div>
                      <div className="text-slate-500 text-sm mb-2">
                        {ev.description}
                      </div>
                    </>
                  )}
                  <div className="text-xs text-slate-400 mb-2">
                    {ev.date
                      ? new Date(ev.date).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Date TBA"}{" "}
                    - {ev.registered || 0} registered
                  </div>
                  <div className="flex gap-2 mb-2">
                    {editingId === ev.id ? (
                      <>
                        <Button
                          variant="secondary"
                          className="w-1/2"
                          onClick={() => {
                            setEvents((prev) =>
                              prev.map((e) =>
                                e.id === ev.id ? { ...e, ...editForm } : e
                              )
                            );
                            setEditingId(null);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          className="w-1/2 text-gray-600 border-gray-200"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          className="w-1/3"
                          onClick={() => handleEventEdit(ev)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="w-1/3 text-red-600 border-red-200"
                          onClick={() => handleEventDelete(ev.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          className="w-1/3 text-blue-600 border-blue-200"
                          onClick={() => setViewingRegistrations(ev)}
                        >
                          Registrations
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full border border-blue-200 text-blue-600"
                    onClick={() => handleNotifyByEmail(ev)}
                  >
                    Notify By email
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manage Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Manage Posts
          </h2>
          {postsError && (
            <p className="text-sm text-red-600 mb-3">{postsError}</p>
          )}
          {postsLoading ? (
            <p className="text-sm text-slate-500">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-slate-500">No posts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  type="president"
                  onEdit={handlePostEdit}
                  onDelete={handlePostDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      {/* Post Edit Popup */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <header className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Edit Post
              </h2>
              <button
                type="button"
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                onClick={closePostEditor}
                aria-label="Close popup form"
              >
                ✕
              </button>
            </header>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                try {
                  const deleteImage = formData.get("deleteImage") === "on";
                  const newImageFile = formData.get("image");
                  const hasNewFile = newImageFile && newImageFile.size > 0;

                  console.log("[Edit Post] Delete image checked:", deleteImage);
                  console.log("[Edit Post] Has new file:", hasNewFile);

                  let response;

                  if (hasNewFile) {
                    // New image upload takes priority
                    const submitFormData = new FormData();

                    // Add form fields
                    submitFormData.append("title", formData.get("title"));
                    submitFormData.append(
                      "description",
                      formData.get("description")
                    );
                    submitFormData.append("tag", formData.get("tag"));
                    submitFormData.append("image", newImageFile);

                    const token = localStorage.getItem("token");
                    const headers = {};
                    if (token) {
                      headers.Authorization = `Bearer ${token}`;
                    }

                    const res = await fetch(
                      `${
                        import.meta.env.VITE_API_BASE_URL ||
                        "http://localhost:3000/api/v1"
                      }/posts/${editingPost.id}`,
                      {
                        method: "PUT",
                        headers,
                        body: submitFormData,
                      }
                    );

                    if (!res.ok) {
                      throw new Error(
                        `Request failed with status ${res.status}`
                      );
                    }

                    response = await res.json();
                  } else if (deleteImage) {
                    // Delete image without uploading new one
                    const submitFormData = new FormData();

                    // Add form fields
                    submitFormData.append("title", formData.get("title"));
                    submitFormData.append(
                      "description",
                      formData.get("description")
                    );
                    submitFormData.append("tag", formData.get("tag"));
                    submitFormData.append("deleteImage", "true");

                    console.log("[Edit Post] Sending delete image request");

                    const token = localStorage.getItem("token");
                    const headers = {};
                    if (token) {
                      headers.Authorization = `Bearer ${token}`;
                    }

                    const res = await fetch(
                      `${
                        import.meta.env.VITE_API_BASE_URL ||
                        "http://localhost:3000/api/v1"
                      }/posts/${editingPost.id}`,
                      {
                        method: "PUT",
                        headers,
                        body: submitFormData,
                      }
                    );

                    if (!res.ok) {
                      throw new Error(
                        `Request failed with status ${res.status}`
                      );
                    }

                    response = await res.json();
                  } else {
                    // Use regular JSON for non-file updates
                    const { request } = await import("../api/client.js");
                    const updateData = {
                      title: formData.get("title"),
                      description: formData.get("description"),
                      tag: formData.get("tag"),
                    };

                    response = await request(`/posts/${editingPost.id}`, {
                      method: "PUT",
                      body: JSON.stringify(updateData),
                    });
                  }

                  console.log("[Edit Post] Response:", response);

                  // Update the post in the list
                  const updatedPost = response?.data || response;
                  console.log(
                    "[Edit Post] Updated post from backend:",
                    updatedPost
                  );

                  setPosts((prevPosts) => {
                    const newPosts = prevPosts.map((post) =>
                      post.id === editingPost.id
                        ? {
                            ...post,
                            ...updatedPost,
                            id: updatedPost._id || updatedPost.id || post.id,
                          }
                        : post
                    );
                    console.log("[Edit Post] Updated posts array:", newPosts);
                    return newPosts;
                  });

                  closePostEditor();
                } catch (error) {
                  console.error("Failed to update post:", error);
                  alert("Failed to update post. Please try again.");
                }
              }}
            >
              {/* Title Field */}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Title</span>
                <input
                  name="title"
                  type="text"
                  defaultValue={editingPost.title}
                  required
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </label>

              {/* Description Field */}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Body</span>
                <textarea
                  name="description"
                  defaultValue={editingPost.body}
                  rows={4}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 resize-vertical"
                />
              </label>

              {/* Tag Field */}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Tag</span>
                <select
                  name="tag"
                  defaultValue={editingPost.tag}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="RESOURCES">Resources</option>
                  <option value="EVENT">Event</option>
                  <option value="NEWS">News</option>
                  <option value="GENERAL">General</option>
                </select>
              </label>

              {/* Current Image Display */}
              {(editingPost.imageData || editingPost.imageUrl) && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Current Image
                  </span>
                  <div className="relative">
                    <img
                      src={editingPost.imageData || editingPost.imageUrl}
                      alt="Current post image"
                      className="h-32 w-full object-cover rounded-lg border border-slate-300"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      name="deleteImage"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-red-600">Delete current image</span>
                  </label>
                </div>
              )}

              {/* New Image Upload */}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Upload New Image (optional)</span>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Edit Popup */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <header className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Update Event
              </h2>
              <button
                type="button"
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                onClick={closeEventEditor}
                aria-label="Close popup form"
              >
                ✕
              </button>
            </header>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                try {
                  const deleteImage = formData.get("deleteImage") === "on";
                  const newImageFile = formData.get("image");
                  const hasNewFile = newImageFile && newImageFile.size > 0;

                  console.log(
                    "[Edit Event] Delete image checked:",
                    deleteImage
                  );
                  console.log("[Edit Event] Has new file:", hasNewFile);

                  let response;

                  if (hasNewFile) {
                    // New image upload takes priority
                    const submitFormData = new FormData();

                    // Add form fields
                    submitFormData.append("title", formData.get("title"));
                    submitFormData.append(
                      "description",
                      formData.get("description")
                    );
                    submitFormData.append("date", formData.get("date"));
                    submitFormData.append("type", formData.get("type"));
                    submitFormData.append("image", newImageFile);

                    const token = localStorage.getItem("token");
                    const headers = {};
                    if (token) {
                      headers.Authorization = `Bearer ${token}`;
                    }

                    const res = await fetch(
                      `${
                        import.meta.env.VITE_API_BASE_URL ||
                        "http://localhost:3000/api/v1"
                      }/events/${editingEvent.id}`,
                      {
                        method: "PUT",
                        headers,
                        body: submitFormData,
                      }
                    );

                    if (!res.ok) {
                      throw new Error(
                        `Request failed with status ${res.status}`
                      );
                    }

                    response = await res.json();
                  } else if (deleteImage) {
                    // Delete image without uploading new one
                    const submitFormData = new FormData();

                    // Add form fields
                    submitFormData.append("title", formData.get("title"));
                    submitFormData.append(
                      "description",
                      formData.get("description")
                    );
                    submitFormData.append("date", formData.get("date"));
                    submitFormData.append("type", formData.get("type"));
                    submitFormData.append("deleteImage", "true");

                    console.log("[Edit Event] Sending delete image request");

                    const token = localStorage.getItem("token");
                    const headers = {};
                    if (token) {
                      headers.Authorization = `Bearer ${token}`;
                    }

                    const res = await fetch(
                      `${
                        import.meta.env.VITE_API_BASE_URL ||
                        "http://localhost:3000/api/v1"
                      }/events/${editingEvent.id}`,
                      {
                        method: "PUT",
                        headers,
                        body: submitFormData,
                      }
                    );

                    if (!res.ok) {
                      throw new Error(
                        `Request failed with status ${res.status}`
                      );
                    }

                    response = await res.json();
                  } else {
                    // Use regular JSON for non-file updates
                    const { request } = await import("../api/client.js");
                    const updateData = {
                      title: formData.get("title"),
                      description: formData.get("description"),
                      date: formData.get("date"),
                      type: formData.get("type"),
                    };

                    response = await request(`/events/${editingEvent.id}`, {
                      method: "PUT",
                      body: JSON.stringify(updateData),
                    });
                  }

                  console.log("[Edit Event] Response:", response);

                  // Update the event in the list
                  const updatedEvent = response?.data || response;
                  console.log(
                    "[Edit Event] Updated event from backend:",
                    updatedEvent
                  );
                  console.log(
                    "[Edit Event] Updated imageData:",
                    updatedEvent.imageData
                  );

                  setEvents((prevEvents) => {
                    const newEvents = prevEvents.map((event) =>
                      event.id === editingEvent.id
                        ? {
                            ...event,
                            ...updatedEvent,
                            id: updatedEvent._id || updatedEvent.id || event.id,
                          }
                        : event
                    );
                    console.log(
                      "[Edit Event] Updated events array:",
                      newEvents
                    );
                    return newEvents;
                  });

                  closeEventEditor();
                } catch (error) {
                  console.error("Failed to update event:", error);
                  alert("Failed to update event. Please try again.");
                }
              }}
            >
              {/* Title Field */}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Title</span>
                <input
                  name="title"
                  type="text"
                  defaultValue={editingEvent.title}
                  required
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </label>

              {/* Description Field */}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Description</span>
                <textarea
                  name="description"
                  defaultValue={editingEvent.description}
                  rows={3}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 resize-vertical"
                />
              </label>

              {/* Date Field */}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Date</span>
                <input
                  name="date"
                  type="date"
                  defaultValue={
                    editingEvent.date
                      ? new Date(editingEvent.date).toISOString().split("T")[0]
                      : ""
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </label>

              {/* Type Field */}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Type</span>
                <select
                  name="type"
                  defaultValue={editingEvent.type || ""}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Competition">Competition</option>
                  <option value="Meetup">Meetup</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              {/* Current Image Display */}
              {(editingEvent.imageData || editingEvent.imageURL) && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Current Image
                  </span>
                  <div className="relative">
                    <img
                      src={editingEvent.imageData || editingEvent.imageURL}
                      alt="Current event image"
                      className="h-32 w-full object-cover rounded-lg border border-slate-300"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      name="deleteImage"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-red-600">Delete current image</span>
                  </label>
                </div>
              )}

              {/* New Image Upload */}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Upload New Image (optional)</span>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Registrations Popup */}
      {viewingRegistrations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Registrations for "{viewingRegistrations.title}"
              </h3>
              <button
                onClick={() => setViewingRegistrations(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Total Registrations: {viewingRegistrations.registered || 0}
              </p>
            </div>

            {viewingRegistrations.raw?.registrations &&
            viewingRegistrations.raw.registrations.length > 0 ? (
              <div className="space-y-2">
                {viewingRegistrations.raw.registrations.map((user, index) => (
                  <div
                    key={user._id || index}
                    className="flex items-center p-2 border rounded"
                  >
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {(user.name || user.email || `User ${index + 1}`)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {user.name || "Name not available"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.email || "Email not available"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No registrations yet.</p>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setViewingRegistrations(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
