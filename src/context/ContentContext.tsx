'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { deepMerge } from '../lib/deepMerge';
const ContentContext = createContext<any>({});

export const ContentProvider = ({ children, initialData, initialBlogs }: { children: React.ReactNode, initialData?: any, initialBlogs?: any[] }) => {
  // Initialize with server-provided data to eliminate "loading" states on mount
  const [content, setContent] = useState<any>(initialData || {});
  const [blogs, setBlogs] = useState<any[]>(initialBlogs || []);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [contentRes, blogRes] = await Promise.all([
          fetch('/api/content', { cache: 'no-store' }),
          fetch('/api/blog', { cache: 'no-store' })
        ]);

        if (contentRes.ok) {
          const globalData = await contentRes.json();
          // Fresh API data from database takes precedence over initial server snapshot
          setContent((prev: any) => deepMerge(prev || initialData || {}, globalData));
        }

        if (blogRes.ok) {
          const blogData = await blogRes.json();
          setBlogs(blogData);
        }
      } catch (error) {
        console.error('Failed to fetch content from DB:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ ...content, allBlogs: blogs }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => useContext(ContentContext);
