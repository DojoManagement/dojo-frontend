export interface Attendance {
  id: number;
  athlete_id: number;
  class_id: number;
  attendance_date: string;
  status: 'present' | 'absent' | 'justified' | 'late';
  notes?: string;
  recorded_by?: string;
  recorded_at?: string;
}

export type CreateAttendanceDTO = Omit<Attendance, 'id' | 'recorded_at'>;