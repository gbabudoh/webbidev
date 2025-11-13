// ============================================
// ENUMS (Matching Prisma Schema)
// ============================================

export type UserRole = 'CLIENT' | 'DEVELOPER' | 'ADMIN';

export type ProjectStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type MilestoneStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'READY_FOR_REVIEW'
  | 'APPROVED'
  | 'DISPUTED'
  | 'REJECTED';

export type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export type TransactionStatus =
  | 'PENDING'
  | 'HELD_IN_ESCROW'
  | 'RELEASED'
  | 'REFUNDED'
  | 'FAILED';

export type DisputeStatus =
  | 'OPEN'
  | 'IN_REVIEW'
  | 'RESOLVED_DEVELOPER_WINS'
  | 'RESOLVED_CLIENT_WINS'
  | 'CLOSED';

export type Skill =
  // Frontend Skills
  | 'REACT'
  | 'VUE_JS'
  | 'ANGULAR'
  | 'JAVASCRIPT'
  | 'TYPESCRIPT'
  | 'TAILWIND_CSS'
  | 'SASS'
  | 'ACCESSIBILITY_A11Y'
  | 'NEXT_JS'
  | 'HTML_CSS'
  // Backend Skills
  | 'NODE_JS'
  | 'PYTHON_DJANGO'
  | 'PYTHON_FLASK'
  | 'PHP_LARAVEL'
  | 'RUBY_ON_RAILS'
  | 'GO'
  | 'POSTGRESQL'
  | 'MYSQL'
  | 'MONGODB'
  | 'AWS'
  | 'AZURE'
  | 'RESTFUL_APIS'
  | 'GRAPHQL'
  // UI/UX Skills
  | 'FIGMA'
  | 'SKETCH'
  | 'ADOBE_XD'
  | 'PROTOTYPING'
  | 'USER_RESEARCH'
  | 'WIREFRAMING'
  | 'DESIGN_SYSTEMS';

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isSuperAdmin: boolean;
  isSuspended: boolean;
  suspendedAt?: string | null;
  suspendedBy?: string | null;
  suspensionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithProfile extends User {
  developerProfile?: DeveloperProfile | null;
}

// ============================================
// DEVELOPER PROFILE TYPES
// ============================================

export interface DeveloperProfile {
  id: string;
  userId: string;
  portfolioUrl: string;
  bioSummary: string;
  location: string;
  timeZone?: string | null;
  skills: Skill[];
  stripeAccountId?: string | null;
  stripeOnboardingComplete: boolean;
  totalEarnings: number;
  totalProjects: number;
  completedProjects: number;
  isActive: boolean;
  isVerified: boolean;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  isSuspended: boolean;
  suspendedAt?: string | null;
  suspendedBy?: string | null;
  suspensionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface DeveloperProfileFormData {
  portfolioUrl: string;
  bioSummary: string;
  location: string;
  timeZone?: string;
  skills: Skill[];
}

// ============================================
// PROJECT TYPES
// ============================================

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skillType: string;
  status: ProjectStatus;
  selectedDeveloperId?: string | null;
  selectedProposalId?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: User;
  milestones?: Milestone[];
  proposals?: Proposal[];
  messages?: Message[];
  transactions?: Transaction[];
  disputes?: Dispute[];
}

export interface ProjectWithDetails extends Project {
  client: User;
  milestones: Milestone[];
  proposals: Proposal[];
  _count?: {
    proposals: number;
  };
}

export interface CreateProjectData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skillType: 'Frontend' | 'Backend' | 'UI/UX';
  milestones: CreateMilestoneData[];
}

export interface CreateMilestoneData {
  title: string;
  definitionOfDone: string;
  paymentPercentage: number;
  order: number;
}

// ============================================
// MILESTONE TYPES
// ============================================

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  definitionOfDone: string;
  paymentPercentage: number;
  status: MilestoneStatus;
  order: number;
  completedAt?: string | null;
  approvedAt?: string | null;
  disputedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  transactions?: Transaction[];
  disputes?: Dispute[];
}

export interface MilestoneWithDetails extends Milestone {
  project: Project;
  transactions: Transaction[];
  disputes: Dispute[];
}

// ============================================
// PROPOSAL TYPES
// ============================================

export interface Proposal {
  id: string;
  projectId: string;
  developerId: string;
  rate?: number | null;
  estimatedTime?: string | null;
  message: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  developer?: DeveloperProfile;
}

export interface ProposalWithDetails extends Proposal {
  project: ProjectWithDetails;
  developer: DeveloperProfile & { user: User };
}

export interface CreateProposalData {
  projectId: string;
  rate?: number;
  estimatedTime?: string;
  message: string;
}

// ============================================
// TRANSACTION TYPES
// ============================================

export interface Transaction {
  id: string;
  projectId: string;
  milestoneId?: string | null;
  developerId: string;
  amount: number;
  webbidevFee: number;
  developerPayout: number;
  stripePaymentIntentId?: string | null;
  stripeTransferId?: string | null;
  status: TransactionStatus;
  heldAt?: string | null;
  releasedAt?: string | null;
  refundedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  milestone?: Milestone;
  developer?: DeveloperProfile;
}

export interface TransactionWithDetails extends Transaction {
  project: Project;
  milestone: Milestone;
  developer: DeveloperProfile & { user: User };
}

export interface CreatePaymentData {
  projectId: string;
  milestoneId: string;
}

export interface PaymentIntentResponse {
  transaction: Transaction;
  paymentIntent: {
    id: string;
    clientSecret: string;
  };
}

// ============================================
// MESSAGE TYPES
// ============================================

export interface Message {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  attachments: string[];
  isEvidence: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  project?: Project;
}

export interface CreateMessageData {
  projectId: string;
  content: string;
  attachments?: string[];
  isEvidence?: boolean;
}

// ============================================
// DISPUTE TYPES
// ============================================

export interface Dispute {
  id: string;
  projectId: string;
  milestoneId: string;
  clientId: string;
  developerId: string;
  reviewerId?: string | null;
  status: DisputeStatus;
  clientStatement?: string | null;
  clientEvidence: string[];
  developerStatement?: string | null;
  developerEvidence: string[];
  reviewerDecision?: string | null;
  reviewerDecisionAt?: string | null;
  resolvedInFavorOf?: string | null;
  openedAt: string;
  inReviewAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  milestone?: Milestone;
  client?: User;
  developer?: User;
  reviewer?: User;
}

export interface DisputeWithDetails extends Dispute {
  project: Project;
  milestone: Milestone;
  client: User;
  developer: User;
  reviewer?: User;
}

export interface CreateDisputeData {
  projectId: string;
  milestoneId: string;
  clientStatement: string;
  clientEvidence: string[];
}

export interface UpdateDisputeData {
  developerStatement?: string;
  developerEvidence?: string[];
  reviewerDecision?: string;
  resolvedInFavorOf?: 'CLIENT' | 'DEVELOPER';
}

// ============================================
// STRIPE CONNECT TYPES
// ============================================

export interface StripeConnectStatus {
  connected: boolean;
  accountId: string | null;
  onboardingComplete: boolean;
  accountDetails?: {
    email?: string;
    country?: string;
    type?: string;
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
    detailsSubmitted?: boolean;
  };
}

export interface StripeConnectOnboardingResponse {
  accountId: string;
  onboardingUrl: string;
}

export interface StripeConnectLoginResponse {
  loginUrl: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// FORM TYPES
// ============================================

export interface SignupFormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

export interface ProjectFilters {
  status?: ProjectStatus;
  skillType?: string;
  minBudget?: number;
  maxBudget?: number;
  search?: string;
}

export interface DeveloperFilters {
  skills?: Skill[];
  location?: string;
  minEarnings?: number;
  verified?: boolean;
  search?: string;
}

export interface TransactionFilters {
  status?: TransactionStatus;
  projectId?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Nullable<T> = T | null;

export type Maybe<T> = T | null | undefined;

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// ============================================
// PLATFORM SETTINGS TYPES
// ============================================

export interface PlatformSettings {
  id: string;
  commissionRate: number;
  platformName: string;
  platformTagline?: string | null;
  registrationEnabled: boolean;
  developerRegistrationEnabled: boolean;
  clientRegistrationEnabled: boolean;
  maintenanceMode: boolean;
  maintenanceMessage?: string | null;
  notes?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// ADMIN ACTIVITY TYPES
// ============================================

export interface AdminActivity {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  description?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  admin?: User;
}

// ============================================
// STATISTICS TYPES
// ============================================

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalEarnings: number;
  pendingPayouts: number;
  totalTransactions: number;
}

export interface DeveloperStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalEarnings: number;
  pendingPayouts: number;
  averageProjectValue: number;
}

export interface ClientStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
  activeDevelopers: number;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  userId: string;
  type: 'PROJECT_UPDATE' | 'PROPOSAL_RECEIVED' | 'MILESTONE_APPROVED' | 'PAYMENT_RECEIVED' | 'DISPUTE_OPENED';
  title: string;
  message: string;
  read: boolean;
  link?: string | null;
  createdAt: string;
}

// ============================================
// EXPORT ALL TYPES
// ============================================

// All types are already exported above
// This file serves as the central type definitions for the application

