// src/components/Attendances/AttendanceForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Button,
  TextField,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAttendances } from '../../hooks/useAttendances';
import { useAthletes } from '../../hooks/useAthletes';
import { useClasses } from '../../hooks/useClasses';
import { useSnackbar } from 'notistack';

const attendanceSchema = z.object({
  athlete_id: z.number().min(1, 'Atleta é obrigatório'),
  class_id: z.number().min(1, 'Aula é obrigatória'),
  attendance_date: z.string(),
  status: z.enum(['present', 'absent', 'justified', 'late']),
  notes: z.string().optional(),
  recorded_by: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

interface AttendanceFormProps {
  onClose: () => void;
}

export default function AttendanceForm({ onClose }: AttendanceFormProps) {
  const { createAttendance } = useAttendances();
  const { athletes } = useAthletes();
  const { classes } = useClasses();
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      attendance_date: new Date().toISOString().split('T')[0],
      status: 'present',
      notes: '',
      recorded_by: '',
    },
  });

  const onSubmit = (data: AttendanceFormData) => {
    try {
      createAttendance(data);
      enqueueSnackbar('Presença registrada com sucesso!', { variant: 'success' });
      onClose();
    } catch (error) {
      enqueueSnackbar('Erro ao registrar presença', { variant: 'error' });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Registrar Presença</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="athlete_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Atleta"
                    fullWidth
                    error={!!errors.athlete_id}
                    helperText={errors.athlete_id?.message}
                  >
                    {athletes?.map((athlete) => (
                      <MenuItem key={athlete.id} value={athlete.id}>
                        {athlete.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="class_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Aula"
                    fullWidth
                    error={!!errors.class_id}
                    helperText={errors.class_id?.message}
                  >
                    {classes
                      ?.filter((c) => c.is_active)
                      .map((classData) => (
                        <MenuItem key={classData.id} value={classData.id}>
                          {classData.name} - {classData.day_of_week}
                        </MenuItem>
                      ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="attendance_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Data da Aula"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.attendance_date,
                        helperText: errors.attendance_date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    fullWidth
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value="present">✅ Presente</MenuItem>
                    <MenuItem value="absent">❌ Faltou</MenuItem>
                    <MenuItem value="justified">⚠️ Justificado</MenuItem>
                    <MenuItem value="late">⏰ Atrasado</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="recorded_by"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Registrado por"
                    fullWidth
                    placeholder="Nome do professor/instrutor"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Observações"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Motivo da falta, observações sobre o aluno, etc."
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            Registrar
          </Button>
        </DialogActions>
      </form>
    </LocalizationProvider>
  );
}