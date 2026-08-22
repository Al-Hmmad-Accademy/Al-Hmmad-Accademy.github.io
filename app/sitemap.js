export const dynamic = 'force-static';

export default function sitemap() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  return [
    '',
    'about',
    'faculty',
    'programs',
    'contact',
    'location',
    'admission',
    'books',
    'login',
  ].map((path) => ({
    url: `${base}/${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}