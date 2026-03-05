export interface IdentityContactData {
  fullName: string
  email: string
  password: string
  telegramHandle: string
  basedIn: string
  twitterHandle: string
  linkedinProfile: string
  githubProfile: string
  superteamEarnProfile: string
}

export interface JobCategoryData {
  primaryRole: string
  secondaryRole: string
  skills: string[]
  yearsOfExperience: string
}

export interface MarketStatusData {
  availability: string
  jobType: string
  compensationRange: string
  startDate: string
}

export interface ContributionsData {
  projects: string[]
  bounties: string[]
  portfolioUrl: string
  description: string
}

export interface CommunityData {
  walletAddress: string
  detectedCommunities: string[]
  referralSource: string
  bio: string
}

export interface OnboardingData {
  identityContact: IdentityContactData
  jobCategory: JobCategoryData
  marketStatus: MarketStatusData
  contributions: ContributionsData
  community: CommunityData
  [key: string]: unknown
}

export interface StepConfig {
  id: number
  label: string
  title: string
}
