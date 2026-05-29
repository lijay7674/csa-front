import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Placeholder from '../pages/Placeholder';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },

      // 内容管理
      { path: 'content', element: <Placeholder title="内容管理" /> },
      { path: 'content/new', element: <Placeholder title="新建内容" /> },
      { path: 'content/:id/edit', element: <Placeholder title="编辑内容" /> },
      { path: 'content/review', element: <Placeholder title="内容审核" /> },
      { path: 'content/members', element: <Placeholder title="优秀成员展示管理" /> },
      { path: 'content/results', element: <Placeholder title="竞赛成果展示管理" /> },

      // 数据管理
      { path: 'members', element: <Placeholder title="成员管理" /> },
      { path: 'members/cadres', element: <Placeholder title="干部任职管理" /> },
      { path: 'events', element: <Placeholder title="活动管理" /> },
      { path: 'competitions', element: <Placeholder title="竞赛管理" /> },
      { path: 'registrations', element: <Placeholder title="报名管理" /> },

      // 题库
      { path: 'question-bank', element: <Placeholder title="题库管理" /> },

      // 权限
      { path: 'users', element: <Placeholder title="权限管理" /> },

      // 统计
      { path: 'statistics', element: <Placeholder title="统计查询" /> },

      // 404
      { path: '*', element: <Placeholder title="页面未找到" /> },
    ],
  },
]);
