"use client"

import { useMemo, useState } from "react"

/**
 * Alumni Management Platform - Single File SPA Prototype
 * - SPA navigation via activePage state (no routing library)
 * - Components logically grouped in this single file
 * - Static mock data arrays defined here
 * - Separate useState hooks for each filter, useMemo for derived filteredAlumni
 * - Single modal state object: { isOpen, data, type }
 *
 * Design/system notes:
 * - Uses Tailwind with semantic design tokens (bg-background, text-foreground, etc.)
 * - Accessible structure: semantic elements, alt text, roles, labels
 * - Mobile-first layout, responsive enhancements
 */

/* =========================
   Mock Data (Static Only)
   ========================= */

// Common placeholder avatar using the v0 placeholder generator
const AVATAR_PLACEHOLDER = "/alumni-avatar.jpg"

// A small pool of sample skills to mix and match
const skillsPool = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Data Science",
  "UI/UX",
  "Go",
  "Cloud",
  "Product",
  "Security",
  "DevOps",
  "ML",
]

function pickSkills(...names) {
  return names
}

// Alumni: id, name, graduationYear, major, company, position, location, avatarUrl, skills[], bio, isMentor
const mockAlumni = [
  {
    id: "a1",
    name: "Alex Carter",
    graduationYear: 2016,
    major: "Computer Science",
    company: "Acme Corp",
    position: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("React", "TypeScript", "UI/UX"),
    bio: "Frontend engineer passionate about crafting accessible and performant web apps.",
    isMentor: true,
  },
  {
    id: "a2",
    name: "Bianca Nguyen",
    graduationYear: 2018,
    major: "Data Science",
    company: "Insight Labs",
    position: "Data Scientist",
    location: "New York, NY",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("Python", "Data Science", "ML"),
    bio: "Data scientist focusing on applied machine learning and analytics.",
    isMentor: false,
  },
  {
    id: "a3",
    name: "Carlos Ramirez",
    graduationYear: 2014,
    major: "Information Systems",
    company: "CloudNest",
    position: "DevOps Engineer",
    location: "Austin, TX",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("DevOps", "Cloud", "Security"),
    bio: "DevOps engineer enabling reliable, scalable systems on cloud platforms.",
    isMentor: true,
  },
  {
    id: "a4",
    name: "Diana Lee",
    graduationYear: 2020,
    major: "Human-Computer Interaction",
    company: "Pixelware",
    position: "Product Designer",
    location: "Seattle, WA",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("UI/UX", "Product"),
    bio: "Designing intuitive experiences and thoughtful interfaces.",
    isMentor: false,
  },
  {
    id: "a5",
    name: "Ethan Patel",
    graduationYear: 2015,
    major: "Software Engineering",
    company: "FinEdge",
    position: "Backend Engineer",
    location: "Chicago, IL",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("Node.js", "Go", "Security"),
    bio: "Backend specialist building secure and maintainable APIs.",
    isMentor: true,
  },
  {
    id: "a6",
    name: "Farah Khan",
    graduationYear: 2019,
    major: "Computer Science",
    company: "NeuroNet",
    position: "ML Engineer",
    location: "Boston, MA",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("Python", "ML", "Data Science"),
    bio: "ML engineer turning data into intelligent products.",
    isMentor: false,
  },
  {
    id: "a7",
    name: "George Smith",
    graduationYear: 2013,
    major: "Cybersecurity",
    company: "ShieldOps",
    position: "Security Architect",
    location: "Remote",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("Security", "Cloud"),
    bio: "Architecting secure systems and leading incident response.",
    isMentor: true,
  },
  {
    id: "a8",
    name: "Hannah Williams",
    graduationYear: 2017,
    major: "Computer Science",
    company: "NextWave",
    position: "Full-stack Engineer",
    location: "Denver, CO",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("React", "Node.js", "TypeScript"),
    bio: "Full-stack builder focused on product velocity and code quality.",
    isMentor: false,
  },
  {
    id: "a9",
    name: "Ivan Petrov",
    graduationYear: 2012,
    major: "Software Engineering",
    company: "EdgeAI",
    position: "Staff Engineer",
    location: "Los Angeles, CA",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("Go", "Cloud", "DevOps"),
    bio: "Staff engineer tackling complex distributed systems problems.",
    isMentor: true,
  },
  {
    id: "a10",
    name: "Jasmine Brown",
    graduationYear: 2021,
    major: "Information Systems",
    company: "HubWorks",
    position: "Business Analyst",
    location: "Atlanta, GA",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("Product", "Data Science"),
    bio: "Analyst bridging business goals with technological solutions.",
    isMentor: false,
  },
  {
    id: "a11",
    name: "Kenji Sato",
    graduationYear: 2016,
    major: "Computer Science",
    company: "ByteForge",
    position: "Mobile Engineer",
    location: "San Diego, CA",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("React", "UI/UX"),
    bio: "Mobile-first developer delivering smooth app experiences.",
    isMentor: false,
  },
  {
    id: "a12",
    name: "Lina García",
    graduationYear: 2015,
    major: "Human-Computer Interaction",
    company: "Vista",
    position: "Design Manager",
    location: "Miami, FL",
    avatarUrl: AVATAR_PLACEHOLDER,
    skills: pickSkills("UI/UX", "Product"),
    bio: "Leading cross-functional design teams to ship impactful products.",
    isMentor: true,
  },
]

// Copy one alumnus as the logged-in user
const loggedInUser = { ...mockAlumni[0] }

// Events
const mockEvents = [
  {
    id: "e1",
    title: "Alumni Networking Night",
    date: "2025-10-15",
    location: "San Francisco, CA",
    description: "Connect with fellow alumni and current students across tech disciplines.",
  },
  {
    id: "e2",
    title: "Tech Talk: AI in Production",
    date: "2025-11-02",
    location: "New York, NY",
    description: "Panel discussion on deploying ML systems reliably at scale.",
  },
  {
    id: "e3",
    title: "Career Workshop: Portfolio Review",
    date: "2025-11-20",
    location: "Online",
    description: "Get feedback on your portfolio from alumni mentors.",
  },
]

// Jobs
const mockJobs = [
  {
    id: "j1",
    title: "Senior Frontend Engineer",
    company: "Acme Corp",
    location: "San Francisco, CA",
    type: "Full-time",
    postedAt: "2025-09-20",
    description:
      "Build and ship modern web applications using React and TypeScript. Strong focus on accessibility and performance.",
    requirements: ["5+ years experience", "React", "TypeScript", "Accessibility"],
    applyUrl: "#",
  },
  {
    id: "j2",
    title: "Data Scientist",
    company: "Insight Labs",
    location: "New York, NY",
    type: "Full-time",
    postedAt: "2025-09-24",
    description: "Leverage ML techniques to extract insights from large datasets, collaborate with product teams.",
    requirements: ["Python", "ML", "SQL", "Communication"],
    applyUrl: "#",
  },
  {
    id: "j3",
    title: "Security Engineer",
    company: "ShieldOps",
    location: "Remote",
    type: "Contract",
    postedAt: "2025-09-28",
    description: "Harden infrastructure, perform risk assessments, and guide incident response best practices.",
    requirements: ["Cloud Security", "Threat Modeling", "DevSecOps"],
    applyUrl: "#",
  },
]

// News
const mockNews = [
  {
    id: "n1",
    title: "Alumnus Raises Series B",
    summary: "EdgeAI secures $30M to expand edge inference platform.",
    date: "2025-09-10",
    link: "#",
  },
  {
    id: "n2",
    title: "University Ranked Top 10",
    summary: "Computer Science program recognized for excellence in AI research.",
    date: "2025-09-18",
    link: "#",
  },
  {
    id: "n3",
    title: "Mentorship Program Launch",
    summary: "New initiative connects seniors with alumni mentors across the world.",
    date: "2025-09-25",
    link: "#",
  },
]

/* =========================
   UI Building Blocks
   ========================= */

function Sidebar({ activePage, onNavigate }) {
  const links = [
    { key: "dashboard", label: "Dashboard" },
    { key: "directory", label: "Directory" },
    { key: "events", label: "Events" },
    { key: "profile", label: "Profile" },
  ]

  return (
    <aside className="w-full md:w-64 shrink-0 border-border border-r bg-card text-card-foreground" aria-label="Primary">
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-pretty">Alumni Platform</h1>
          <p className="text-sm text-muted-foreground">Welcome, {loggedInUser.name.split(" ")[0]}</p>
        </div>
        <nav>
          <ul className="flex md:flex-col gap-2 md:gap-1">
            {links.map((l) => {
              const isActive = l.key === activePage
              return (
                <li key={l.key}>
                  <button
                    type="button"
                    onClick={() => onNavigate(l.key)}
                    className={[
                      "w-full text-left px-3 py-2 rounded-md transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted hover:text-foreground text-foreground",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {l.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

function Header({ title, children }) {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-background">
      <h2 className="text-xl md:text-2xl font-semibold text-balance">{title}</h2>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  )
}

function AlumniCard({ alumnus, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(alumnus)}
      className="text-left rounded-lg border border-border bg-card p-4 hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={`Open details for ${alumnus.name}`}
    >
      <div className="flex items-center gap-4">
        <img
          src={alumnus.avatarUrl || "/placeholder.svg"}
          alt={`${alumnus.name} avatar`}
          className="h-16 w-16 rounded-full border border-border object-cover"
        />
        <div className="min-w-0">
          <p className="font-medium truncate">{alumnus.name}</p>
          <p className="text-sm text-muted-foreground">
            {alumnus.position} • {alumnus.company}
          </p>
          <p className="text-sm text-muted-foreground">
            {alumnus.major} • Class of {alumnus.graduationYear}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {alumnus.skills.slice(0, 3).map((s) => (
              <span key={s} className="text-xs rounded-md px-2 py-1 bg-muted text-muted-foreground">
                {s}
              </span>
            ))}
            {alumnus.isMentor && (
              <span className="text-xs rounded-md px-2 py-1 bg-primary/20 text-foreground">Mentor</span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

function JobCard({ job, onOpen }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold">{job.title}</h4>
          <p className="text-sm text-muted-foreground">
            {job.company} • {job.location} • {job.type}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">Posted {job.postedAt}</span>
      </div>
      <p className="mt-3 text-sm">{job.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {job.requirements.map((r) => (
          <span key={r} className="text-xs rounded-md px-2 py-1 bg-muted text-muted-foreground">
            {r}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <a
          href={job.applyUrl}
          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Apply
        </a>
        <button
          type="button"
          onClick={() => onOpen(job)}
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Details
        </button>
      </div>
    </div>
  )
}

function Modal({ isOpen, title, onClose, children }) {
  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full md:max-w-2xl rounded-t-xl md:rounded-xl bg-card text-card-foreground shadow-lg border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 id="modal-title" className="text-lg font-semibold text-pretty">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 hover:bg-muted"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
      <button
        type="button"
        className="fixed inset-0 -z-10 cursor-default"
        onClick={onClose}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}

/* =========================
   Views
   ========================= */

function DashboardView({ onOpenAlumnus, onOpenJob }) {
  const totalAlumni = mockAlumni.length
  const totalMentors = mockAlumni.filter((a) => a.isMentor).length
  const upcomingEvents = mockEvents.length
  const openJobs = mockJobs.length

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Alumni" value={totalAlumni} />
        <StatCard label="Mentors" value={totalMentors} />
        <StatCard label="Upcoming Events" value={upcomingEvents} />
        <StatCard label="Open Jobs" value={openJobs} />
      </div>

      <section aria-labelledby="news-heading" className="space-y-3">
        <h3 id="news-heading" className="text-lg font-semibold">
          Latest News
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockNews.map((n) => (
            <a
              key={n.id}
              href={n.link}
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted transition"
            >
              <p className="text-sm text-muted-foreground">{n.date}</p>
              <p className="font-medium mt-1">{n.title}</p>
              <p className="text-sm mt-1">{n.summary}</p>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="featured-alumni-heading" className="space-y-3">
        <h3 id="featured-alumni-heading" className="text-lg font-semibold">
          Featured Alumni
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockAlumni.slice(0, 3).map((a) => (
            <AlumniCard key={a.id} alumnus={a} onOpen={onOpenAlumnus} />
          ))}
        </div>
      </section>

      <section aria-labelledby="featured-jobs-heading" className="space-y-3">
        <h3 id="featured-jobs-heading" className="text-lg font-semibold">
          Featured Jobs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockJobs.slice(0, 3).map((j) => (
            <JobCard key={j.id} job={j} onOpen={onOpenJob} />
          ))}
        </div>
      </section>
    </div>
  )
}

function DirectoryView({ onOpenAlumnus }) {
  // Separate useState per filter criterion
  const [yearFilter, setYearFilter] = useState("all")
  const [majorFilter, setMajorFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [mentorOnly, setMentorOnly] = useState(false)
  const [query, setQuery] = useState("")

  // Unique lists for dropdowns
  const years = useMemo(() => Array.from(new Set(mockAlumni.map((a) => a.graduationYear))).sort((a, b) => b - a), [])
  const majors = useMemo(() => Array.from(new Set(mockAlumni.map((a) => a.major))).sort(), [])
  const locations = useMemo(() => Array.from(new Set(mockAlumni.map((a) => a.location))).sort(), [])

  // Derived filtered alumni using useMemo to avoid unnecessary re-renders
  const filteredAlumni = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mockAlumni.filter((a) => {
      if (yearFilter !== "all" && String(a.graduationYear) !== yearFilter) return false
      if (majorFilter !== "all" && a.major !== majorFilter) return false
      if (locationFilter !== "all" && a.location !== locationFilter) return false
      if (mentorOnly && !a.isMentor) return false
      if (q) {
        const inText =
          a.name.toLowerCase().includes(q) ||
          a.company.toLowerCase().includes(q) ||
          a.position.toLowerCase().includes(q) ||
          a.major.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.skills.some((s) => s.toLowerCase().includes(q))
        if (!inText) return false
      }
      return true
    })
  }, [yearFilter, majorFilter, locationFilter, mentorOnly, query])

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <label htmlFor="q" className="text-sm text-muted-foreground">
              Search
            </label>
            <input
              id="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, company, skills..."
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="year" className="text-sm text-muted-foreground">
              Year
            </label>
            <select
              id="year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
            >
              <option value="all">All</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="major" className="text-sm text-muted-foreground">
              Major
            </label>
            <select
              id="major"
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
            >
              <option value="all">All</option>
              {majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="text-sm text-muted-foreground">
              Location
            </label>
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
            >
              <option value="all">All</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={mentorOnly}
                onChange={(e) => setMentorOnly(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-sm">Mentors only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredAlumni.map((a) => (
          <AlumniCard key={a.id} alumnus={a} onOpen={onOpenAlumnus} />
        ))}
        {filteredAlumni.length === 0 && (
          <div className="md:col-span-3 rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
            No alumni match your filters.
          </div>
        )}
      </div>
    </div>
  )
}

function EventsView() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      {mockEvents.map((e) => (
        <div key={e.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{e.title}</h4>
            <span className="text-sm text-muted-foreground">{e.date}</span>
          </div>
          <p className="text-sm text-muted-foreground">{e.location}</p>
          <p className="mt-2 text-sm">{e.description}</p>
          <div className="mt-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              RSVP
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfileView() {
  const u = loggedInUser
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <img
            src={u.avatarUrl || "/placeholder.svg"}
            alt={`${u.name} avatar`}
            className="h-20 w-20 rounded-full border border-border object-cover"
          />
          <div>
            <h4 className="font-semibold">{u.name}</h4>
            <p className="text-sm text-muted-foreground">
              {u.position} • {u.company}
            </p>
            <p className="text-sm text-muted-foreground">
              {u.major} • Class of {u.graduationYear}
            </p>
            <p className="text-sm text-muted-foreground">{u.location}</p>
          </div>
        </div>
        <p className="mt-4 text-sm">{u.bio}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {u.skills.map((s) => (
            <span key={s} className="text-xs rounded-md px-2 py-1 bg-muted text-muted-foreground">
              {s}
            </span>
          ))}
          {u.isMentor && <span className="text-xs rounded-md px-2 py-1 bg-primary/20 text-foreground">Mentor</span>}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h5 className="font-medium">Preferences</h5>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
            <span className="text-sm">Email notifications</span>
            <input type="checkbox" className="h-4 w-4 rounded border-border" defaultChecked />
          </label>
          <label className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
            <span className="text-sm">Open to mentoring</span>
            <input type="checkbox" className="h-4 w-4 rounded border-border" defaultChecked={u.isMentor} />
          </label>
        </div>
      </div>
    </div>
  )
}

/* =========================
   Top-Level SPA
   ========================= */

export default function Page() {
  return <AlumniApp />
}

function AlumniApp() {
  // SPA navigation state
  const [activePage, setActivePage] = useState("dashboard")

  // Single modal controller: visibility, data payload, and content type
  const [modal, setModal] = useState({ isOpen: false, data: null, type: "" })

  const openAlumniModal = (alumnus) => setModal({ isOpen: true, data: alumnus, type: "alumni" })
  const openJobModal = (job) => setModal({ isOpen: true, data: job, type: "job" })
  const closeModal = () => setModal({ isOpen: false, data: null, type: "" })

  const pageTitle =
    activePage === "dashboard"
      ? "Dashboard"
      : activePage === "directory"
        ? "Alumni Directory"
        : activePage === "events"
          ? "Events"
          : "My Profile"

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <div className="flex flex-col md:flex-row">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />

        <main className="flex-1">
          <Header title={pageTitle}>
            {/* Simple actions area */}
            <button
              type="button"
              onClick={() => setActivePage("profile")}
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
            >
              View Profile
            </button>
          </Header>

          {activePage === "dashboard" && <DashboardView onOpenAlumnus={openAlumniModal} onOpenJob={openJobModal} />}
          {activePage === "directory" && <DirectoryView onOpenAlumnus={openAlumniModal} />}
          {activePage === "events" && <EventsView />}
          {activePage === "profile" && <ProfileView />}
        </main>
      </div>

      {/* Modal rendering based on modal.type */}
      <Modal
        isOpen={modal.isOpen}
        title={modal.type === "alumni" ? "Alumnus Details" : modal.type === "job" ? "Job Details" : "Details"}
        onClose={closeModal}
      >
        {modal.type === "alumni" && modal.data && (
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <img
                src={modal.data.avatarUrl || "/placeholder.svg"}
                alt={`${modal.data.name} avatar`}
                className="h-16 w-16 rounded-full border border-border object-cover"
              />
              <div>
                <p className="font-semibold">{modal.data.name}</p>
                <p className="text-sm text-muted-foreground">
                  {modal.data.position} • {modal.data.company}
                </p>
                <p className="text-sm text-muted-foreground">
                  {modal.data.major} • Class of {modal.data.graduationYear}
                </p>
                <p className="text-sm text-muted-foreground">{modal.data.location}</p>
              </div>
            </div>
            <p className="text-sm">{modal.data.bio}</p>
            <div className="flex flex-wrap gap-2">
              {modal.data.skills.map((s) => (
                <span key={s} className="text-xs rounded-md px-2 py-1 bg-muted text-muted-foreground">
                  {s}
                </span>
              ))}
              {modal.data.isMentor && (
                <span className="text-xs rounded-md px-2 py-1 bg-primary/20 text-foreground">Mentor</span>
              )}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Message
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {modal.type === "job" && modal.data && (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{modal.data.title}</p>
                <p className="text-sm text-muted-foreground">
                  {modal.data.company} • {modal.data.location} • {modal.data.type}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Posted {modal.data.postedAt}</span>
            </div>
            <p className="text-sm">{modal.data.description}</p>
            <div>
              <p className="text-sm font-medium">Requirements:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {modal.data.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={modal.data.applyUrl}
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Apply
              </a>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {!modal.type && <p className="text-sm text-muted-foreground">No details available.</p>}
      </Modal>
    </div>
  )
}
