import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const statusColors = {
  APPROVED: 'success',
  PENDING: 'warning',
  REJECTED: 'error',
};

const ListTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      const response = await axios.get('http://localhost:5001/api/templates', { params });
      setTemplates(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch templates.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleFilterChange = (event, newValue) => {
    setStatusFilter(newValue);
  };

  const getComponentText = (components, type) => {
    const component = components.find(c => c.type === type);
    return component ? component.text : 'N/A';
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Message Templates
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={statusFilter} onChange={handleFilterChange} aria-label="template status filter">
          <Tab label="All" value="ALL" />
          <Tab label="Approved" value="APPROVED" />
          <Tab label="Pending" value="PENDING" />
          <Tab label="Rejected" value="REJECTED" />
        </Tabs>
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      {!loading && !error && (
        <List>
          {templates.length > 0 ? (
            templates.map((template, index) => (
              <Accordion key={template.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography sx={{ flexShrink: 0, fontWeight: 'bold' }}>{template.name}</Typography>
                    <Chip 
                      label={template.status} 
                      color={statusColors[template.status] || 'default'} 
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemText primary="Language" secondary={template.language} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText primary="Category" secondary={template.category} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText primary="Header" secondary={getComponentText(template.components, 'HEADER')} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText primary="Body" secondary={getComponentText(template.components, 'BODY')} sx={{ '& .MuiListItemText-secondary': { whiteSpace: 'pre-wrap' } }}/>
                    </ListItem>
                     <Divider />
                    <ListItem>
                      <ListItemText primary="Footer" secondary={getComponentText(template.components, 'FOOTER')} />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography sx={{ mt: 4, textAlign: 'center' }}>No templates found for this filter.</Typography>
          )}
        </List>
      )}
    </Paper>
  );
};

export default ListTemplates; 