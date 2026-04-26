import { type ProjectRead, type ProjectChangeLog, type ProjectCommentRead, ProjectStatus } from '../api';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import CommentIcon from '@mui/icons-material/Comment';

interface ProjectDetailViewProps {
  project: ProjectRead;
  logs: ProjectChangeLog[];
  comments: ProjectCommentRead[];
  isLoading?: boolean;
  isSubmitting?: boolean;
  content: string;
  onContentChange: (value: string) => void;
  onSubmitComment: (e: React.FormEvent) => void;
  onGoBack: () => void;
  onGoToEdit: () => void;
}

export function ProjectDetailView({
  project,
  logs,
  comments,
  isLoading,
  isSubmitting,
  content,
  onContentChange,
  onSubmitComment,
  onGoBack,
  onGoToEdit,
}: ProjectDetailViewProps) {
  if (isLoading) {
    return (
      <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", minHeight:"60vh"}}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Project not found
      </Alert>
    );
  }

  const isCompleted = project.status == ProjectStatus.completed

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Buttons */}
      <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mb:3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onGoBack}>
          Cancel
        </Button>
        <Tooltip title={isCompleted ? "Project completed – cannot be changed" : ""}>
          <span>
            <Button variant="contained" startIcon={<EditIcon />} onClick={onGoToEdit} disabled={isCompleted}>
              Change project
            </Button>
          </span> 
        </Tooltip>
      </Box>

      {/* Project card */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {project.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {project.description || 'No description'}
        </Typography>
        <Chip
          label={`Status: ${project.status}`}
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Paper>

      {/* Comments */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CommentIcon color="action" />
          <Typography variant="h6">Comments</Typography>
        </Box>
        {comments.length ? (
          <List disablePadding>
            {comments.map((c, idx) => (
              <Box key={c.id}>
                {idx > 0 && <Divider />}
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={c.content}
                    secondary={new Date(c.created_at).toLocaleString()}
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb:2 }}>
            There is no comments.
          </Typography>
        )}

        {/* Comment form */}
        <Box component="form" onSubmit={onSubmitComment} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Comment..."
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              disabled={isSubmitting}
              multiline
              rows={2}
            />
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={isSubmitting || !content.trim()}
              sx={{ mt: 1 }}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Logs */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <HistoryIcon color="action" />
          <Typography variant="h6">Logs</Typography>
        </Box>
        {logs.length ? (
          <List disablePadding>
            {logs.map((log, idx) => (
              <Box key={log.id}>
                {idx > 0 && <Divider />}
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" component="span">
                        {log.field_name || 'Field'}
                      </Typography>
                    }
                    secondary={
                      <>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                          Old: "{log.old_value || 'old_value'}"
                        </Typography> 
                        <Typography variant="body2" color="text.secondary">
                          New: "{log.new_value || 'new_value'}"
                        </Typography> 
                        
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {log.changed_at ? new Date(log.changed_at).toLocaleString() : "-"}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No changes
          </Typography>
        )}
      </Paper>
    </Box>
  );
}