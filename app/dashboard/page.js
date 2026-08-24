'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Megaphone,
  School,
  UserCircle,
  Users,
  WalletCards,
} from 'lucide-react';

import { useAuth } from '../../components/AuthProvider';

const API =
  process.env.NEXT_PUBLIC_API_URL || 'https://steps-accademy-backend-production.up.railway.app/api';
  
const SECTIONS = [
  {
    key: 'students',
    title: 'Students',
    description: 'Manage academy students and their accounts.',
    icon: Users,
    roles: ['admin'],
  },
  {
    key: 'teachers',
    title: 'Teachers',
    description: 'Manage teachers, subjects and teacher accounts.',
    icon: GraduationCap,
    roles: ['admin'],
  },
  {
    key: 'grades',
    title: 'Grades & Reports',
    description: 'View academic results and performance reports.',
    icon: BarChart3,
    roles: ['admin', 'teacher', 'student'],
  },
  {
    key: 'announcements',
    title: 'Announcements',
    description: 'View and publish academy announcements.',
    icon: Megaphone,
    roles: ['admin', 'teacher', 'student'],
  },
  {
    key: 'books',
    title: 'Books',
    description: 'Access academic books and PDF resources.',
    icon: BookOpen,
    roles: ['admin', 'teacher', 'student'],
  },
  {
    key: 'fees',
    title: 'Fees',
    description: 'View and manage student fee records.',
    icon: WalletCards,
    roles: ['admin', 'student'],
  },
  {
    key: 'classes',
    title: 'Classes',
    description: 'View class performance, top students and failures.',
    icon: School,
    roles: ['admin', 'teacher', 'student'],
  },
  {
    key: 'tests',
    title: 'Tests',
    description: 'View and manage academy tests.',
    icon: ClipboardCheck,
    roles: ['admin', 'teacher', 'student'],
  },
  {
    key: 'files',
    title: 'Files',
    description: 'Access academic files and study material.',
    icon: FileText,
    roles: ['admin', 'teacher', 'student'],
  },
  {
    key: 'profile',
    title: 'Profile',
    description: 'View and update your academy profile.',
    icon: UserCircle,
    roles: ['admin', 'teacher', 'student'],
  },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    announcements: 0,
    pending: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadStats() {
      try {
        setLoadingStats(true);

        let url = `${API}/dashboard/${user.role}`;

        if (user.role === 'admin') {
          url = `${API}/admin/stats`;
        }

        const response = await fetch(url, {
          credentials: 'include',
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          setStats({
            totalStudents: data.totalStudents || 0,
            totalTeachers: data.totalTeachers || 0,
            announcements:
              data.announcements ||
              data.announcementList?.length ||
              0,
            pending: data.pending || 0,
          });
        }
      } catch (error) {
        console.error('Dashboard stats error:', error);
      } finally {
        setLoadingStats(false);
      }
    }

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <section className="dashboard">
        <div className="container">
          <div className="card feature">
            <h3>Loading dashboard…</h3>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="dashboard">
        <div className="container">
          <div className="card feature">
            <h2>Please login first.</h2>
            <Link href="/login" className="btn primary">
              Login →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const role = String(user.role || '').toLowerCase();

  const visibleSections = SECTIONS.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <section className="dashboard">
      <div className="container">

        {/* TOP STATS */}

        <div className="portal-card-grid dashboard-stats">

          {role === 'admin' && (
            <>
              <StatCard
                title="Students"
                value={
                  loadingStats
                    ? '...'
                    : stats.totalStudents
                }
                icon={Users}
                href="/dashboard/students"
              />

              <StatCard
                title="Teachers"
                value={
                  loadingStats
                    ? '...'
                    : stats.totalTeachers
                }
                icon={GraduationCap}
                href="/dashboard/teachers"
              />

              <StatCard
                title="Announcements"
                value={
                  loadingStats
                    ? '...'
                    : stats.announcements
                }
                icon={Megaphone}
                href="/dashboard/announcements"
              />

              <StatCard
                title="Pending"
                value={
                  loadingStats
                    ? '...'
                    : stats.pending
                }
                icon={ClipboardCheck}
                href="/dashboard/announcements"
              />
            </>
          )}

          {role === 'teacher' && (
            <TeacherStats />
          )}

          {role === 'student' && (
            <StudentStats />
          )}

        </div>

        {/* SECTION CARDS */}

        <div
          className="portal-card-grid"
          style={{ marginTop: 28 }}
        >
          {visibleSections.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={`/dashboard/${item.key}`}
                className="portal-card"
              >
                <div className="portal-card-icon">
                  <Icon size={23} />
                </div>

                <div className="portal-card-content">

                  <div className="portal-card-kicker">
                    {role.toUpperCase()}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                </div>

                <div className="portal-card-arrow">
                  <ArrowRight size={19} />
                </div>

              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  href,
}) {
  return (
    <Link
      href={href}
      className="portal-card"
      style={{ minHeight: 225 }}
    >
      <div className="portal-card-icon">
        <Icon size={23} />
      </div>

      <div className="portal-card-content">

        <div className="portal-card-kicker">
          {title.toUpperCase()}
        </div>

        <h3
          style={{
            fontSize: 30,
            marginBottom: 5,
          }}
        >
          {value}
        </h3>

        <p>{title}</p>

      </div>

      <div className="portal-card-arrow">
        <ArrowRight size={19} />
      </div>

    </Link>
  );
}

function TeacherStats() {
  const [data, setData] = useState({
    tests: 0,
    files: 0,
    announcements: 0,
  });

  useEffect(() => {
    fetch(`${API}/dashboard/teacher`, {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((x) => {
        setData({
          tests: x.tests || 0,
          files: x.files || 0,
          announcements: x.announcements || 0,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <StatCard
        title="My Tests"
        value={data.tests}
        icon={ClipboardCheck}
        href="/dashboard/tests"
      />

      <StatCard
        title="My Files"
        value={data.files}
        icon={FileText}
        href="/dashboard/files"
      />

      <StatCard
        title="Announcements"
        value={data.announcements}
        icon={Megaphone}
        href="/dashboard/announcements"
      />

      <StatCard
        title="Classes"
        value="→"
        icon={School}
        href="/dashboard/classes"
      />
    </>
  );
}

function StudentStats() {
  const [data, setData] = useState({
    tests: 0,
    files: 0,
    grades: 0,
    feeStatus: 'unpaid',
  });

  useEffect(() => {
    fetch(`${API}/dashboard/student`, {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((x) => {
        setData({
          tests: x.tests || 0,
          files: x.files || 0,
          grades: x.latestGrades?.length || 0,
          feeStatus: x.feeStatus || 'unpaid',
        });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <StatCard
        title="My Grades"
        value={data.grades}
        icon={BarChart3}
        href="/dashboard/grades"
      />

      <StatCard
        title="Tests"
        value={data.tests}
        icon={ClipboardCheck}
        href="/dashboard/tests"
      />

      <StatCard
        title="Files"
        value={data.files}
        icon={FileText}
        href="/dashboard/files"
      />

      <StatCard
        title="Fees"
        value={data.feeStatus}
        icon={WalletCards}
        href="/dashboard/fees"
      />
    </>
  );
}