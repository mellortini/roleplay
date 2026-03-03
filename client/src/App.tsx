import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Lobby } from './pages/Lobby';
import { Characters } from './pages/Characters';
import { CreateCharacter } from './pages/CreateCharacter';
import { GenerateCharacter } from './pages/GenerateCharacter';
import { CreateSession } from './pages/CreateSession';
import { GameRoom } from './pages/GameRoom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="lobby" element={
          <ProtectedRoute>
            <Lobby />
          </ProtectedRoute>
        } />
        <Route path="characters" element={
          <ProtectedRoute>
            <Characters />
          </ProtectedRoute>
        } />
        <Route path="characters/create" element={
          <ProtectedRoute>
            <CreateCharacter />
          </ProtectedRoute>
        } />
        <Route path="characters/generate" element={
          <ProtectedRoute>
            <GenerateCharacter />
          </ProtectedRoute>
        } />
        <Route path="sessions/create" element={
          <ProtectedRoute>
            <CreateSession />
          </ProtectedRoute>
        } />
        <Route path="sessions/:id" element={
          <ProtectedRoute>
            <GameRoom />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;
