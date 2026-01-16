// src/components/Attendances/AttendanceList.tsx
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
import AttendanceForm from './AttendanceForm';
import { useAttendances } from '../../hooks/useAttendances';
import { useAthletes } from '../../hooks/useAthletes';
import { useClasses } from '../../hooks/useClasses';
import { format } from 'date-fns';

const statusColors: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
  present: 'success',
  absent: 'error',
  justified: 'warning',
  late: 'info',
};

const statusLabels: Record<string, string> = {
  present: 'Presente',
  absent: 'Faltou',
  justified: 'Justificado',
  late: 'Atrasado',
};

export default function AttendanceList() {
  const { attendances, isLoading, deleteAttendance } = useAttendances();
  const { athletes } = useAthletes();
  const { classes } = useClasses();
  const [openDialog, setOpenDialog] = useState(false);
  const [filterAthleteId, setFilterAthleteId] = useState<string>('');
  const [filterClassId, setFilterClassId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Filtra presenças
  const filteredAttendances = attendances?.filter((attendance) => {
    if (filterAthleteId && attendance.athlete_id !== filterAthleteId) return false;
    if (filterClassId && attendance.class_id !== filterClassId) return false;
    if (filterStatus && attendance.status !== filterStatus) return false;
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
      field: 'attendance_date',
      headerName: 'Data',
      width: 120,
      valueFormatter: (params) => format(new Date(params.value), 'dd/MM/yyyy'),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={statusLabels[params.value] || params.value}
          color={statusColors[params.value] || 'default'}
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
      field: 'recorded_by',
      headerName: 'Registrado por',
      width: 150,
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
            if (confirm('Deseja realmente deletar este registro de presença?')) {
              deleteAttendance(params.row.id);
            }
          }}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Registro de Presenças</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Registrar Presença
        </Button>
      </Box>

      {/* Filtros */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          select
          label="Filtrar por Atleta"
          value={filterAthleteId}
          onChange={(e) => setFilterAthleteId(e.target.value)}
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
          onChange={(e) => setFilterClassId(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todas</MenuItem>
          {classes?.map((classData) => (
            <MenuItem key={classData.id} value={classData.id}>
              {classData.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Filtrar por Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="present">Presente</MenuItem>
          <MenuItem value="absent">Faltou</MenuItem>
          <MenuItem value="justified">Justificado</MenuItem>
          <MenuItem value="late">Atrasado</MenuItem>
        </TextField>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredAttendances || []}
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
        <AttendanceForm onClose={() => setOpenDialog(false)} />
      </Dialog>
    </Box>
  );
}