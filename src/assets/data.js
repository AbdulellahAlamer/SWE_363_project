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

 const AttendedEvents = [
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
export default AttendedEvents;

export const profileJoinedClubs = [
  { id: "membership-001", name: "Computer Club" },
  { id: "membership-004", name: "ISE Club" },
  { id: "membership-009", name: "ME Club" },
  { id: "membership-013", name: "Gamers Club" },
  { id: "membership-017", name: "Petroleum Eng. Club" },
];
export const certificates = [
  {
    id: 1,
    year: "2023",
    title: "AI Bootcamp Completion",
    issuer: "Computer Club",
    date: "Mar 20",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23dbeafe' width='600' height='400'/%3E%3Crect x='20' y='20' width='560' height='360' fill='none' stroke='%233b82f6' stroke-width='4'/%3E%3Ctext x='300' y='80' font-size='32' font-weight='bold' fill='%231e40af' text-anchor='middle'%3EAI Bootcamp Completion%3C/text%3E%3Ctext x='300' y='150' font-size='18' fill='%232563eb' text-anchor='middle'%3EComputer Club%3C/text%3E%3Ctext x='300' y='220' font-size='16' fill='%235b21b6' text-anchor='middle'%3EAwarded on March 20, 2023%3C/text%3E%3Ctext x='300' y='280' font-size='14' fill='%23475569' text-anchor='middle'%3EThis certificate recognizes successful completion%3C/text%3E%3Ctext x='300' y='310' font-size='14' fill='%23475569' text-anchor='middle'%3Eof the intensive AI Bootcamp program%3C/text%3E%3C/svg%3E",
  },
  {
    id: 2,
    year: "2022",
    title: "Leadership Lab Facilitator",
    issuer: "ISE Club",
    date: "Nov 18",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23fce7f3' width='600' height='400'/%3E%3Crect x='20' y='20' width='560' height='360' fill='none' stroke='%23ec4899' stroke-width='4'/%3E%3Ctext x='300' y='80' font-size='32' font-weight='bold' fill='%23831843' text-anchor='middle'%3ELeadership Lab Facilitator%3C/text%3E%3Ctext x='300' y='150' font-size='18' fill='%23be185d' text-anchor='middle'%3EISE Club%3C/text%3E%3Ctext x='300' y='220' font-size='16' fill='%235b21b6' text-anchor='middle'%3EAwarded on November 18, 2022%3C/text%3E%3Ctext x='300' y='280' font-size='14' fill='%23475569' text-anchor='middle'%3EFor outstanding leadership and facilitation%3C/text%3E%3Ctext x='300' y='310' font-size='14' fill='%23475569' text-anchor='middle'%3Ein the Leadership Lab program%3C/text%3E%3C/svg%3E",
  },
  {
    id: 3,
    year: "2021",
    title: "Volunteer Excellence Award",
    issuer: "Student Affairs",
    date: "May 04", 
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23fef3c7' width='600' height='400'/%3E%3Crect x='20' y='20' width='560' height='360' fill='none' stroke='%23f59e0b' stroke-width='4'/%3E%3Ctext x='300' y='80' font-size='32' font-weight='bold' fill='%23b45309' text-anchor='middle'%3EVolunteer Excellence Award%3C/text%3E%3Ctext x='300' y='150' font-size='18' fill='%23d97706' text-anchor='middle'%3EStudent Affairs%3C/text%3E%3Ctext x='300' y='220' font-size='16' fill='%235b21b6' text-anchor='middle'%3EAwarded on May 04, 2021%3C/text%3E%3Ctext x='300' y='280' font-size='14' fill='%23475569' text-anchor='middle'%3EFor exceptional volunteer contributions%3C/text%3E%3Ctext x='300' y='310' font-size='14' fill='%23475569' text-anchor='middle'%3Eand community service%3C/text%3E%3C/svg%3E",
  },
];
