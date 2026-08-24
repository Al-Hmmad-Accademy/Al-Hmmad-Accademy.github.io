import Link from 'next/link';

const FACULTY = [
  {
    name: 'Muhammad Saad',
    subject: 'Physics & Mathematics',
    education: 'B.Sc Electrical Engineering, M.Sc Electrical Engineering',
    experience: '15+ years',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Ali Hussain',
    subject: 'Islamic Studies & Pak Studies',
    education: 'M.A Islamic Studies',
    experience: '12+ years',
    image:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Ahmad Mujtabah',
    subject: 'English',
    education: 'M.A English Literature',
    experience: '10+ years',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Haider Mustajab',
    subject: 'Urdu',
    education: 'M.A Urdu',
    experience: '9+ years',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Ahmer Ali',
    subject: 'Biology',
    education: 'M.Sc Biology',
    experience: '8+ years',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Dr. Hamza Farooq',
    subject: 'Chemistry',
    education: 'PhD Chemistry',
    experience: '11+ years',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Sara Ahmed',
    subject: 'Computer Science',
    education: 'M.Sc Computer Science',
    experience: '7+ years',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Muhammad Kashif',
    subject: 'Chemistry',
    education: 'M.Sc Chemistry',
    experience: '9+ years',
    image:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1000&q=85',
  },
];

export function generateStaticParams() {
  return FACULTY.map((teacher) => ({
    name: teacher.name,
  }));
}

export default async function FacultyDetail({ params }) {
  const { name } = await params;

  const teacher = FACULTY.find(
    (item) => item.name === decodeURIComponent(name)
  );

  if (!teacher) {
    return (
      <section className="section page-hero">
        <div className="container">
          <div className="card" style={{ padding: 50 }}>
            <h1>Faculty member not found</h1>
            <p className="lead">
              The requested faculty profile does not exist.
            </p>

            <Link className="btn primary" href="/faculty">
              ← Back to Faculty
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section page-hero">
      <div className="container detail-grid">
        <img
          className="detail-image"
          src={teacher.image}
          alt={teacher.name}
        />

        <div>
          <div className="eyebrow">Faculty Profile</div>

          <h1
            style={{
              fontSize: 'clamp(42px,6vw,70px)',
              margin: '18px 0',
            }}
          >
            {teacher.name}
          </h1>

          <span className="tag">{teacher.subject}</span>

          <p className="lead" style={{ marginTop: 22 }}>
            Experienced educator focused on concept clarity,
            disciplined preparation and student confidence.
          </p>

          <div className="list">
            <div className="list-row">
              <b>Subject</b>
              <span>{teacher.subject}</span>
            </div>

            <div className="list-row">
              <b>Experience</b>
              <span>{teacher.experience}</span>
            </div>

            <div className="list-row">
              <b>Education</b>
              <span>{teacher.education}</span>
            </div>
          </div>

          <p className="lead">
            Students are guided through clear concepts, structured
            practice, regular feedback and exam-focused preparation.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn primary" href="/admission">
              Enquire about admission ↗
            </Link>

            <Link className="btn" href="/faculty">
              ← Back to Faculty
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}