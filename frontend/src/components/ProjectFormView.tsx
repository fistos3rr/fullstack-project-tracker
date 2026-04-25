import { ProjectStatus } from '../api';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Tooltip,
} from '@mui/material';

interface ProjectFormViewProps {
  name: string;
  description: string;
  status: ProjectStatus;
  isEdit: boolean;
  isLoading?: boolean;
  isSubmitting?: boolean;
  isCompleted?: boolean;
  error?: string | null;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onStatusChange: (value: ProjectStatus) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ProjectFormView({
  name,
  description,
  status,
  isEdit,
  isLoading,
  isSubmitting,
  isCompleted,
  error,
  onNameChange,
  onDescriptionChange,
  onStatusChange,
  onSubmit,
  onCancel,
}: ProjectFormViewProps) {
  if (isLoading) {
    return (
      <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", minHeight:"60vh"}}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEdit ? 'Change project' : 'Create project'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          fullWidth
          variant="outlined"
          disabled={isSubmitting}
          helperText="Necessary"
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          disabled={isSubmitting}
        />

        <FormControl fullWidth variant="outlined" disabled={isSubmitting}>
          <InputLabel id="status-label" required>Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ProjectStatus)}
            label="Status"
            required
          >
            {Object.values(ProjectStatus).map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
		    <Tooltip title={isCompleted ? "Project completed – cannot be saved" : ""}>
				<span>
				  <Button 
					type="submit" 
					variant="contained" 
					disabled={isSubmitting || isCompleted}
				  >
					{isSubmitting ? <CircularProgress size={24} /> : 'Save'}
				  </Button>
				</span>
			</Tooltip>
        </Box>
      </Stack>
    </Box>
  );
}