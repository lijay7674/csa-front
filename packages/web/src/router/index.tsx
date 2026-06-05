import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import News from '../pages/News';
import Register from '../pages/Register';
import CompetitionNotices from '../pages/CompetitionNotices';
import Members from '../pages/Members';
import Tech from '../pages/Tech';
import QuestionBank from '../pages/QuestionBank';
import Recruitment from '../pages/Recruitment';
import Contact from '../pages/Contact';
import Events from '../pages/Events';
import Competitions from '../pages/Competitions';
import NotFound from '../pages/NotFound';
import CompetitionResults from '../pages/CompetitionResults';
import { RegisterQuery } from '../pages/Placeholder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'news', element: <News /> },
      { path: 'news/:id', element: <News /> },
      { path: 'events', element: <Events /> },
      { path: 'events/:id', element: <Events /> },
      { path: 'competitions', element: <Competitions /> },
      { path: 'competitions/:id', element: <Competitions /> },
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
