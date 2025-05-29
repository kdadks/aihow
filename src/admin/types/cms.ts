export interface ContentVersion {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  published: boolean;
}

export interface ContentItem {
  id: string;
  type: 'page' | 'layout' | 'menu' | 'tool' | 'header' | 'footer';
  title: string;
  slug: string;
  content: string;
  metadata: ContentMetadata;
  versions: ContentVersion[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentMetadata {
  description?: string;
  keywords?: string[];
  author?: string;
  template?: string;
  order?: number;
  parent?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  link: string;
  icon?: string;
  children?: NavigationItem[];
  order: number;
  parentId?: string;
}

export interface SiteLayout {
  id: string;
  name: string;
  template: string;
  sections: {
    header: boolean;
    footer: boolean;
    sidebar?: boolean;
    breadcrumbs?: boolean;
  };
  styles: {
    theme: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export interface ToolData {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  metadata: {
    version: string;
    lastUpdated: Date;
    compatibility: string[];
  };
}

export interface PreviewData {
  content: ContentItem;
  layout: SiteLayout;
  navigation: NavigationItem[];
}