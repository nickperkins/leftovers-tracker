import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import client from './lib/apolloClient';
import Dashboard from './components/Dashboard';
import LeftoverForm from './components/LeftoverForm';
import LeftoverDetails from './components/LeftoverDetails';
import Layout from './components/Layout';
import { ThemeProviderWrapper } from './providers/ThemeProvider';

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProviderWrapper>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<LeftoverForm />} />
              <Route path="/edit/:id" element={<LeftoverForm />} />
              <Route path="/details/:id" element={<LeftoverDetails />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProviderWrapper>
    </ApolloProvider>
  );
}

export default App;
