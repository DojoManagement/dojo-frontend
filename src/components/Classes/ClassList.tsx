// src/components/Classes/ClassList.tsx
import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  Dialog,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Class } from '../../types/class.types';
import ClassForm from './ClassForm';
import { useClasses } from '../../hooks/useClasses';

export default function ClassList() {
  const { classes, isLoading, deleteClass } = useClasses();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | undefined>();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome', width: 200 },
    { field: 'instructor', headerName: 'Instrutor', width: 150 },
    { field: 'day_of_week', headerName: 'Dia da Semana', width: 130 },
    { field: 'start_time', headerName: 'Início', width: 100 },
    { field: 'end_time', headerName: 'Fim', width: 100 },
    {
      field: 'current_students',
      headerName: 'Alunos',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={`${params.row.current_students}/${params.row.max_students}`}
          color={params.row.current_students >= params.row.max_students ? 'error' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Ativa' : 'Inativa'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => {
            setSelectedClass(params.row);
            setOpenDialog(true);
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Deletar"
          onClick={() => {
            if (confirm('Deseja realmente deletar esta aula?')) {
              deleteClass(params.row.id);
            }
          }}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Aulas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedClass(undefined);
            setOpenDialog(true);
          }}
        >
          Nova Aula
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={classes || []}
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
        <ClassForm
          classData={selectedClass}
          onClose={() => setOpenDialog(false)}
        />
      </Dialog>
    </Box>
  );
}