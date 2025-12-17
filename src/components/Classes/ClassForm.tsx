// src/components/Classes/ClassForm.tsx
import { useEffect } from 'react';
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Class } from '../../types/class.types';
import { useClasses } from '../../hooks/useClasses';
import { useSnackbar } from 'notistack';

const classSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  instructor: z.string().min(3, 'Instrutor é obrigatório'),
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  start_time: z.string(),
  end_time: z.string(),
  max_students: z.number().min(1, 'Deve ter pelo menos 1 vaga'),
  is_active: z.boolean(),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassFormProps {
  classData?: Class;
  onClose: () => void;
}

const daysOfWeek = [
  { value: 'Monday', label: 'Segunda-feira' },
  { value: 'Tuesday', label: 'Terça-feira' },
  { value: 'Wednesday', label: 'Quarta-feira' },
  { value: 'Thursday', label: 'Quinta-feira' },
  { value: 'Friday', label: 'Sexta-feira' },
  { value: 'Saturday', label: 'Sábado' },
  { value: 'Sunday', label: 'Domingo' },
];

export default function ClassForm({ classData, onClose }: ClassFormProps) {
  const { createClass, updateClass } = useClasses();
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: classData || {
      is_active: true,
      max_students: 20,
    },
  });

  useEffect(() => {
    if (classData) {
      reset(classData);
    }
  }, [classData, reset]);

  const onSubmit = (data: ClassFormData) => {
    try {
      if (classData) {
        updateClass({
          id: classData.id,
          data: { ...data, id: classData.id, current_students: classData.current_students },
        });
        enqueueSnackbar('Aula atualizada com sucesso!', { variant: 'success' });
      } else {
        createClass({ ...data, current_students: 0 });
        enqueueSnackbar('Aula criada com sucesso!', { variant: 'success' });
      }
      onClose();
    } catch (error) {
      enqueueSnackbar('Erro ao salvar aula', { variant: 'error' });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {classData ? 'Editar Aula' : 'Nova Aula'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome da Aula"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="instructor"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Instrutor"
                    fullWidth
                    error={!!errors.instructor}
                    helperText={errors.instructor?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="day_of_week"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Dia da Semana"
                    fullWidth
                    error={!!errors.day_of_week}
                    helperText={errors.day_of_week?.message}
                  >
                    {daysOfWeek.map((day) => (
                      <MenuItem key={day.value} value={day.value}>
                        {day.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="start_time"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="Horário de Início"
                    value={field.value ? dayjs(field.value, 'HH:mm') : null}
                    onChange={(time) => field.onChange(time?.format('HH:mm'))}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.start_time,
                        helperText: errors.start_time?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="end_time"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="Horário de Término"
                    value={field.value ? dayjs(field.value, 'HH:mm') : null}
                    onChange={(time) => field.onChange(time?.format('HH:mm'))}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.end_time,
                        helperText: errors.end_time?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="max_students"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Máximo de Alunos"
                    type="number"
                    fullWidth
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    error={!!errors.max_students}
                    helperText={errors.max_students?.message}
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
                    label="Aula Ativa"
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