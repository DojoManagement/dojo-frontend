// src/pages/Dashboard.tsx
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAthletes } from '../hooks/useAthletes';
import { useClasses } from '../hooks/useClasses';
import { useEnrollments } from '../hooks/useEnrollments';
import { useAttendances } from '../hooks/useAttendances';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: 2,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { athletes } = useAthletes();
  const { classes } = useClasses();
  const { enrollments } = useEnrollments();
  const { attendances } = useAttendances();

  const activeEnrollments = (enrollments || []).filter((e) => e.is_active).length || 0;
  const activeClasses = (classes || []).filter((c) => c.is_active).length || 0;
  const todayAttendances = attendances?.filter(
    (a) => a.attendance_date === new Date().toISOString().split('T')[0]
  ).length || 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Atletas"
            value={athletes?.length || 0}
            icon={<PeopleIcon sx={{ color: 'white', fontSize: 40 }} />}
            color="#1976d2"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aulas Ativas"
            value={activeClasses}
            icon={<SchoolIcon sx={{ color: 'white', fontSize: 40 }} />}
            color="#2e7d32"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Matrículas Ativas"
            value={activeEnrollments}
            icon={<AssignmentIcon sx={{ color: 'white', fontSize: 40 }} />}
            color="#ed6c02"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Presenças Hoje"
            value={todayAttendances}
            icon={<CheckCircleIcon sx={{ color: 'white', fontSize: 40 }} />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Aulas por Dia da Semana
            </Typography>
            {/* Aqui você pode adicionar um gráfico com recharts */}
            <Typography color="textSecondary">
              Implementar gráfico de aulas
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Taxa de Frequência
            </Typography>
            {/* Gráfico de frequência */}
            <Typography color="textSecondary">
              Implementar gráfico de frequência
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}