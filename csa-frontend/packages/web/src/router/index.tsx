import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import Home from '../pages/Home';
import News from '../pages/News';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import {
  About,
  CompetitionResults,
  CompetitionNotices,
  Members,
  Tech,
  QuestionBank,
  Recruitment,
  RegisterQuery,
  Contact,
} from '../pages/Placeholder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'news', element: <News /> },
      { path: 'news/:id', element: <News /> },
      { path: 'competition/notices', element: <CompetitionNotices /> },
      { path: 'competition/notices/:id', element: <CompetitionNotices /> },
      { path: 'competition/results', element: <CompetitionResults /> },
      { path: 'tech', element: <Tech /> },
      { path: 'tech/:id', element: <Tech /> },
      { path: 'question-bank', element: <QuestionBank /> },
      { path: 'members', element: <Members /> },
      { path: 'recruitment', element: <Recruitment /> },
      { path: 'register', element: <Register /> },
      { path: 'register/:type', element: <Register /> },
      { path: 'register/query', element: <RegisterQuery /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
