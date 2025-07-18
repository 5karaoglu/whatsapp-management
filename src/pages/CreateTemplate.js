import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import axios from 'axios';

const templateCategories = ['TRANSACTIONAL', 'MARKETING', 'AUTHENTICATION'];
const templateLanguages = ['en_US', 'es_MX', 'pt_BR', 'tr']; // Example languages

const CreateTemplate = () => {
  const [formState, setFormState] = useState({
    name: '',
    language: 'en_US',
    category: 'MARKETING',
    headerText: '',
    bodyText: '',
    footerText: '',
  });
  const [feedback, setFeedback] = useState({ type: '', message: '', details: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    // Template names must be lowercase and use underscores
    const formattedName = formState.name.toLowerCase().replace(/\s+/g, '_');

    try {
      const response = await axios.post('http://localhost:5001/api/create-template', { ...formState, name: formattedName });
      setFeedback({ type: 'success', message: response.data.message });
      // Reset form
      setFormState({ name: '', language: 'en_US', category: 'MARKETING', headerText: '', bodyText: '', footerText: '' });
    } catch (error) {
      const errorData = error.response?.data;
      setFeedback({
        type: 'error',
        message: `${errorData?.message} - ${errorData?.error?.error_user_title || ''}`,
        details: errorData?.error?.error_user_msg || 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Message Template
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Design a new message template for WhatsApp. Once approved by Meta, you can use it to message users.
        <br />
        Note: Template names must be unique. Use only lowercase letters, numbers, and underscores.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Template Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formState.name}
              onChange={handleChange}
              required
              helperText="e.g., order_confirmation"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Language</InputLabel>
              <Select name="language" value={formState.language} label="Language" onChange={handleChange}>
                {templateLanguages.map(lang => <MenuItem key={lang} value={lang}>{lang}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select name="category" value={formState.category} label="Category" onChange={handleChange}>
                {templateCategories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="headerText"
              label="Header Text (Optional)"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formState.headerText}
              onChange={handleChange}
              helperText="A title or header for your message."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="bodyText"
              label="Body Text"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={6}
              value={formState.bodyText}
              onChange={handleChange}
              required
              helperText="The main content of your message. Use {{1}}, {{2}} for variables."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="footerText"
              label="Footer Text (Optional)"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formState.footerText}
              onChange={handleChange}
              helperText="A short line of text at the bottom of the message."
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, position: 'relative' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || !formState.name || !formState.bodyText}
          >
            Create Template
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }}
            />
          )}
        </Box>
      </Box>
      {feedback.message && (
        <Alert severity={feedback.type} sx={{ mt: 3 }}>
          <Typography variant="h6">{feedback.message}</Typography>
          <Typography variant="body2">{feedback.details}</Typography>
        </Alert>
      )}
    </Paper>
  );
};

export default CreateTemplate; 