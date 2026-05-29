import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import ParticleCanvas from '../ParticleCanvas';

export default function PublicLayout() {
  return (
    <>
      <ParticleCanvas />
      <PublicHeader />
      <main className="relative z-10 min-h-screen">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}
