import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import SendMessage from './pages/SendMessage';
import CreateTemplate from './pages/CreateTemplate';
import ListTemplates from './pages/ListTemplates';

function App() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/" element={<SendMessage />} />
            <Route path="/templates" element={<CreateTemplate />} />
            <Route path="/templates/list" element={<ListTemplates />} />
          </Routes>
        </Box>
      </Container>
    </>
  );
}

export default App; 