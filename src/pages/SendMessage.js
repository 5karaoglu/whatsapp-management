import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import axios from 'axios';

const SendMessage = () => {
  const [messageType, setMessageType] = useState('text');
  
  // State for Text Message
  const [recipientNumber, setRecipientNumber] = useState('');
  const [messageText, setMessageText] = useState('');

  // State for Template Message
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateVariables, setTemplateVariables] = useState({});
  
  // Common State
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  useEffect(() => {
    if (messageType === 'template') {
      setTemplatesLoading(true);
      axios.get('http://localhost:5001/api/templates', { params: { status: 'APPROVED' } })
        .then(response => {
          setTemplates(response.data.data);
        })
        .catch(error => {
          setFeedback({ type: 'error', message: 'Failed to load approved templates.' });
        })
        .finally(() => {
          setTemplatesLoading(false);
        });
    }
  }, [messageType]);

  const handleMessageTypeChange = (event, newType) => {
    if (newType !== null) {
      setMessageType(newType);
      // Reset forms
      setRecipientNumber('');
      setMessageText('');
      setSelectedTemplate('');
      setTemplateVariables({});
      setFeedback({ type: '', message: '' });
    }
  };

  const handleTemplateChange = (e) => {
    const templateName = e.target.value;
    setSelectedTemplate(templateName);
    setTemplateVariables({}); // Reset variables on new template selection
  };
  
  const handleVariableChange = (e, varName) => {
    setTemplateVariables(prev => ({...prev, [varName]: e.target.value}));
  }

  const getTemplateBody = () => {
    if (!selectedTemplate) return null;
    const template = templates.find(t => t.name === selectedTemplate);
    const bodyComponent = template?.components.find(c => c.type === 'BODY');
    return bodyComponent?.text || null;
  };
  
  const getVariableCount = () => {
    const body = getTemplateBody();
    if(!body) return 0;
    return (body.match(/\{\{/g) || []).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    const payload = { recipientNumber, messageType };

    if (messageType === 'text') {
      payload.messageText = messageText;
    } else {
      const templateData = templates.find(t => t.name === selectedTemplate);
      const components = [];
      const variableCount = getVariableCount();

      // Only add body component if there are variables to substitute
      if (variableCount > 0) {
        const parameters = Array.from({ length: variableCount }, (_, i) => ({
            type: 'text',
            text: templateVariables[`var${i + 1}`] || ''
        }));
        components.push({ type: 'body', parameters });
      }

      payload.template = {
        name: selectedTemplate,
        language: templateData.language,
        components
      };
    }

    try {
      const response = await axios.post('http://localhost:5001/api/send-message', payload);
      setFeedback({ type: 'success', message: response.data.message });
      // Clear inputs
      setRecipientNumber('');
      setMessageText('');
      setSelectedTemplate('');
      setTemplateVariables({});
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const variableCount = getVariableCount();
  const isTemplateFormInvalid = messageType === 'template' && (!selectedTemplate || Object.keys(templateVariables).length !== variableCount || Object.values(templateVariables).some(v => !v));

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Send WhatsApp Message
      </Typography>
      
      <ToggleButtonGroup
        color="primary"
        value={messageType}
        exclusive
        onChange={handleMessageTypeChange}
        aria-label="message type"
        sx={{ mb: 3 }}
      >
        <ToggleButton value="text">Simple Text</ToggleButton>
        <ToggleButton value="template">Use Template</ToggleButton>
      </ToggleButtonGroup>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Recipient Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={recipientNumber}
          onChange={(e) => setRecipientNumber(e.target.value)}
          required
          helperText="e.g., 14155552671 (with country code)"
        />

        {messageType === 'text' ? (
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            required
          />
        ) : (
          <>
            <FormControl fullWidth margin="normal" disabled={templatesLoading}>
              <InputLabel>Select a Template</InputLabel>
              <Select value={selectedTemplate} label="Select a Template" onChange={handleTemplateChange}>
                {templatesLoading ? <MenuItem disabled><em>Loading templates...</em></MenuItem> :
                 templates.map(t => <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>)}
              </Select>
            </FormControl>
            
            {selectedTemplate && (
              <Box sx={{ my: 2, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                <Typography variant="caption">Template Body:</Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{getTemplateBody()}</Typography>
              </Box>
            )}

            <Grid container spacing={2}>
              {Array.from({ length: variableCount }, (_, i) => (
                <Grid item xs={12} sm={6} key={i}>
                    <TextField
                      label={`Variable {{${i + 1}}}`}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={templateVariables[`var${i + 1}`] || ''}
                      onChange={(e) => handleVariableChange(e, `var${i + 1}`)}
                      required
                    />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Box sx={{ mt: 2, position: 'relative' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || !recipientNumber || (messageType === 'text' && !messageText) || isTemplateFormInvalid}
          >
            Send Message
          </Button>
          {loading && (
            <CircularProgress size={24} sx={{position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px'}}/>
          )}
        </Box>
      </Box>

      {feedback.message && (
        <Alert severity={feedback.type} sx={{ mt: 3 }}>
          {feedback.message}
        </Alert>
      )}
    </Paper>
  );
};

export default SendMessage; 