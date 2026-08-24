'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Megaphone,
  School,
  Trash2,
  UserCircle,
  Users,
  WalletCards,
  X,
} from 'lucide-react';

import { useAuth } from '../../../components/AuthProvider';
import Chat from '../../../components/Chat';

const API =
  process.env.NEXT_PUBLIC_API_URL || 'https://steps-accademy-backend-production.up.railway.app';

const CLASSES = [
  'Pre 9',
  '9th Class',
  '10th Class',
  'Pre First Year',
  '1st Year',
  '2nd Year',
];

const SUBJECTS = [
  'English',
  'Urdu',
  'Mathematics',
  'Islamiat',
  'Pakistan Studies',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
];

const COMPULSORY_SUBJECTS = [
  'English',
  'Urdu',
  'Mathematics',
  'Islamiat',
  'Pakistan Studies',
];

const OPTIONAL_SUBJECTS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
];

const TITLES = {
  students: 'Students',
  teachers: 'Teachers',
  grades: 'Grades & Reports',
  announcements: 'Announcements',
  books: 'Books',
  fees: 'Fees',
  classes: 'Classes',
  chat: 'Chat',
  tests: 'Tests',
  files: 'Files',
  profile: 'Profile',
};

export default function DashboardSection() {
  const params = useParams();
  const section = params?.section;

  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <section className="dashboard">
        <div className="container">
          <div className="card feature">
            <h2>Please login first.</h2>

            <Link
              href="/login"
              className="btn primary"
            >
              Login →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  switch (section) {
    case 'students':
      return (
        <StudentsSection
          user={user}
        />
      );

    case 'teachers':
      return (
        <TeachersSection
          user={user}
        />
      );

    case 'grades':
      return (
        <GradesSection
          user={user}
        />
      );

    case 'fees':
      return (
        <FeesSection
          user={user}
        />
      );

    case 'announcements':
      return (
        <AnnouncementsSection
          user={user}
        />
      );

    case 'books':
      return (
        <BooksSection
          user={user}
        />
      );

    case 'tests':
      return (
        <TestsSection
          user={user}
        />
      );

    case 'files':
      return (
        <FilesSection
          user={user}
        />
      );

    case 'profile':
      return (
        <ProfileSection
          user={user}
        />
      );

    case 'classes':
      return (
        <ClassesSection
          user={user}
        />
      );

    case 'chat':
      return (
        <section className="dashboard">
          <div className="container">
            <PageHeader
              title="Chat"
              description="Open a secure conversation with an academy member."
            />

            <Chat user={user} />
          </div>
        </section>
      );

    default:
      return (
        <section className="dashboard">
          <div className="container">
            <PageHeader
              title={TITLES[section] || 'Academy Portal'}
              description="Academy dashboard section."
            />

            <EmptyCard text="This section is not available yet." />
          </div>
        </section>
      );
  }
}

/* =========================================================
   STUDENTS
========================================================= */

function StudentsSection({ user }) {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  async function loadStudents() {
    const response = await fetch(
      `${API}/admin/users?role=student`,
      {
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (response.ok) {
      setStudents(data.users || []);
    }
  }

  useEffect(() => {
    if (user.role === 'admin') {
      loadStudents();
    }
  }, [user.role]);

  async function deleteStudent(id) {
    const ok = window.confirm(
      'Are you sure you want to delete this student?'
    );

    if (!ok) return;

    const response = await fetch(
      `${API}/admin/users/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      setMessage('Student deleted successfully.');
      loadStudents();
    } else {
      setMessage(data.message || 'Unable to delete student.');
    }
  }

  if (user.role !== 'admin') {
    return <Forbidden />;
  }

  return (
    <section className="dashboard">
      <div className="container">

        <PageHeader
          title="Students"
          description="Create, edit and manage all academy student accounts."
        />

        <div
          className="card"
          style={{
            padding: 20,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <strong>
              Total Students: {students.length}
            </strong>
          </div>

          <button
            className="btn primary"
            onClick={() => {
              setEditing(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Close Form' : '+ Add Student'}
          </button>
        </div>

        {message && (
          <div className="card feature">
            <p>{message}</p>
          </div>
        )}

        {showForm && (
          <StudentTeacherForm
            type="student"
            editing={editing}
            onSaved={() => {
              setShowForm(false);
              setEditing(null);
              loadStudents();
              setMessage('Student saved successfully.');
            }}
          />
        )}

        <div className="portal-card-grid">

          {students.map((student) => (
            <div
              className="portal-card"
              key={student._id}
            >
              <div className="portal-card-icon">
                <Users size={23} />
              </div>

              <div className="portal-card-content">

                <div className="portal-card-kicker">
                  STUDENT
                </div>

                <h3>
                  {student.name || student.username}
                </h3>

                <p>
                  Username: {student.username}
                </p>

                <p>
                  Class: {student.className || 'Not assigned'}
                </p>

                <p>
                  Student ID: {student.studentId || '—'}
                </p>

                <p>
                  Subjects:{' '}
                  {student.subjects?.join(', ') || '—'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 15,
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    className="btn"
                    onClick={() => {
                      setEditing(student);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn"
                    onClick={() =>
                      deleteStudent(student._id)
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>

        {students.length === 0 && (
          <EmptyCard text="No students have been added yet." />
        )}

      </div>
    </section>
  );
}

/* =========================================================
   TEACHERS
========================================================= */

function TeachersSection({ user }) {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  async function loadTeachers() {
    const response = await fetch(
      `${API}/admin/users?role=teacher`,
      {
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (response.ok) {
      setTeachers(data.users || []);
    }
  }

  useEffect(() => {
    if (user.role === 'admin') {
      loadTeachers();
    }
  }, [user.role]);

  async function deleteTeacher(id) {
    const ok = window.confirm(
      'Are you sure you want to delete this teacher?'
    );

    if (!ok) return;

    const response = await fetch(
      `${API}/admin/users/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      setMessage('Teacher deleted successfully.');
      loadTeachers();
    } else {
      setMessage(data.message || 'Unable to delete teacher.');
    }
  }

  if (user.role !== 'admin') {
    return <Forbidden />;
  }

  return (
    <section className="dashboard">
      <div className="container">

        <PageHeader
          title="Teachers"
          description="Create, edit and manage academy teachers."
        />

        <div
          className="card"
          style={{
            padding: 20,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <strong>
            Total Teachers: {teachers.length}
          </strong>

          <button
            className="btn primary"
            onClick={() => {
              setEditing(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Close Form' : '+ Add Teacher'}
          </button>
        </div>

        {message && (
          <div className="card feature">
            <p>{message}</p>
          </div>
        )}

        {showForm && (
          <StudentTeacherForm
            type="teacher"
            editing={editing}
            onSaved={() => {
              setShowForm(false);
              setEditing(null);
              loadTeachers();
              setMessage('Teacher saved successfully.');
            }}
          />
        )}

        <div className="portal-card-grid">

          {teachers.map((teacher) => (
            <div
              className="portal-card"
              key={teacher._id}
            >
              <div className="portal-card-icon">
                <GraduationCap size={23} />
              </div>

              <div className="portal-card-content">

                <div className="portal-card-kicker">
                  TEACHER
                </div>

                <h3>
                  {teacher.name || teacher.username}
                </h3>

                <p>
                  Username: {teacher.username}
                </p>

                <p>
                  Teacher ID: {teacher.teacherId || '—'}
                </p>

                <p>
                  Subjects:{' '}
                  {teacher.subjects?.join(', ') || '—'}
                </p>

                <p>
                  Phone: {teacher.phone || '—'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 15,
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    className="btn"
                    onClick={() => {
                      setEditing(teacher);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn"
                    onClick={() =>
                      deleteTeacher(teacher._id)
                    }
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>

        {teachers.length === 0 && (
          <EmptyCard text="No teachers have been added yet." />
        )}

      </div>
    </section>
  );
}

/* =========================================================
   ADD / EDIT STUDENT / TEACHER FORM
========================================================= */

function StudentTeacherForm({
  type,
  editing,
  onSaved,
}) {
  const [form, setForm] = useState({
    name: editing?.name || '',
    username: editing?.username || '',
    password: '',
    email: editing?.email || '',
    phone: editing?.phone || '',
    studentId: editing?.studentId || '',
    teacherId: editing?.teacherId || '',
    className: editing?.className || '',
    bio: editing?.bio || '',
    subjects:
      editing?.subjects?.length
        ? editing.subjects
        : [...COMPULSORY_SUBJECTS],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((old) => ({
      ...old,
      [field]: value,
    }));
  }

  function toggleSubject(subject) {
    setForm((old) => ({
      ...old,
      subjects: old.subjects.includes(subject)
        ? old.subjects.filter((x) => x !== subject)
        : [...old.subjects, subject],
    }));
  }

  async function submit(e) {
    e.preventDefault();

    setSaving(true);
    setError('');

    try {
      let response;

      if (editing) {
        response = await fetch(
          `${API}/admin/users/${editing._id}`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: form.name,
              username: form.username,
              email: form.email,
              phone: form.phone,
              className: form.className,
              bio: form.bio,
              subjects: form.subjects,
            }),
          }
        );
      } else {
        response = await fetch(
          `${API}/admin/${type === 'student'
            ? 'students'
            : 'teachers'}`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...form,
            }),
          }
        );
      }

      const data =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to save record.'
        );
      }

      onSaved();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="card"
      style={{
        padding: 25,
        marginBottom: 25,
      }}
    >
      <div className="eyebrow">
        {editing ? 'EDIT' : 'NEW'}{' '}
        {type.toUpperCase()}
      </div>

      <h2>
        {editing ? 'Edit' : 'Add'}{' '}
        {type === 'student'
          ? 'Student'
          : 'Teacher'}
      </h2>

      <p
        style={{
          color: 'var(--muted)',
          marginBottom: 25,
        }}
      >
        Har field ke neeche clear line/block diya gaya
        hai taake pata chale ke kis jagah kya enter karna hai.
      </p>

      {error && (
        <div className="card feature">
          <p>{error}</p>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(240px,1fr))',
          gap: 18,
        }}
      >

        <FormField
          label="Full Name"
          hint="Student / teacher ka complete naam"
          value={form.name}
          onChange={(v) => update('name', v)}
          required
        />

        <FormField
          label="Username"
          hint="Login ke liye username"
          value={form.username}
          onChange={(v) => update('username', v)}
          required
        />

        {!editing && (
          <FormField
            label="Password"
            hint="Login password"
            type="password"
            value={form.password}
            onChange={(v) =>
              update('password', v)
            }
            required
          />
        )}

        <FormField
          label="Email"
          hint="Email address"
          type="email"
          value={form.email}
          onChange={(v) => update('email', v)}
        />

        <FormField
          label="Phone"
          hint="Mobile / WhatsApp number"
          value={form.phone}
          onChange={(v) => update('phone', v)}
        />

        {type === 'student' ? (
          <FormField
            label="Student ID"
            hint="Unique student ID"
            value={form.studentId}
            onChange={(v) =>
              update('studentId', v)
            }
          />
        ) : (
          <FormField
            label="Teacher ID"
            hint="Unique teacher ID"
            value={form.teacherId}
            onChange={(v) =>
              update('teacherId', v)
            }
          />
        )}

      </div>

      {/* CLASS */}

      {type === 'student' && (
        <div
          className="card"
          style={{
            padding: 20,
            marginTop: 20,
          }}
        >
          <h3>Select Class</h3>

          <p
            style={{
              color: 'var(--muted)',
            }}
          >
            Neeche class par click karke ek class
            select karein.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 15,
            }}
          >
            {CLASSES.map((className) => {
              const selected =
                form.className === className;

              return (
                <button
                  type="button"
                  key={className}
                  className={
                    selected
                      ? 'btn primary'
                      : 'btn'
                  }
                  onClick={() =>
                    update(
                      'className',
                      className
                    )
                  }
                >
                  {selected && (
                    <Check
                      size={15}
                      style={{
                        marginRight: 5,
                      }}
                    />
                  )}

                  {className}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBJECTS */}

      <div
        className="card"
        style={{
          padding: 20,
          marginTop: 20,
        }}
      >
        <h3>Subjects</h3>

        <p
          style={{
            color: 'var(--muted)',
          }}
        >
          Sab subjects neeche available hain.
          Compulsory subjects pehle se selected hain.
          Kisi subject ko select/unselect kar sakte hain.
        </p>

        <h4 style={{ marginTop: 20 }}>
          Compulsory Subjects
        </h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(220px,1fr))',
            gap: 10,
            marginTop: 10,
          }}
        >
          {COMPULSORY_SUBJECTS.map(
            (subject) => (
              <SubjectBox
                key={subject}
                subject={subject}
                selected={form.subjects.includes(
                  subject
                )}
                compulsory
                onClick={() =>
                  toggleSubject(subject)
                }
              />
            )
          )}
        </div>

        <h4 style={{ marginTop: 25 }}>
          Optional Subjects
        </h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(220px,1fr))',
            gap: 10,
            marginTop: 10,
          }}
        >
          {OPTIONAL_SUBJECTS.map(
            (subject) => (
              <SubjectBox
                key={subject}
                subject={subject}
                selected={form.subjects.includes(
                  subject
                )}
                onClick={() =>
                  toggleSubject(subject)
                }
              />
            )
          )}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          <strong>Bio / Additional Details</strong>

          <textarea
            value={form.bio}
            onChange={(e) =>
              update('bio', e.target.value)
            }
            placeholder="Yahan additional information enter karein..."
            rows={5}
            style={{
              width: '100%',
              marginTop: 8,
              padding: 14,
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,.15)',
              background: 'rgba(255,255,255,.04)',
              color: 'inherit',
            }}
          />
        </label>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          marginTop: 20,
        }}
      >
        <button
          className="btn primary"
          disabled={saving}
        >
          {saving
            ? 'Saving…'
            : editing
            ? 'Update'
            : 'Create'}
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  hint,
  value,
  onChange,
  type = 'text',
  required = false,
}) {
  return (
    <label
      style={{
        display: 'block',
      }}
    >
      <strong>{label}</strong>

      <div
        style={{
          color: 'var(--muted)',
          fontSize: 12,
          marginTop: 4,
          marginBottom: 7,
        }}
      >
        {hint}
      </div>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        required={required}
        placeholder={`Enter ${label}`}
        style={{
          width: '100%',
          padding: '13px 14px',
          borderRadius: 10,
          border:
            '1px solid rgba(255,255,255,.15)',
          background:
            'rgba(255,255,255,.04)',
          color: 'inherit',
        }}
      />
    </label>
  );
}

function SubjectBox({
  subject,
  selected,
  compulsory,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        textAlign: 'left',
        border:
          selected
            ? '1px solid #d9b45f'
            : undefined,
      }}
    >
      <span>
        {subject}
        {compulsory && (
          <small
            style={{
              display: 'block',
              opacity: 0.65,
              marginTop: 3,
            }}
          >
            Compulsory
          </small>
        )}
      </span>

      {selected ? (
        <Check size={18} />
      ) : (
        <X size={18} />
      )}
    </button>
  );
}

/* =========================================================
   GRADES
========================================================= */

function GradesSection({ user }) {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    student: '',
    subject: '',
    total: '',
    obtained: '',
    date: '',
  });
  const [message, setMessage] = useState('');

  async function load() {
    try {
      if (user.role === 'student') {
        const r = await fetch(
          `${API}/grades/student/${user.id}`,
          {
            credentials: 'include',
          }
        );

        const x = await r.json();

        if (r.ok) {
          setGrades(x.grades || []);
        }

        return;
      }

      const r = await fetch(
        `${API}/admin/users?role=student`,
        {
          credentials: 'include',
        }
      );

      const x = await r.json();

      if (r.ok) {
        setStudents(x.users || []);
      }
    } catch {}
  }

  useEffect(() => {
    load();
  }, []);

  async function loadStudentGrades(studentId) {
    if (!studentId) {
      setGrades([]);
      return;
    }

    const r = await fetch(
      `${API}/grades/student/${studentId}`,
      {
        credentials: 'include',
      }
    );

    const x = await r.json();

    if (r.ok) {
      setGrades(x.grades || []);
    }
  }

  async function addGrade(e) {
    e.preventDefault();

    const r = await fetch(`${API}/grades`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const x = await r.json().catch(() => ({}));

    if (r.ok) {
      setMessage('Grade added successfully.');

      setForm({
        student: '',
        subject: '',
        total: '',
        obtained: '',
        date: '',
      });

      if (form.student) {
        loadStudentGrades(form.student);
      }
    } else {
      setMessage(
        x.message || 'Unable to add grade.'
      );
    }
  }

  return (
    <section className="dashboard">
      <div className="container">

        <PageHeader
          title="Grades & Reports"
          description="Academic results and performance records."
        />

        {user.role === 'admin' && (
          <form
            className="card"
            onSubmit={addGrade}
            style={{
              padding: 22,
              marginBottom: 22,
            }}
          >
            <h3>Add Grade</h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(200px,1fr))',
                gap: 12,
                marginTop: 15,
              }}
            >
              <select
                value={form.student}
                onChange={(e) => {
                  setForm({
                    ...form,
                    student: e.target.value,
                  });

                  loadStudentGrades(
                    e.target.value
                  );
                }}
                required
              >
                <option value="">
                  Select Student
                </option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.name ||
                      student.username}
                  </option>
                ))}
              </select>

              <input
                placeholder="Subject"
                value={form.subject}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subject: e.target.value,
                  })
                }
                required
              />

              <input
                type="number"
                placeholder="Total Marks"
                value={form.total}
                onChange={(e) =>
                  setForm({
                    ...form,
                    total: e.target.value,
                  })
                }
                required
              />

              <input
                type="number"
                placeholder="Obtained Marks"
                value={form.obtained}
                onChange={(e) =>
                  setForm({
                    ...form,
                    obtained: e.target.value,
                  })
                }
                required
              />

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    date: e.target.value,
                  })
                }
              />
            </div>

            <button
              className="btn primary"
              style={{ marginTop: 15 }}
            >
              Add Grade
            </button>
          </form>
        )}

        {message && (
          <div className="card feature">
            <p>{message}</p>
          </div>
        )}

        {user.role === 'student' && (
          <GradeTable grades={grades} />
        )}

        {user.role !== 'student' &&
          grades.length > 0 && (
            <GradeTable grades={grades} />
          )}

        {grades.length === 0 && (
          <EmptyCard text="No grades found yet." />
        )}

      </div>
    </section>
  );
}

function GradeTable({ grades }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Date</th>
            <th>Total</th>
            <th>Obtained</th>
            <th>Percentage</th>
          </tr>
        </thead>

        <tbody>
          {grades.map((grade) => {
            const percentage =
              Number(grade.total) > 0
                ? (
                    (Number(grade.obtained) /
                      Number(grade.total)) *
                    100
                  ).toFixed(1)
                : '0';

            return (
              <tr key={grade._id}>
                <td>{grade.subject}</td>

                <td>
                  {grade.date
                    ? new Date(
                        grade.date
                      ).toLocaleDateString()
                    : '—'}
                </td>

                <td>{grade.total}</td>

                <td>{grade.obtained}</td>

                <td>{percentage}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   FEES
========================================================= */

function FeesSection({ user }) {
  const [fees, setFees] = useState([]);
  const [loadingFees, setLoadingFees] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const url =
          user.role === 'student'
            ? `${API}/admin/fees?student=${user.id}`
            : `${API}/admin/fees`;

        const r = await fetch(url, {
          credentials: 'include',
        });

        const x = await r.json();

        if (r.ok) {
          setFees(x.fees || []);
        }
      } catch {
      } finally {
        setLoadingFees(false);
      }
    }

    load();
  }, [user]);

  return (
    <section className="dashboard">
      <div className="container">

        <PageHeader
          title="Fees"
          description="Student fee records and payment status."
        />

        {loadingFees ? (
          <LoadingCard />
        ) : fees.length === 0 ? (
          <EmptyCard text="No fee record has been added yet." />
        ) : (
          <div className="portal-card-grid">
            {fees.map((fee) => (
              <div
                className="portal-card"
                key={fee._id}
              >
                <div className="portal-card-icon">
                  <WalletCards size={23} />
                </div>

                <div className="portal-card-content">
                  <div className="portal-card-kicker">
                    FEES
                  </div>

                  <h3>
                    {fee.studentName ||
                      fee.studentUsername ||
                      'Student'}
                  </h3>

                  <p>
                    Paid: {fee.paid ?? 0}
                  </p>

                  <p>
                    Status:{' '}
                    <strong>
                      {fee.status || 'unpaid'}
                    </strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

/* =========================================================
   ANNOUNCEMENTS
========================================================= */

function AnnouncementsSection({ user }) {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: '',
    body: '',
    image: '',
  });

  async function load() {
    const r = await fetch(
      `${API}/content/announcements`,
      {
        credentials: 'include',
      }
    );

    const x = await r.json();

    if (r.ok) {
      setItems(x.announcements || []);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();

    const r = await fetch(
      `${API}/content/announcements`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      }
    );

    const x = await r.json().catch(() => ({}));

    if (r.ok) {
      setShowForm(false);

      setForm({
        title: '',
        body: '',
        image: '',
      });

      load();

      alert(
        x.message ||
          'Announcement submitted successfully.'
      );
    } else {
      alert(
        x.message ||
          'Unable to create announcement.'
      );
    }
  }

  return (
    <section className="dashboard">
      <div className="container">

        <PageHeader
          title="Announcements"
          description="Latest academy announcements."
        />

        {user.role !== 'student' && (
          <>
            <button
              className="btn primary"
              onClick={() =>
                setShowForm(!showForm)
              }
              style={{ marginBottom: 20 }}
            >
              {showForm
                ? 'Close'
                : '+ Add Announcement'}
            </button>

            {showForm && (
              <form
                className="card"
                onSubmit={submit}
                style={{
                  padding: 22,
                  marginBottom: 22,
                }}
              >
                <h3>Add Announcement</h3>

                <input
                  placeholder="Announcement title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  required
                />

                <textarea
                  placeholder="Announcement details"
                  rows={6}
                  value={form.body}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      body: e.target.value,
                    })
                  }
                  required
                  style={{
                    marginTop: 12,
                    width: '100%',
                  }}
                />

                <input
                  placeholder="Image URL (optional)"
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value,
                    })
                  }
                  style={{
                    marginTop: 12,
                  }}
                />

                <button
                  className="btn primary"
                  style={{ marginTop: 15 }}
                >
                  Publish
                </button>
              </form>
            )}
          </>
        )}

        <div className="portal-card-grid">
          {items.map((item) => (
            <article
              className="card"
              key={item._id}
              style={{
                padding: 20,
              }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                    borderRadius: 10,
                  }}
                />
              )}

              <span className="tag">
                ANNOUNCEMENT
              </span>

              <h3 style={{ marginTop: 12 }}>
                {item.title}
              </h3>

              <p>{item.body}</p>
            </article>
          ))}
        </div>

        {items.length === 0 && (
          <EmptyCard text="No announcements available yet." />
        )}

      </div>
    </section>
  );
}

/* =========================================================
   BOOKS
========================================================= */

function BooksSection({ user }) {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subject: '',
    url: '',
  });

  async function load() {
    const r = await fetch(
      `${API}/content/books`,
      {
        credentials: 'include',
      }
    );

    const x = await r.json();

    if (r.ok) {
      setBooks(x.books || []);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addBook(e) {
    e.preventDefault();

    const r = await fetch(
      `${API}/content/books`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      }
    );

    const x = await r.json().catch(() => ({}));

    if (r.ok) {
      setShowForm(false);

      setForm({
        title: '',
        subject: '',
        url: '',
      });

      load();

      alert(
        x.message ||
          'Book added successfully.'
      );
    } else {
      alert(
        x.message ||
          'Unable to add book.'
      );
    }
  }

  return (
    <section className="dashboard">
      <div className="container">

        <PageHeader
          title="Books"
          description="Academic books and PDF resources."
        />

        {user.role === 'admin' && (
          <>
            <button
              className="btn primary"
              onClick={() =>
                setShowForm(!showForm)
              }
              style={{ marginBottom: 20 }}
            >
              {showForm
                ? 'Close'
                : '+ Add Book'}
            </button>

            {showForm && (
              <form
                className="card"
                onSubmit={addBook}
                style={{
                  padding: 22,
                  marginBottom: 22,
                }}
              >
                <h3>Add Book</h3>

                <input
                  placeholder="Book title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  required
                />

                <input
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  style={{
                    marginTop: 12,
                  }}
                  required
                />

                <input
                  placeholder="PDF URL"
                  value={form.url}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      url: e.target.value,
                    })
                  }
                  style={{
                    marginTop: 12,
                  }}
                  required
                />

                <button
                  className="btn primary"
                  style={{ marginTop: 15 }}
                >
                  Add Book
                </button>
              </form>
            )}
          </>
        )}

        <div className="portal-card-grid">
          {books.map((book) => (
            <div
              className="portal-card"
              key={book._id}
            >
              <div className="portal-card-icon">
                <BookOpen size={23} />
              </div>

              <div className="portal-card-content">

                <div className="portal-card-kicker">
                  {book.subject || 'ACADEMIC'}
                </div>

                <h3>{book.title}</h3>

                <p>
                  Open or download this academic
                  resource.
                </p>

                {book.url && (
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      marginTop: 12,
                    }}
                  >
                    <a
                      href={book.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn"
                    >
                      View PDF
                    </a>

                    <a
                      href={book.url}
                      download
                      className="btn primary"
                    >
                      Download
                    </a>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <EmptyCard text="No books have been added yet." />
        )}

      </div>
    </section>
  );
}

/* =========================================================
   TESTS
========================================================= */

function TestsSection({ user }) {
  const [tests, setTests] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: '',
    url: '',
  });

  async function load() {
    const r = await fetch(
      `${API}/content/tests`,
      {
        credentials: 'include',
      }
    );

    const x = await r.json();

    if (r.ok) {
      setTests(x.tests || []);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();

    const r = await fetch(
      `${API}/content/tests`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      }
    );

    const x = await r.json().catch(() => ({}));

    if (r.ok) {
      setShowForm(false);

      setForm({
        title: '',
        subject: '',
        description: '',
        url: '',
      });

      load();

      alert(x.message || 'Test created.');
    } else {
      alert(
        x.message ||
          'Unable to create test.'
      );
    }
  }

  return (
    <section className="dashboard">
      <div className="container">

        <PageHeader
          title="Tests"
          description="Academy tests and assessments."
        />

        {user.role !== 'student' && (
          <>
            <button
              className="btn primary"
              onClick={() =>
                setShowForm(!showForm)
              }
              style={{ marginBottom: 20 }}
            >
              {showForm
                ? 'Close'
                : '+ Add Test'}
            </button>

            {showForm && (
              <form
                className="card"
                onSubmit={submit}
                style={{
                  padding: 22,
                  marginBottom: 22,
                }}
              >
                <h3>Add Test</h3>

                <input
                  placeholder="Test title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  required
                />

                <input
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  style={{
                    marginTop: 12,
                  }}
                />

                <textarea
                  placeholder="Test description"
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  style={{
                    marginTop: 12,
                    width: '100%',
                  }}
                />

                <input
                  placeholder="Test URL (optional)"
                  value={form.url}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      url: e.target.value,
                    })
                  }
                  style={{
                    marginTop: 12,
                  }}
                />

                <button
                  className="btn primary"
                  style={{ marginTop: 15 }}
                >
                  Add Test
                </button>
              </form>
            )}
          </>
        )}

        <div className="portal-card-grid">
          {tests.map((test) => (
            <div
              className="portal-card"
              key={test._id}
            >
              <div className="portal-card-icon">
                <ClipboardCheck size={23} />
              </div>

              <div className="portal-card-content">
                <div className="portal-card-kicker">
                  {test.subject || 'TEST'}
                </div>

                <h3>{test.title}</h3>

                <p>
                  {test.description ||
                    'Academy assessment'}
                </p>

                {test.url && (
                  <a
                    href={test.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn primary"
                  >
                    Open Test
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {tests.length === 0 && (
          <EmptyCard text="No tests available yet." />
        )}

      </div>
    </section>
  );
}

/* =========================================================
   FILES
========================================================= */

function FilesSection({ user }) {
  const [files, setFiles] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subject: '',
    url: '',
    description: '',
  });

  async function load() {
    const r = await fetch(
      `${API}/content/files`,
      {
        credentials: 'include',
      }
    );

    const x = await r.json();

    if (r.ok) {
      setFiles(x.files || []);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();

    const r = await fetch(
      `${API}/content/files`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      }
    );

    const x = await r.json().catch(() => ({}));

    if (r.ok) {
      setShowForm(false);

      setForm({
        title: '',
        subject: '',
        url: '',
        description: '',
      });

      load();

      alert(x.message || 'File added.');
    } else {
      alert(
        x.message ||
          'Unable to add file.'
      );
    }
  }

  return (
    <section className="dashboard">
      <div className="container">

        <PageHeader
          title="Files"
          description="Academic notes, documents and study material."
        />

        {user.role !== 'student' && (
          <>
            <button
              className="btn primary"
              onClick={() =>
                setShowForm(!showForm)
              }
              style={{ marginBottom: 20 }}
            >
              {showForm
                ? 'Close'
                : '+ Add File'}
            </button>

            {showForm && (
              <form
                className="card"
                onSubmit={submit}
                style={{
                  padding: 22,
                  marginBottom: 22,
                }}
              >
                <h3>Add File</h3>

                <input
                  placeholder="File title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  required
                />

                <input
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  style={{
                    marginTop: 12,
                  }}
                />

                <input
                  placeholder="File URL"
                  value={form.url}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      url: e.target.value,
                    })
                  }
                  style={{
                    marginTop: 12,
                  }}
                  required
                />

                <textarea
                  placeholder="Description"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  style={{
                    marginTop: 12,
                    width: '100%',
                  }}
                />

                <button
                  className="btn primary"
                  style={{ marginTop: 15 }}
                >
                  Add File
                </button>
              </form>
            )}
          </>
        )}

        <div className="portal-card-grid">
          {files.map((file) => (
            <div
              className="portal-card"
              key={file._id}
            >
              <div className="portal-card-icon">
                <FileText size={23} />
              </div>

              <div className="portal-card-content">
                <div className="portal-card-kicker">
                  {file.subject || 'FILE'}
                </div>

                <h3>{file.title}</h3>

                <p>
                  {file.description ||
                    'Academic file'}
                </p>

                {file.url && (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn primary"
                  >
                    Open File
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {files.length === 0 && (
          <EmptyCard text="No files available yet." />
        )}

      </div>
    </section>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfileSection({ user }) {
  const [form, setForm] = useState({
    name: user.name || '',
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || '',
    password: '',
  });

  const [message, setMessage] = useState('');

  async function save(e) {
    e.preventDefault();

    const r = await fetch(
      `${API}/auth/profile`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      }
    );

    const x = await r.json().catch(() => ({}));

    setMessage(
      r.ok
        ? 'Profile updated successfully.'
        : x.message || 'Unable to update profile.'
    );

    if (r.ok) {
      setForm({
        ...form,
        password: '',
      });
    }
  }

  return (
    <section className="dashboard">
      <div className="container">

        <PageHeader
          title="Profile"
          description="Update your academy account information."
        />

        <form
          className="card"
          onSubmit={save}
          style={{
            padding: 25,
            maxWidth: 800,
          }}
        >
          <div className="portal-card-icon">
            <UserCircle size={25} />
          </div>

          <h2 style={{ marginTop: 20 }}>
            {user.role.toUpperCase()} PROFILE
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit,minmax(240px,1fr))',
              gap: 15,
              marginTop: 20,
            }}
          >
            <FormField
              label="Name"
              hint="Your full name"
              value={form.name}
              onChange={(v) =>
                setForm({
                  ...form,
                  name: v,
                })
              }
            />

            <FormField
              label="Username"
              hint="Login username"
              value={form.username}
              onChange={(v) =>
                setForm({
                  ...form,
                  username: v,
                })
              }
            />

            <FormField
              label="Email"
              hint="Email address"
              value={form.email}
              onChange={(v) =>
                setForm({
                  ...form,
                  email: v,
                })
              }
            />

            <FormField
              label="Phone"
              hint="Phone number"
              value={form.phone}
              onChange={(v) =>
                setForm({
                  ...form,
                  phone: v,
                })
              }
            />

            <FormField
              label="New Password"
              hint="Leave empty if you don't want to change it"
              type="password"
              value={form.password}
              onChange={(v) =>
                setForm({
                  ...form,
                  password: v,
                })
              }
            />
          </div>

          <button
            className="btn primary"
            style={{ marginTop: 20 }}
          >
            Save Profile
          </button>

          {message && (
            <p style={{ marginTop: 15 }}>
              {message}
            </p>
          )}
        </form>

      </div>
    </section>
  );
}

/* =========================================================
   CLASSES
========================================================= */

function ClassesSection({ user }) {
  const [selectedClass, setSelectedClass] =
    useState(null);

  return (
    <section className="dashboard">
      <div className="container">

        <PageHeader
          title="Classes"
          description="Select a class to view top performers, failed students and passing percentage."
        />

        {!selectedClass ? (
          <div className="portal-card-grid">

            {CLASSES.map((className) => (
              <button
                key={className}
                className="portal-card"
                onClick={() =>
                  setSelectedClass(className)
                }
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'inherit',
                }}
              >
                <div className="portal-card-icon">
                  <School size={23} />
                </div>

                <div className="portal-card-content">
                  <div className="portal-card-kicker">
                    ACADEMIC CLASS
                  </div>

                  <h3>{className}</h3>

                  <p>
                    Click to open class performance.
                  </p>
                </div>

                <div className="portal-card-arrow">
                  <ArrowRight size={19} />
                </div>
              </button>
            ))}

          </div>
        ) : (
          <ClassPerformance
            className={selectedClass}
            user={user}
            onBack={() =>
              setSelectedClass(null)
            }
          />
        )}

      </div>
    </section>
  );
}

function ClassPerformance({
  className,
  user,
  onBack,
}) {
  const [passing, setPassing] =
    useState(50);

  const [data, setData] = useState({
    topStudents: [],
    failedStudents: [],
    totalStudents: 0,
  });

  const [loading, setLoading] =
    useState(true);

  async function load() {
    setLoading(true);

    try {
      const r = await fetch(
        `${API}/dashboard/classes/${encodeURIComponent(
          className
        )}?passingPercentage=${passing}`,
        {
          credentials: 'include',
        }
      );

      const x = await r.json();

      if (r.ok) {
        setData({
          topStudents:
            x.topStudents || [],
          failedStudents:
            x.failedStudents || [],
          totalStudents:
            x.totalStudents || 0,
        });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [className, passing]);

  return (
    <div>

      <button
        className="btn ghost"
        onClick={onBack}
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={16} />
        Classes
      </button>

      <div className="card feature">
        <div className="eyebrow">
          CLASS PERFORMANCE
        </div>

        <h2>{className}</h2>

        <p>
          Total Students: {data.totalStudents}
        </p>

        <label
          style={{
            display: 'block',
            marginTop: 20,
            maxWidth: 350,
          }}
        >
          <strong>
            Passing Percentage
          </strong>

          <input
            type="number"
            min="1"
            max="100"
            value={passing}
            onChange={(e) =>
              setPassing(
                Number(e.target.value)
              )
            }
            style={{
              width: '100%',
              marginTop: 8,
            }}
          />

          <small
            style={{
              color: 'var(--muted)',
            }}
          >
            Is percentage se kam average wale
            students failed mein show honge.
          </small>
        </label>
      </div>

      {loading ? (
        <LoadingCard />
      ) : (
        <>
          <div
            className="card"
            style={{
              padding: 22,
              marginTop: 20,
            }}
          >
            <div className="eyebrow">
              TOP 5
            </div>

            <h2>
              Top 5 Students
            </h2>

            {data.topStudents.length ===
            0 ? (
              <p>
                No grade records available.
              </p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.topStudents.map(
                      (student, index) => (
                        <tr
                          key={
                            student._id ||
                            index
                          }
                        >
                          <td>
                            {index + 1}
                          </td>

                          <td>
                            {student.name}
                          </td>

                          <td>
                            {student.className}
                          </td>

                          <td>
                            <strong>
                              {
                                student.percentage
                              }
                              %
                            </strong>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div
            className="card"
            style={{
              padding: 22,
              marginTop: 20,
            }}
          >
            <div className="eyebrow">
              FAILED STUDENTS
            </div>

            <h2>
              Failed Students
            </h2>

            {data.failedStudents.length ===
            0 ? (
              <p>
                No failed students at the selected
                passing percentage.
              </p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Percentage</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.failedStudents.map(
                      (student) => (
                        <tr
                          key={student._id}
                        >
                          <td>
                            {student.name}
                          </td>

                          <td>
                            {student.percentage}%
                          </td>

                          <td>
                            <strong>
                              Failed
                            </strong>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function PageHeader({
  title,
  description,
}) {
  return (
    <div
      className="section-head"
      style={{
        alignItems: 'start',
        marginBottom: 25,
      }}
    >
      <div>

        <Link
          href="/dashboard"
          className="btn ghost"
          style={{
            marginBottom: 20,
          }}
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>

        <div className="eyebrow">
          AL-Hammad ACADEMY
        </div>

        <h1
          style={{
            fontSize:
              'clamp(38px,6vw,66px)',
            marginTop: 10,
          }}
        >
          {title}
        </h1>

        <p
          className="lead"
          style={{
            maxWidth: 720,
          }}
        >
          {description}
        </p>

      </div>
    </div>
  );
}

function LoadingPage() {
  return (
    <section className="dashboard">
      <div className="container">
        <LoadingCard />
      </div>
    </section>
  );
}

function LoadingCard() {
  return (
    <div className="card feature">
      <h3>Loading…</h3>
      <p>
        Fetching the latest academy records.
      </p>
    </div>
  );
}

function EmptyCard({ text }) {
  return (
    <div className="card feature">
      <h3>Nothing here yet</h3>
      <p>{text}</p>
    </div>
  );
}

function Forbidden() {
  return (
    <section className="dashboard">
      <div className="container">
        <div className="card feature">
          <h2>Access Denied</h2>
          <p>
            You do not have permission to open
            this section.
          </p>
        </div>
      </div>
    </section>
  );
}