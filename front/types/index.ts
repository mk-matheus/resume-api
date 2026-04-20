export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  person?: { id: string; name: string };
}

export interface Experience {
  objectId: string;
  companyName: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  objectId: string;
  institutionName: string;
  course: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface Skill {
  objectId: string;
  name: string;
  level?: string;
}

export interface Resume {
  objectId: string;
  title: string;
  summary?: string;
}

export interface ExternalLink {
  objectId: string;
  type: string;
  url: string;
}

export interface Person {
  objectId: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  location?: string;
  avatarUrl?: string;
  userId?: string;
  Resumes?: Resume[];
  Experiences?: Experience[];
  Education?: Education[];
  Skills?: Skill[];
  ExternalLinks?: ExternalLink[];
}

export interface MeResponse extends User {
  Person: Person;
}
