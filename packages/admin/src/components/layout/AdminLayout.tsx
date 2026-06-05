import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const navigate = useNavigate();

  // 简单 token 检查（后续完善）
  const token = localStorage.getItem('csa-admin-token');
  if (!token) {
    // 不在登录页则跳转
    if (window.location.pathname !== '/login') {
      navigate('/login', { replace: true });
      return null;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
