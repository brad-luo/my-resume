// data/types.ts

export interface PersonalInfo {
  name: string
  title: string
  titles: string[]
  email: string
  website: string
  linkedin: string
  github: string
  githubUsername: string
  location: string
  profileSummary: string
}

export interface SkillDomain {
  name: string
  score: number
}

export interface Skills {
  domains: SkillDomain[]
  tags: Record<string, string[]>
}

export interface ExperienceRole {
  id: string
  company: string
  title: string
  period: string
  location: string
  bullets: string[]
  subRoles?: Array<{
    title: string
    period: string
    bullets: string[]
  }>
}

export interface Project {
  id: string
  name: string
  period: string
  description: string
  techStack: string[]
  tags: string[]
  githubUrl: string | null
  demoUrl: string | null
}

export interface Education {
  id: string
  institution: string
  degree: string
  period: string
  grade: string
}

export interface ResumeData {
  personal: PersonalInfo
  skills: Skills
  experience: ExperienceRole[]
  projects: Project[]
  education: Education[]
}
