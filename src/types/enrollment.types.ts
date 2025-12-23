export interface Enrollment {
  id: number;
  athlete_id: number;
  athlete_name: string;
  class_id: number;
  enrollment_date: string;
  is_active: boolean;
  notes?: string;
}

export type CreateEnrollmentDTO = Omit<Enrollment, 'id'>;

export interface UpdateEnrollmentDTO extends Partial<CreateEnrollmentDTO> {
  id: number;
}