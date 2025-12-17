// src/components/Athletes/AthleteList.tsx
import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Dialog,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Athlete } from '../../types/athlete.types';
import AthleteForm from './AthleteForm';
import { useAthletes } from '../../hooks/useAthletes';
import { format } from 'date-fns';

export default function AthleteList() {
  const { athletes, isLoading, deleteAthlete } = useAthletes();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | undefined>();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome', width: 200 },
    { field: 'cpf', headerName: 'CPF', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'cellphone', headerName: 'Celular', width: 130 },
    {
      field: 'date_of_birth',
      headerName: 'Data Nascimento',
      width: 150,
      valueFormatter: (params) => format(new Date(params.value), 'dd/MM/yyyy'),
    },
    { field: 'current_belt_id', headerName: 'Faixa', width: 100 },
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
            setSelectedAthlete(params.row);
            setOpenDialog(true);
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Deletar"
          onClick={() => {
            if (confirm('Deseja realmente deletar este atleta?')) {
              deleteAthlete(params.row.id);
            }
          }}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Atletas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedAthlete(undefined);
            setOpenDialog(true);
          }}
        >
          Novo Atleta
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={athletes || []}
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
        maxWidth="md"
        fullWidth
      >
        <AthleteForm
          athlete={selectedAthlete}
          onClose={() => setOpenDialog(false)}
        />
      </Dialog>
    </Box>
  );
}