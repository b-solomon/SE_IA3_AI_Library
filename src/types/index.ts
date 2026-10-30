/**
 * TypeScript interfaces matching the Supabase database schema.
 * These mirror the SQL migrations in supabase/migrations/.
 */

export type UserRole = 'student' | 'admin'

/** User profile (extends auth.users) */
export interface Profile {
  id: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string | null
}

/** Document category */
export interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  created_by: string | null
  created_at: string
}

/** Digital asset (book, paper, document) */
export interface DigitalAsset {
  id: string
  title: string
  author: string
  isbn: string | null
  description: string | null
  category_id: string | null
  file_path: string | null
  file_name: string | null
  file_size: number | null
  file_type: string | null
  cover_url: string | null
  tags: string[] | null
  is_published: boolean
  download_count: number
  uploaded_by: string | null
  created_at: string
  updated_at: string | null
  // Joined fields (optional)
  category?: Category | null
  uploader?: Profile | null
}

/** AI conversation */
export interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

/** Chat message */
export interface ChatMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model_used: string | null
  tokens_used: number | null
  created_at: string
}

/** Test case (SE Lab) */
export interface TestCase {
  id: string
  test_id: string
  requirement_id: string | null
  category: string
  name: string
  description: string | null
  preconditions: string | null
  input_data: Record<string, unknown> | null
  expected_output: string
  test_type: 'black-box' | 'white-box'
  severity: 'critical' | 'high' | 'medium' | 'low'
  created_at: string
}

/** Test run */
export interface TestRun {
  id: string
  run_label: string
  run_by: string | null
  started_at: string
  completed_at: string | null
  total: number
  passed: number
  failed: number
  skipped: number
  branch: string | null
  commit_sha: string | null
}

/** Test result */
export interface TestResult {
  id: string
  run_id: string
  test_case_id: string
  status: 'pass' | 'fail' | 'skip' | 'example'
  actual_output: string | null
  error_details: string | null
  duration_ms: number | null
  executed_at: string
  evidence_url: string | null
  // Joined fields
  test_case?: TestCase | null
}

/** Defect */
export interface Defect {
  id: string
  defect_id: string
  title: string
  description: string | null
  severity: string | null
  priority: string | null
  status: 'new' | 'triaged' | 'in_progress' | 'fixed' | 'retested' | 'closed'
  related_test_result_id: string | null
  reported_by: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string | null
}

/** Change record (SCM / config management) */
export interface ChangeRecord {
  id: string
  record_id: string
  change_type: string
  description: string
  affected_files: string[] | null
  author: string | null
  committed_at: string
  version_tag: string | null
  notes: string | null
}

/** AI chat request body */
export interface AIChatRequest {
  conversationId: string
  message: string
  contextAssetIds?: string[]
}

/** AI chat response */
export interface AIChatResponse {
  reply: string
  modelUsed: string
  sources?: { id: string; title: string }[]
}

/** Result type for safe operations */
export type Result<T, E = string> =
  | { data: T; error: null }
  | { data: null; error: E }
