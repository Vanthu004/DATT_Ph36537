export interface PostApproval {
  id: string;
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface RawPost {
  _id: string;
  user_id: { _id: string; name: string; email: string; role: string; parent_id: string | null };
  title: string;
  content: string;
  images: string[];
  visibility: 'community' | 'family';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  __v: number;
} 