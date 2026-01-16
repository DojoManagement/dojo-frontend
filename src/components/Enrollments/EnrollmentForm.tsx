// src/components/Enrollments/EnrollmentForm.tsx
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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEnrollments } from '../../hooks/useEnrollments';
import { useAthletes } from '../../hooks/useAthletes';
import { useClasses } from '../../hooks/useClasses';
import { useSnackbar } from 'notistack';
import { CreateEnrollmentDTO } from '../../types/enrollment.types';

const enrollmentSchema = z.object({
  athlete_id: z.string().min(1, 'Atleta é obrigatório'),
  athlete_name: z.string(),
  class_id: z.string().min(1, 'Aula é obrigatória'),
  enrollment_date: z.string(),
  is_active: z.boolean(),
  notes: z.string().optional(),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  onClose: () => void;
}

export default function EnrollmentForm({ onClose }: EnrollmentFormProps) {
  const { createEnrollment } = useEnrollments();
  const { athletes } = useAthletes();
  const { classes } = useClasses();
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      athlete_id: '',
      athlete_name: '',
      class_id: '',
      enrollment_date: dayjs().format('YYYY-MM-DD'),
      is_active: true,
      notes: '',
    },
  });

  const onSubmit = async (data: EnrollmentFormData) => {
    try {
      // ✅ Criar payload conforme CreateEnrollmentDTO
      const payload: CreateEnrollmentDTO = {
        athlete_id: data.athlete_id,
        athlete_name: data.athlete_name,
        class_id: data.class_id,
        enrollment_date: data.enrollment_date,
        is_active: data.is_active,
        notes: data.notes || '',
      };

      console.log('📤 Payload:', JSON.stringify(payload, null, 2));

      // ✅ Usar mutateAsync
      await createEnrollment.mutateAsync(payload);
      
      enqueueSnackbar('Matrícula criada com sucesso!', { variant: 'success' });
      onClose();
    } catch (error) {
      console.error('❌ Erro ao criar matrícula:', error);
      enqueueSnackbar('Erro ao criar matrícula', { variant: 'error' });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Nova Matrícula</DialogTitle>

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
                          {classData.name} - {classData.day_of_week} ({classData.start_time})
                        </MenuItem>
                      ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="enrollment_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Data de Matrícula"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.enrollment_date,
                        helperText: errors.enrollment_date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Matrícula Ativa"
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
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </LocalizationProvider>
  );
}