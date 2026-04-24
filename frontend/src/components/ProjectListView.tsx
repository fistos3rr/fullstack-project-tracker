import type { ProjectRead } from '../api';
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  ButtonGroup,
  Chip
} from '@mui/material';

interface ProjectListViewProps {
  projects: ProjectRead[];
  totalPages: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isDeleting?: boolean;
  error: Error | null;
  onDelete: (id: string) => void;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onCreate: () => void;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
}

export function ProjectListView({
  projects,
  totalPages,
  page,
  limit,
  isLoading,
  isDeleting,
  error,
  onDelete,
  onPageChange,
  onLimitChange,
  onCreate,
  onDetails,
  onEdit,
}: ProjectListViewProps) {
  if (isLoading) {
    return (
      <Box sx={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Ошибка: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Заголовок и кнопка создания */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Проекты
        </Typography>
        <Button variant="contained" onClick={onCreate}>
          + Новый проект
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Alert severity="info">Нет проектов. Создайте первый проект.</Alert>
      ) : (
        <>
          {/* Список проектов в виде карточек */}
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {project.description || 'Без описания'}
                    </Typography>
                    <Chip
                        label={`Статус: ${project.status}`}
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 1 }}
                        />
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', gap: 1, p: 2, pt: 0 }}>
                      <ButtonGroup 
                            orientation="vertical"
                            variant="outlined" 
                            size="small" 
                            fullWidth
                        >
                            <Button size="small" onClick={() => onDetails(project.id)}>
                            Открыть
                            </Button>
                            <Button size="small" onClick={() => onEdit(project.id)}>
                            Редактировать
                            </Button>
                            <Button
                            size="small"
                            color="error"
                            onClick={() => onDelete(project.id)}
                            disabled={isDeleting}
                            >
                            Удалить
                            </Button>
                    </ButtonGroup>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Пагинация и выбор лимита */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 4,
              gap: 2,
            }}
          >
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="limit-select-label">Показывать на странице</InputLabel>
              <Select
                labelId="limit-select-label"
                value={limit}
                label="Показывать на странице"
                onChange={(e) => onLimitChange(Number(e.target.value))}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              count={totalPages || 1}
              page={page}
              onChange={(_, newPage) => onPageChange(newPage)}
              color="primary"
              showFirstButton
              showLastButton
              disabled={totalPages === 0}
            />
          </Box>
        </>
      )}
    </Box>
  );
}