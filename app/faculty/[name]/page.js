import Link from 'next/link';

const FACULTY_NAMES = [
  'Engr. Aamir Hanif',
  'Imtiyaz Hussain',
  'Khadim Rafique',
  'Bilal Ahmad',
  'Amer Raza',
  'Dr. Hamza Farooq',
  'Sara Ahmed',
  'Muhammad Kashif',
  'Nouman Rafique',
  'Waqar Ahmad',
];

export function generateStaticParams() {
  return FACULTY_NAMES.map((name) => ({
    name: encodeURIComponent(name),
  }));
}

export default async function FacultyDetail({ params }) {
  const { name } = await params;
  const title = decodeURIComponent(name);

  return (
    <section className="section page-hero">
      <div className="container detail-grid">
        <img
          className="detail-image"
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&q=85"
          alt={title}
        />

        <div>
          <div className="eyebrow">Faculty Profile</div>

          <h1
            style={{
              fontSize: 'clamp(42px,6vw,70px)',
              margin: '18px 0',
            }}
          >
            {title}
          </h1>

          <p className="lead">
            Experienced educator focused on concept clarity,
            disciplined preparation and student confidence.
          </p>

          <div className="list">
            <div className="list-row">
              <b>Experience</b>
              <span>8–15+ years</span>
            </div>

            <div className="list-row">
              <b>Education</b>
              <span>Relevant advanced qualification</span>
            </div>

            <div className="list-row">
              <b>Subject</b>
              <span>Academic specialization</span>
            </div>
          </div>

          <p className="lead">
            A place to learn, grow and achieve — with
            consistent feedback and a practical study plan.
          </p>

          <Link
            className="btn primary"
            href="/admission"
          >
            Enquire about admission ↗
          </Link>
        </div>
      </div>
    </section>
  );
}