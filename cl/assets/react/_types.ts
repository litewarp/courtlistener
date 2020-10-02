export interface Tag {
  id: number;
  name: string;
  title: string;
  date_created: string;
  published: boolean;
  dockets: number[];
  view_count: number;
  assocId?: number;
  description: string;
}
export interface Association {
  id: number;
  tag: number;
  docket: number;
}
export interface ApiResult<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export interface PageState {
  userId?: number;
  requestedUsername?: string;
  requestedUserId?: number;
  editUrl?: string;
  isPageOwner?: boolean;
  tagId?: number;
}

export interface Docket {
  absolute_url: string;
  case_name: string;
  docket_number: number;
  docket_entries: number[];
  pacer_docket_url: string;
  court: string;
  referred_to: number;
  referred_to_str: string;
}
