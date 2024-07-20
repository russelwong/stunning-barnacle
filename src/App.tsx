import React from 'react';
import Index from './components/Index';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <QueryClientProvider client={queryClient}>
          <Index />
        </QueryClientProvider>
      </header>
    </div>
  );
}

export default App;
