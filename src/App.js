import './App.scss';
import { GithubProvider } from './context/GithubContext';
import Container from './components/Container/Container';

function App() {
  return (
    <GithubProvider>
      <Container />
    </GithubProvider>
  );
}

export default App;
