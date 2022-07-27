import { Navigate, Route, Routes } from 'react-router-dom';
import { SignedIn, SignedOut } from './components/controlComponents';
import { Layout } from './components/Layout';
import { AddQuestions } from './pages/AddQuestions';
import { CreateQuiz } from './pages/CreateQuiz';
import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';
import { PlayerScreen } from './pages/PlayerScreen';
import { Quizes } from './pages/Quizes';
import { SignInPage } from './pages/SignIn';
import SignUpPage from './pages/Signup';
import { UpdateQuestion } from './pages/UpdateQuestion';
import { UpdateQuiz } from './pages/UpdateQuiz';
import { UserProfilePage } from './pages/UserProfile';

function App() {
  return (
    <Layout>
      <SignedIn>
        <Routes>
          <Route path='/quizes' element={<Quizes />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/quizes/add' element={<CreateQuiz />} />
          <Route path='/quizes/:id/update' element={<UpdateQuiz />} />
          <Route path='/quizes/:id/questions' element={<AddQuestions />} />
          <Route path='/quizes/:id/play' element={<PlayerScreen />} />
          <Route
            path='/quizes/:quizId/questions/:questionId'
            element={<UpdateQuestion />}
          />
          <Route path='/user' element={<UserProfilePage />} />
          <Route path='/' element={<Navigate replace to='/quizes' />} />
        </Routes>
      </SignedIn>
      <SignedOut>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/sign-in' element={<SignInPage />} />
          <Route path='/quizes/:id/play' element={<PlayerScreen />} />
          <Route path='*' element={<Navigate replace to='/' />} />
        </Routes>
      </SignedOut>
    </Layout>
  );
}

export default App;
