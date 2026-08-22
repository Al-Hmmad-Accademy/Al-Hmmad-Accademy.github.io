import DashboardSection from './DashboardSection';

export function generateStaticParams() {
  return [
    { section: 'students' },
    { section: 'teachers' },
    { section: 'grades' },
    { section: 'fees' },
    { section: 'announcements' },
    { section: 'books' },
    { section: 'tests' },
    { section: 'files' },
    { section: 'profile' },
    { section: 'classes' },
    { section: 'chat' },
  ];
}

export default function Page() {
  return <DashboardSection />;
}