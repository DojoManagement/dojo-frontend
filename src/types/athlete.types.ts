export interface Athlete {
  id: number;
  name: string;
  cpf: string;
  rg: string;
  email: string;
  date_of_birth: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  phone?: string;
  cellphone: string;
  father_name?: string;
  mother_name?: string;
  guardians_cpf?: string;
  guardians_rg?: string;
  subscription_date: string;
  anaj_date?: string;
  blood_type?: string;
  last_medical_exam?: string;
  current_belt_id: string;
}

// ✅ CreateAthleteDTO NÃO tem ID
export type CreateAthleteDTO = Omit<Athlete, 'id'>;