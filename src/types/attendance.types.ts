export interface Attendance {
  id: string;  // UUID
  athlete_id: string;  // UUID do atleta
  class_id: string;  // UUID da classe
  attendance_date: string;
  status: 'present' | 'absent' | 'justified' | 'late';
  notes?: string;
  recorded_by?: string;
  recorded_at?: string;
}

export type CreateAttendanceDTO = Omit<Attendance, 'id' | 'recorded_at'>;