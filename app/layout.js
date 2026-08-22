import './globals.css';
import { SiteProviders } from '../components/SiteProviders';

export const metadata = {
  title: { default: 'AALIYAAN SCIENCES ACADEMY | Academic Excellence', template: '%s | AALIYAAN SCIENCES ACADEMY' },
  description: 'A premium academic environment for concept-based learning, experienced faculty and disciplined preparation.',
  keywords: ['Aaliyaan Sciences Academy','academy','education','school','students','teachers','Pakistan'],
  openGraph: { title:'AALIYAAN SCIENCES ACADEMY', description:'Where ambition becomes achievement.', type:'website' }
};
export default function RootLayout({children}){return <html lang="en"><body><SiteProviders>{children}</SiteProviders></body></html>}
