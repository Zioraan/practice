export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

export interface ContactTag {
  id: string;
  contact_id: string;
  tag_id: string;
  created_at: string;
}
