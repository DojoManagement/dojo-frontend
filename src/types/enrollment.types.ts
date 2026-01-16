export interface Enrollment {
  id: string;  // UUID
  athlete_id: string;  // UUID do atleta
  athlete_name: string;
  class_id: string;  // UUID da classe
  enrollment_date: string;
  is_active: boolean;
  notes?: string;
}

export interface CreateEnrollmentDTO {
  athlete_id: string;  // UUID do atleta
  athlete_name: string;
  class_id: string;  // UUID da classe
  enrollment_date: string;
  is_active: boolean;
  notes?: string;

}
export interface UpdateEnrollmentDTO extends Partial<CreateEnrollmentDTO> {
  id: string;  // UUID
}