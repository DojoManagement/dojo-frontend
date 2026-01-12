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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Athlete, CreateAthleteDTO } from '../../types/athlete.types';
import { useAthletes } from '../../hooks/useAthletes';
import { useSnackbar } from 'notistack';

const athleteSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  rg: z.string().min(5, 'RG inválido'),
  email: z.string().email('Email inválido'),
  date_of_birth: z.string().min(1, 'Data de nascimento é obrigatória'),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().default(''),
  complement: z.string().optional().default(''),
  neighborhood: z.string().min(3, 'Bairro é obrigatório'),
  city: z.string().min(3, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
  zip_code: z.string().length(8, 'CEP deve ter 8 dígitos'),
  phone: z.string().optional().default(''),
  cellphone: z.string().min(10, 'Celular inválido'),
  father_name: z.string().optional().default(''),
  mother_name: z.string().optional().default(''),
  guardians_cpf: z.string().optional().default(''),
  guardians_rg: z.string().optional().default(''),
  subscription_date: z.string().min(1, 'Data de inscrição é obrigatória'),
  anaj_date: z.string().optional().default(''),
  blood_type: z.string().optional().default(''),
  last_medical_exam: z.string().optional().default(''),
  current_belt_id: z.number().int().positive('Faixa é obrigatória'),
});

type AthleteFormData = z.infer<typeof athleteSchema>;

interface AthleteFormProps {
  athlete?: Athlete;
  onClose: () => void;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function AthleteForm({ athlete, onClose }: AthleteFormProps) {
  const { createAthlete, updateAthlete } = useAthletes();
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AthleteFormData>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      name: '',
      cpf: '',
      rg: '',
      email: '',
      date_of_birth: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: 'SC',
      zip_code: '',
      phone: '',
      cellphone: '',
      father_name: '',
      mother_name: '',
      guardians_cpf: '',
      guardians_rg: '',
      subscription_date: dayjs().format('YYYY-MM-DD'),
      anaj_date: '',
      blood_type: '',
      last_medical_exam: '',
      current_belt_id: 1,
    },
  });

  useEffect(() => {
    if (athlete) {
      reset({
        ...athlete,
        current_belt_id: athlete.current_belt_id,
      });
    }
  }, [athlete, reset]);

  const onSubmit = async (data: AthleteFormData) => {
    try {
      const payload: CreateAthleteDTO = {
        name: data.name,
        cpf: data.cpf,
        rg: data.rg,
        email: data.email,
        date_of_birth: data.date_of_birth,
        street: data.street,
        number: data.number,
        complement: data.complement || '',
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        phone: data.phone || '',
        cellphone: data.cellphone,
        father_name: data.father_name || '',
        mother_name: data.mother_name || '',
        guardians_cpf: data.guardians_cpf || '',
        guardians_rg: data.guardians_rg || '',
        subscription_date: data.subscription_date,
        anaj_date: data.anaj_date || '',
        blood_type: data.blood_type || '',
        last_medical_exam: data.last_medical_exam || '',
        current_belt_id: data.current_belt_id,
      };

      console.log('📤 Payload:', JSON.stringify(payload, null, 2));

      if (athlete) {
        await updateAthlete.mutateAsync({
          id: athlete.id,
          data: {
            ...payload,
            id: athlete.id,
          },
        });
        enqueueSnackbar('Atleta atualizado com sucesso!', { variant: 'success' });
      } else {
        await createAthlete.mutateAsync(payload);
        enqueueSnackbar('Atleta criado com sucesso!', { variant: 'success' });
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Erro ao salvar atleta:', error);
      enqueueSnackbar('Erro ao salvar atleta', { variant: 'error' });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {athlete ? 'Editar Atleta' : 'Novo Atleta'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Nome */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome Completo"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            {/* CPF e RG */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="CPF"
                    fullWidth
                    required
                    placeholder="Somente números"
                    error={!!errors.cpf}
                    helperText={errors.cpf?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="rg"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="RG"
                    fullWidth
                    required
                    error={!!errors.rg}
                    helperText={errors.rg?.message}
                  />
                )}
              />
            </Grid>

            {/* Email e Data de Nascimento */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="date_of_birth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Data de Nascimento"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date: Dayjs | null) => 
                      field.onChange(date ? date.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.date_of_birth,
                        helperText: errors.date_of_birth?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Endereço */}
            <Grid item xs={12} sm={8}>
              <Controller
                name="street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Rua"
                    fullWidth
                    required
                    error={!!errors.street}
                    helperText={errors.street?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Número"
                    fullWidth
                    required
                    error={!!errors.number}
                    helperText={errors.number?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="complement"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field}
                    value={field.value || ''}
                    label="Complemento" 
                    fullWidth 
                    placeholder="Opcional"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="neighborhood"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bairro"
                    fullWidth
                    required
                    error={!!errors.neighborhood}
                    helperText={errors.neighborhood?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cidade"
                    fullWidth
                    required
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Estado"
                    fullWidth
                    required
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  >
                    {states.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Controller
                name="zip_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="CEP"
                    fullWidth
                    required
                    placeholder="Somente números"
                    error={!!errors.zip_code}
                    helperText={errors.zip_code?.message}
                  />
                )}
              />
            </Grid>

            {/* Contato */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field}
                    value={field.value || ''}
                    label="Telefone" 
                    fullWidth 
                    placeholder="Opcional"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="cellphone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Celular"
                    fullWidth
                    required
                    error={!!errors.cellphone}
                    helperText={errors.cellphone?.message}
                  />
                )}
              />
            </Grid>

            {/* Responsáveis */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="father_name"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field}
                    value={field.value || ''}
                    label="Nome do Pai" 
                    fullWidth 
                    placeholder="Opcional"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="mother_name"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field}
                    value={field.value || ''}
                    label="Nome da Mãe" 
                    fullWidth 
                    placeholder="Opcional"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="guardians_cpf"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field}
                    value={field.value || ''}
                    label="CPF do Responsável" 
                    fullWidth 
                    placeholder="Opcional"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="guardians_rg"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field}
                    value={field.value || ''}
                    label="RG do Responsável" 
                    fullWidth 
                    placeholder="Opcional"
                  />
                )}
              />
            </Grid>

            {/* Informações do Dojo */}
            <Grid item xs={12} sm={4}>
              <Controller
                name="subscription_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Data de Inscrição"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date: Dayjs | null) => 
                      field.onChange(date ? date.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{
                      textField: { 
                        fullWidth: true,
                        required: true,
                        error: !!errors.subscription_date,
                        helperText: errors.subscription_date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="current_belt_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Faixa Atual (ID)"
                    type="number"
                    fullWidth
                    required
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    error={!!errors.current_belt_id}
                    helperText={errors.current_belt_id?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="blood_type"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field}
                    value={field.value || ''}
                    select 
                    label="Tipo Sanguíneo" 
                    fullWidth
                  >
                    <MenuItem value="">Não informado</MenuItem>
                    {bloodTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="anaj_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Data ANAJ (Opcional)"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date: Dayjs | null) => 
                      field.onChange(date ? date.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="last_medical_exam"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Último Exame Médico (Opcional)"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date: Dayjs | null) => 
                      field.onChange(date ? date.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
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