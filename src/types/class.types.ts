export interface Class {
  id: string;  // UUID
  name: string;
  description: string;
  instructor: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  max_students: number;
  current_students: number;
  is_active: boolean;
}

export interface CreateClassDTO {
  name: string;
  description: string;
  instructor: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  max_students: number;
  current_students: number;
  is_active: boolean;
}
export interface UpdateClassDTO extends Partial<CreateClassDTO> {
  id: string;  // UUID
}