// src/components/Enrollments/EnrollmentList.tsx
import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  Dialog,
  TextField,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EnrollmentForm from './EnrollmentForm';
import { useEnrollments } from '../../hooks/useEnrollments';
import { useAthletes } from '../../hooks/useAthletes';
import { useClasses } from '../../hooks/useClasses';
import { format } from 'date-fns';

export default function EnrollmentList() {
  const { enrollments, isLoading, deleteEnrollment } = useEnrollments();
  const { athletes } = useAthletes();
  const { classes } = useClasses();
  const [openDialog, setOpenDialog] = useState(false);
  const [filterAthleteId, setFilterAthleteId] = useState<number | ''>('');
  const [filterClassId, setFilterClassId] = useState<number | ''>('');

  // Filtra matrículas
  const filteredEnrollments = (enrollments || []).filter((enrollment) => {
    if (filterAthleteId && enrollment.athlete_id !== filterAthleteId) return false;
    if (filterClassId && enrollment.class_id !== filterClassId) return false;
    return true;
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'athlete_id',
      headerName: 'Atleta',
      width: 200,
      valueGetter: (params) => {
        const athlete = athletes?.find((a) => a.id === params.row.athlete_id);
        return athlete?.name || 'N/A';
      },
    },
    {
      field: 'class_id',
      headerName: 'Aula',
      width: 200,
      valueGetter: (params) => {
        const classData = classes?.find((c) => c.id === params.row.class_id);
        return classData?.name || 'N/A';
      },
    },
    {
      field: 'enrollment_date',
      headerName: 'Data de Matrícula',
      width: 150,
      valueFormatter: (params) => format(new Date(params.value), 'dd/MM/yyyy'),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Ativa' : 'Inativa'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'notes',
      headerName: 'Observações',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Deletar"
          onClick={() => {
            if (confirm('Deseja realmente deletar esta matrícula?')) {
              deleteEnrollment.mutate(params.row.id);
            }
          }}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Matrículas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nova Matrícula
        </Button>
      </Box>

      {/* Filtros */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          select
          label="Filtrar por Atleta"
          value={filterAthleteId}
          onChange={(e) => setFilterAthleteId(e.target.value as number | '')}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {athletes?.map((athlete) => (
            <MenuItem key={athlete.id} value={athlete.id}>
              {athlete.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Filtrar por Aula"
          value={filterClassId}
          onChange={(e) => setFilterClassId(e.target.value as number | '')}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todas</MenuItem>
          {classes?.map((classData) => (
            <MenuItem key={classData.id} value={classData.id}>
              {classData.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredEnrollments || []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <EnrollmentForm onClose={() => setOpenDialog(false)} />
      </Dialog>
    </Box>
  );
}