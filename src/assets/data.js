// these data will make the life esasier because it is like the server responess

export const adminStatistics = [
  { label: "Total Clubs", value: "24" },
  { label: "Upcoming Events", value: "156" },
  { label: "Event Attendance", value: "1,234" },
  { label: "New Registrations", value: "18" },
];

export const sampleEvents = [
  {
    id: "evt-001",
    type: "Workshop",
    date: "2024-05-22T14:00:00+03:00",
    title: "Intro to Robotics",
    description:
      "Hands-on session building autonomous robots with Arduino and ROS.",
    host: "Computer Club",
    hostId: "club-cs",
    location: "Innovation Lab 2.104",
    capacity: 60,
    registered: 42,
    status: "open",
  },
  {
    id: "evt-002",
    type: "Hackathon",
    date: "2024-06-15T09:00:00+03:00",
    title: "Hack the Future",
    description:
      "24-hour hackathon focused on AI-powered sustainability solutions.",
    host: "Computer Club",
    hostId: "club-cs",
    location: "Auditorium A",
    capacity: 120,
    registered: 98,
    status: "open",
  },
  {
    id: "evt-003",
    type: "Sprint",
    date: "2024-04-04T10:00:00+03:00",
    title: "UX Design Sprint",
    description:
      "Collaborative sprint to reimagine the KFUPM campus services app.",
    host: "Design Society",
    hostId: "club-design",
    location: "Design Studio",
    capacity: 40,
    registered: 40,
    status: "closed",
  },
  {
    id: "evt-004",
    type: "Seminar",
    date: "2024-04-12T17:30:00+03:00",
    title: "Cybersecurity 101",
    description:
      "Industry experts share the latest in threat detection and prevention.",
    host: "Information Security Club",
    hostId: "club-infosec",
    location: "Auditorium C",
    capacity: 200,
    registered: 173,
    status: "closed",
  },
];

export const adminClubSeeds = [
  {
    id: "club-cs",
    initials: "CS",
    name: "Computer Club",
    category: "Technology & Innovation",
    president: "Saeed Al-Qahtani",
    members: 860,
    updated: "Updated 2d ago",
    updatedAt: "2024-03-13T15:45:00+03:00",
    status: "active",
    contactEmail: "csclub@kfupm.edu.sa",
  },
  {
    id: "club-ie",
    initials: "IE",
    name: "Industrial Engineering Society",
    category: "Engineering",
    president: "Vacant",
    members: 320,
    updated: "Updated 1w ago",
    updatedAt: "2024-03-08T11:20:00+03:00",
    status: "awaiting-president",
    contactEmail: "ie.society@kfupm.edu.sa",
  },
  {
    id: "club-me",
    initials: "ME",
    name: "Mechanical Engineers",
    category: "Engineering",
    president: "Sara Al-Otaibi",
    members: 540,
    updated: "Updated 3d ago",
    updatedAt: "2024-03-12T09:05:00+03:00",
    status: "active",
    contactEmail: "me.club@kfupm.edu.sa",
  },
];

export const loginUsers = [
  { id: "user-admin-1", email: "admin@gmail.com", password: "12345678" },
  {
    id: "user-president-1",
    email: "clubPresident@gmail.com",
    password: "12345678",
  },
  { id: "user-student-1", email: "student@gmail.com", password: "12345678" },
];

export const profileAttendedEvents = [
  {
    id: "evt-004",
    title: "Cybersecurity 101",
    date: "2024-02-10T15:00:00+03:00",
    club: "Computer Club",
  },
  {
    id: "evt-009",
    title: "Data Science Meetup",
    date: "2024-01-28T18:30:00+03:00",
    club: "Computer Club",
  },
  {
    id: "evt-011",
    title: "Leadership Lab",
    date: "2023-12-12T16:00:00+03:00",
    club: "ISE Club",
  },
  {
    id: "evt-014",
    title: "Formula Student Showcase",
    date: "2023-11-30T13:00:00+03:00",
    club: "ME Club",
  },
];

export const profileJoinedClubs = [
  { id: "membership-001", name: "Computer Club" },
  { id: "membership-004", name: "ISE Club" },
  { id: "membership-009", name: "ME Club" },
  { id: "membership-013", name: "Gamers Club" },
  { id: "membership-017", name: "Petroleum Eng. Club" },
];

export const profileCertificates = [
  {
    id: "cert-2023-01",
    year: "2023",
    title: "AI Bootcamp Completion",
    issuer: "Computer Club",
    date: "2023-03-20",
    link: "/api/certificates/cert-2023-01/download",
  },
  {
    id: "cert-2022-04",
    year: "2022",
    title: "Leadership Lab Facilitator",
    issuer: "ISE Club",
    date: "2022-11-18",
    link: "/api/certificates/cert-2022-04/download",
  },
  {
    id: "cert-2021-07",
    year: "2021",
    title: "Volunteer Excellence Award",
    issuer: "Student Affairs",
    date: "2021-05-04",
    link: "/api/certificates/cert-2021-07/download",
  },
];
