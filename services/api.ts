
import { supabase } from '@/lib/supabase.web'

export type CreateTimeEntryRequest = {
  project_name: string
  description?: string
  start_time: string
}

export type CreateTimeEntryResponse = {
    id: string
    project_name: string
    description?: string
    start_time: string
    end_time?: string
    duration?: number
    created_at: string
  }

export type UpdateTimeEntryRequest = {
    id: string
    project_name: string
    description?: string
    end_time: string
}
export type UpdateTimeEntryResponse = {
    id: string
    project_name: string
    description?: string
    start_time: string
    end_time?: string
    duration?: number
    created_at: string
}

export type GetTimeEntriesRequest = {
    limit?: string
    page?: string
}

export type GetTimeEntriesResponse = {
    data: CreateTimeEntryResponse[]
    limit: number
    page: number
    total: number
    total_pages: number
}

export type Project = {
  name: string;
  description: string;
  color: string;
  created_at: string;
};

export type CreateProjectRequest = {
  name: string
  description?: string
  color: string
}

export type CreateProjectResponse = Project

export type UpdateProjectRequest = {
  id: string
  name?: string
  description?: string
  color?: string
}

export type UpdateProjectResponse = Project

export type GetProjectsResponse = {
  data: Project[]
  limit: number
  page: number
  total: number
  total_pages: number
}

class ApiService {
  url = "http://172.25.196.188:8080/api/v1";

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: any | null; error: any }> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return { data: null, error: new Error("Not authenticated") };
    }

    try {
      const response = await fetch(this.url + endpoint, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async createTimeEntry(
    params: CreateTimeEntryRequest
  ): Promise<{ data: CreateTimeEntryResponse | null; error: any }> {
    return this.makeRequest("/time-entries", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async updateTimeEntry(
    params: UpdateTimeEntryRequest
  ): Promise<{ data: UpdateTimeEntryResponse | null; error: any }> {
    return this.makeRequest(`/time-entries/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    });
  }

  async getTimeEntries(
    params: GetTimeEntriesRequest = {}
  ): Promise<{ data: GetTimeEntriesResponse | null; error: any }> {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set("limit", params.limit);
    if (params.page) searchParams.set("page", params.page);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/time-entries?${queryString}`
      : "/time-entries";

    return this.makeRequest(endpoint, {
      method: "GET",
    });
  }

  // Project methods
  async createProject(
    params: CreateProjectRequest
  ): Promise<{ data: CreateProjectResponse | null; error: any }> {
    return this.makeRequest("/projects", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async updateProject(
    params: UpdateProjectRequest
  ): Promise<{ data: UpdateProjectResponse | null; error: any }> {
    return this.makeRequest(`/projects/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    });
  }

  async deleteProject(
    projectId: string
  ): Promise<{ data: any | null; error: any }> {
    return this.makeRequest(`/projects/${projectId}`, {
      method: "DELETE",
    });
  }

  async getProjects(
    params: GetTimeEntriesRequest = {}
  ): Promise<{ data: GetProjectsResponse | null; error: any }> {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set("limit", params.limit);
    if (params.page) searchParams.set("page", params.page);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/projects?${queryString}` : "/projects";

    return this.makeRequest(endpoint, {
      method: "GET",
    });
  }
}

export const apiService = new ApiService()