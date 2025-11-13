'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skillType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string | null;
    email: string;
  };
  milestones?: Array<{
    id: string;
    title: string;
    status: string;
    paymentPercentage: number;
    order: number;
  }>;
  proposals?: Array<{
    id: string;
    status: string;
    developer?: {
      user?: {
        name: string | null;
        email: string;
      };
    };
  }>;
  _count?: {
    proposals: number;
  };
}

interface UseProjectOptions {
  status?: string;
  skillType?: string;
  search?: string;
  autoFetch?: boolean;
}

interface UseProjectReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (projectData: any) => Promise<Project | null>;
  updateProject: (projectId: string, projectData: any) => Promise<Project | null>;
  deleteProject: (projectId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useProject(options: UseProjectOptions = {}): UseProjectReturn {
  const { status, skillType, search, autoFetch = true } = options;
  const router = useRouter();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (skillType) params.set('skillType', skillType);

      const response = await fetch(`/api/project?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      let fetchedProjects = data.projects || [];

      // Client-side search filter
      if (search) {
        const searchLower = search.toLowerCase();
        fetchedProjects = fetchedProjects.filter(
          (project: Project) =>
            project.title.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower) ||
            project.client?.name?.toLowerCase().includes(searchLower) ||
            project.client?.email.toLowerCase().includes(searchLower)
        );
      }

      setProjects(fetchedProjects);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [status, skillType, search]);

  const createProject = useCallback(async (projectData: any): Promise<Project | null> => {
    try {
      setError(null);

      const response = await fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const data = await response.json();
      const newProject = data.project;

      // Add to projects list
      setProjects((prev) => [newProject, ...prev]);

      return newProject;
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
      return null;
    }
  }, []);

  const updateProject = useCallback(async (projectId: string, projectData: any): Promise<Project | null> => {
    try {
      setError(null);

      const response = await fetch(`/api/project/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }

      const data = await response.json();
      const updatedProject = data.project;

      // Update in projects list
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updatedProject : p))
      );

      return updatedProject;
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
      return null;
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/project/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }

      // Remove from projects list
      setProjects((prev) => prev.filter((p) => p.id !== projectId));

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
      return false;
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (autoFetch) {
      fetchProjects();
    }
  }, [fetchProjects, autoFetch]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    refetch,
  };
}

// Hook for fetching a single project
export function useProjectById(projectId: string | null) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      setProject(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/project/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }

      const data = await response.json();
      setProject(data.project);
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
  };
}

