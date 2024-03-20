import { Routes, Route } from 'react-router-dom';
import Authentication from './pages/authentication/Authentication.tsx';
import MainPage from './pages/main-page/MainPage.tsx';
import { Container } from '@mui/material';
import Header from './components/header/Header.tsx';

export default function App() {
  return (
    <>
      <Header />
      <Container
        component="main"
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'grid',
          justifyContent: 'center',
        }}
      >
        <Routes>
          <Route path={''} element={<MainPage />} />
          <Route path={'/auth'} element={<Authentication />} />
        </Routes>
      </Container>
    </>
  );
}
