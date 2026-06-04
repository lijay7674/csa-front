import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ContentList from '../pages/ContentList';
import ContentForm from '../pages/ContentForm';
import MemberList from '../pages/MemberList';
import CadreList from '../pages/CadreList';
import RegistrationList from '../pages/RegistrationList';
import { EventList, CompetitionList, QuestionBankList, StatisticsPage, DisplayMembers, DisplayResults } from '../pages/AdminModules';
import UsersPage from '../pages/UsersPage';

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      // 内容管理
      { path: 'content', element: <ContentList /> },
      { path: 'content/new', element: <ContentForm /> },
      { path: 'content/:id/edit', element: <ContentForm /> },
      { path: 'content/review', element: <ContentList reviewMode /> },
      { path: 'content/members', element: <DisplayMembers /> },
      { path: 'content/results', element: <DisplayResults /> },
      // 数据管理
      { path: 'members', element: <MemberList /> },
      { path: 'members/cadres', element: <CadreList /> },
      { path: 'events', element: <EventList /> },
      { path: 'competitions', element: <CompetitionList /> },
      { path: 'registrations', element: <RegistrationList /> },
      // 其他
      { path: 'question-bank', element: <QuestionBankList /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'statistics', element: <StatisticsPage /> },
    ],
  },
]);
