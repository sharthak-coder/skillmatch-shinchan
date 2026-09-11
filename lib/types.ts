export type RequestStatus = 'pending' | 'accepted' | 'rejected';
export type ProjectStatus = 'open' | 'closed';

export interface Profile {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  year: string;
  major: string;
  skills: string[];
  interests: string[];
  created_at: string;
  is_demo?: boolean;
}

export interface Project {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  team_size: number;
  status: ProjectStatus;
  category: string;
  required_skills: string[];
  owner?: Profile;
  created_at: string;
  members_count?: number;
}

export interface JoinRequest {
  id: string;
  project_id: string;
  requester_id: string;
  message: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  requester?: Profile;
  project?: Project;
}

export interface SkillMatchResult {
  percentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  interestBonus: boolean;
}
