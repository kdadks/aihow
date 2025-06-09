import React, { useState, useEffect, useCallback } from 'react';
import { Tool } from '../../types';
import { tools } from '../../data/tools';
import { workflowBundles } from '../../data/workflows';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AuthenticatedSaveButton } from './AuthenticatedSaveButton';
import {
  Plus, X, Calculator, Wand2, Download, Share2,
  Eye, EyeOff, Clock, Users, AlertTriangle,
  CheckCircle, Shield, Workflow, Zap,
  GitBranch, History, UserCheck, Bell,
  Activity
} from 'lucide-react';

// Enterprise workflow interfaces
interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tools: Tool[];
  isRecommended: boolean;
  complexity: 'Basic' | 'Intermediate' | 'Advanced' | 'Enterprise';
  estimatedSetupTime: string;
  prerequisites: string[];
}

interface WorkflowValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

interface CollaborationSettings {
  isShared: boolean;
  permissions: 'view' | 'edit' | 'admin';
  sharedWith: string[];
  allowComments: boolean;
  requireApproval: boolean;
}

interface WorkflowMetadata {
  version: string;
  lastModified: Date;
  createdBy: string;
  approvedBy?: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  department?: string;
  businessUnit?: string;
  complianceNotes?: string;
}

export interface EnterpriseWorkflow {
  id?: string;
  name: string;
  description: string;
  useCase: string;
  tools: Tool[];
  totalCost: number;
  estimatedROI?: string;
  riskAssessment?: string;
  complianceRequirements?: string[];
  integrationNotes?: string;
  maintenanceSchedule?: string;
  metadata: WorkflowMetadata;
  collaboration: CollaborationSettings;
  template?: WorkflowTemplate;
  approvalWorkflow?: ApprovalWorkflow;
  auditLog?: AuditEntry[];
  versionControl?: VersionControl;
}

interface ApprovalWorkflow {
  isEnabled: boolean;
  approvers: string[];
  currentApprover?: string;
  status: 'pending' | 'approved' | 'rejected' | 'none';
  approvalNotes?: string;
  requestedAt?: Date;
  approvedAt?: Date;
}

interface AuditEntry {
  id: string;
  action: 'created' | 'updated' | 'approved' | 'rejected' | 'shared' | 'exported' | 'archived';
  userId: string;
  userName: string;
  timestamp: Date;
  changes?: Record<string, any>;
  notes?: string;
}

interface VersionControl {
  currentVersion: string;
  previousVersions: WorkflowVersion[];
  changeLog: string[];
  autoSave: boolean;
  backupEnabled: boolean;
}

interface WorkflowVersion {
  version: string;
  createdAt: Date;
  createdBy: string;
  description: string;
  snapshot: Partial<EnterpriseWorkflow>;
}

interface EnterpriseWorkflowCreatorProps {
  onSave?: (workflow: EnterpriseWorkflow) => void;
  onExport?: (workflow: EnterpriseWorkflow) => void;
  onShare?: (workflow: EnterpriseWorkflow) => void;
  initialWorkflow?: EnterpriseWorkflow | null;
  isReadOnly?: boolean;
  showComplianceFeatures?: boolean;
  organizationTemplates?: WorkflowTemplate[];
}

export const EnterpriseWorkflowCreator: React.FC<EnterpriseWorkflowCreatorProps> = ({ 
  onSave, 
  onExport, 
  onShare, 
  initialWorkflow, 
  isReadOnly = false,
  showComplianceFeatures = true,
  organizationTemplates = []
}) => {
  const [workflow, setWorkflow] = useState<EnterpriseWorkflow>({
    name: '',
    description: '',
    useCase: '',
    tools: [],
    totalCost: 0,
    metadata: {
      version: '1.0.0',
      lastModified: new Date(),
      createdBy: 'current-user', // This would come from auth context
      status: 'draft',
      tags: []
    },
    collaboration: {
      isShared: false,
      permissions: 'view',
      sharedWith: [],
      allowComments: false,
      requireApproval: false
    },
    approvalWorkflow: {
      isEnabled: false,
      approvers: [],
      status: 'none'
    },
    auditLog: [],
    versionControl: {
      currentVersion: '1.0.0',
      previousVersions: [],
      changeLog: ['Initial workflow creation'],
      autoSave: true,
      backupEnabled: true
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recommendedTemplates, setRecommendedTemplates] = useState<WorkflowTemplate[]>([]);
  const [validation, setValidation] = useState<WorkflowValidation>({
    isValid: false,
    errors: [],
    warnings: [],
    suggestions: []
  });
  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'settings' | 'collaboration' | 'compliance' | 'approval-workflow' | 'audit-logging' | 'version-control'>('builder');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showToolSelection, setShowToolSelection] = useState(false);
  
  // AI Recommendation states
  const [recommendedBundle, setRecommendedBundle] = useState<typeof workflowBundles[0] | null>(null);
  const [alternativeRecommendations, setAlternativeRecommendations] = useState<typeof workflowBundles>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Initialize workflow from props
  useEffect(() => {
    if (initialWorkflow) {
      setWorkflow(initialWorkflow);
      // If tools are already selected (from bundle), hide tool selection initially
      setShowToolSelection(initialWorkflow.tools.length === 0);
    } else {
      // If no initial workflow, show tool selection
      setShowToolSelection(true);
    }
  }, [initialWorkflow]);

  // Real-time validation
  const validateWorkflow = useCallback((currentWorkflow: EnterpriseWorkflow): WorkflowValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Required field validation
    if (!currentWorkflow.name.trim()) {
      errors.push('Workflow name is required');
    }
    // COMMENTED OUT - Description validation (field is commented out)
    // if (!currentWorkflow.description.trim()) {
    //   errors.push('Workflow description is required');
    // }
    if (!currentWorkflow.useCase.trim()) {
      errors.push('Use case description is required');
    }
    if (currentWorkflow.tools.length === 0) {
      errors.push('At least one tool must be selected');
    }

    // Business validation
    if (currentWorkflow.tools.length > 10) {
      warnings.push('Consider reducing the number of tools for better manageability');
    }
    if (currentWorkflow.totalCost > 1000) {
      warnings.push('High monthly cost detected. Consider cost optimization.');
    }

    // Suggestions
    if (currentWorkflow.tools.length < 3) {
      suggestions.push('Consider adding complementary tools to create a more comprehensive workflow');
    }
    if (!currentWorkflow.metadata.tags.length) {
      suggestions.push('Add tags to improve workflow discoverability');
    }
    if (showComplianceFeatures && !currentWorkflow.complianceRequirements?.length) {
      suggestions.push('Consider adding compliance requirements for enterprise governance');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }, [showComplianceFeatures]);

  // Update validation when workflow changes
  useEffect(() => {
    const validationResult = validateWorkflow(workflow);
    setValidation(validationResult);
  }, [workflow, validateWorkflow]);

  // Calculate total cost with enterprise considerations
  const calculateTotalCost = useCallback((selectedTools: Tool[]): number => {
    const baseCost = selectedTools.reduce((total, tool) => {
      const price = tool.pricing.startingPrice
        ? parseFloat(tool.pricing.startingPrice.replace(/[^0-9.]/g, ''))
        : 0;
      return total + price;
    }, 0);

    // Add enterprise overhead (licensing, support, training)
    const enterpriseMultiplier = selectedTools.length > 5 ? 1.15 : 1.1;
    return Math.round(baseCost * enterpriseMultiplier * 100) / 100;
  }, []);

  // Enhanced tool filtering
  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.categoryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      tool.categoryId === selectedCategory;
    
    const notSelected = !workflow.tools.some(selectedTool => selectedTool.id === tool.id);
    
    return matchesSearch && matchesCategory && notSelected;
  });

  // AI Recommendation Logic (from BundleCreator)
  const findRecommendedBundle = useCallback((useCaseText: string) => {
    const useCaseMap = {
      'healthcare': ['medical', 'health', 'patient', 'clinical', 'doctor', 'nurse', 'hospital', 'diagnosis', 'treatment', 'medicine', 'healthcare', 'wellness', 'therapy', 'psychiatric', 'mental health', 'pharmacy', 'drug', 'pathology', 'radiology', 'surgery', 'surgical', 'telemedicine', 'genomics', 'oncology', 'cancer'],
      'diagnostic-ai': ['diagnosis', 'diagnostic', 'pathology', 'radiology', 'imaging', 'medical imaging', 'cancer detection', 'tumor', 'x-ray', 'mri', 'ct scan', 'oncology'],
      'medical-research': ['drug discovery', 'pharmaceutical', 'research', 'genomics', 'biotech', 'clinical trial', 'molecular', 'dna', 'genetics', 'variant calling'],
      'clinical-ops': ['telemedicine', 'pharmacy', 'medication', 'digital health', 'remote monitoring', 'patient management', 'clinical operations'],
      'patient-support': ['patient', 'symptom', 'mental health', 'wellness', 'nutrition', 'chatbot', 'health assessment', 'therapy', 'counseling'],
      'surgical-ai': ['surgery', 'surgical', 'operative', 'vr', 'surgical planning', 'training', 'simulation'],
      'education': ['teach', 'learn', 'course', 'student', 'education', 'academic', 'training'],
      'automation': ['automate', 'workflow', 'process', 'integrate', 'devops', 'deploy', 'ci/cd'],
      'data': ['analysis', 'data', 'insight', 'visualization', 'report', 'analytics'],
      'agent': ['agent', 'autonomous', 'agentic', 'automate', 'bot'],
      'research': ['research', 'study', 'analyze', 'literature', 'academic', 'paper', 'citation'],
      'content': ['content', 'create', 'write', 'blog', 'article', 'copy', 'marketing'],
      'visual': ['presentation', 'diagram', 'visual', 'design', 'image'],
      'document': ['document', 'documents', 'writing', 'report', 'proposal', 'contract', 'legal', 'resume', 'cv', 'business plan', 'essay', 'letter'],
      'code': ['code', 'coding', 'programming', 'development', 'software', 'app', 'website', 'frontend', 'backend', 'mobile', 'web', 'api', 'github', 'javascript', 'python', 'react'],
      'mobile': ['mobile', 'app', 'android', 'ios', 'flutter', 'react native', 'smartphone'],
      'frontend': ['frontend', 'ui', 'ux', 'web design', 'website', 'react', 'component', 'html', 'css'],
      'legal': ['legal', 'law', 'contract', 'compliance', 'attorney', 'lawyer', 'litigation'],
      'career': ['resume', 'cv', 'job', 'career', 'interview', 'cover letter', 'professional'],
      'marketing': ['marketing', 'campaign', 'copy', 'sales', 'conversion', 'advertising', 'promotion'],
      'creative': ['creative', 'story', 'novel', 'fiction', 'writing', 'screenplay', 'poetry'],
      'business': ['business', 'professional', 'corporate', 'enterprise', 'proposal', 'plan']
    };

    const text = useCaseText.toLowerCase();
    
    // Find matching categories based on keywords
    const matchingCategories = Object.entries(useCaseMap).filter(([category, keywords]) =>
      keywords.some(keyword => text.includes(keyword))
    ).map(([category]) => category);

    if (matchingCategories.length === 0) {
      // If no direct category match, try finding bundle by text similarity
      return workflowBundles.find(bundle => {
        const bundleText = (bundle.description + ' ' + bundle.name).toLowerCase();
        return bundleText.includes(text) || text.includes(bundleText);
      }) || null;
    }

    // Map categories to specific bundles - prioritize newer specialized bundles
    const categoryToBundleMap: { [key: string]: string } = {
      'healthcare': 'Healthcare AI Assistant',
      'diagnostic-ai': 'Advanced Diagnostic & Imaging Suite',
      'medical-research': 'Medical Research & Drug Discovery Suite',
      'clinical-ops': 'Clinical Operations & Telemedicine Bundle',
      'patient-support': 'Digital Health & Wellness Platform',
      'surgical-ai': 'Surgical Planning & Training Suite',
      'education': 'AI Learning Fundamentals',
      'automation': 'Enterprise DevOps Automation Suite',
      'data': 'Enterprise Data Analytics Suite',
      'agent': 'Autonomous Agent Workflow',
      'research': 'Academic Research & Writing Bundle',
      'content': 'Complete Content Creator Studio',
      'visual': 'Visual Collaboration & Diagramming Suite',
      'document': 'Professional Document Creation Suite',
      'code': 'AI-Powered Development Team',
      'mobile': 'Mobile App Development Bundle',
      'frontend': 'Frontend Development Accelerator',
      'legal': 'Legal Document Automation Suite',
      'career': 'Career Development Document Bundle',
      'marketing': 'Marketing Content Creation Workflow',
      'creative': 'Creative Writing & Content Studio',
      'business': 'Professional Document Creation Suite'
    };

    // Find matching bundle based on highest priority category
    for (const category of matchingCategories) {
      const recommendedBundleName = categoryToBundleMap[category];
      if (recommendedBundleName) {
        const bundle = workflowBundles.find(bundle => bundle.name === recommendedBundleName);
        if (bundle) return bundle;
      }
    }

    // Fallback to original logic
    return workflowBundles.find(bundle => {
      const bundleText = (bundle.description + ' ' + bundle.name).toLowerCase();
      return bundleText.includes(text) || text.includes(bundleText);
    }) || null;
  }, []);


  // Get unique categories for filter
  const categories = ['all', ...new Set(tools.map(tool => tool.categoryId))];

  // Template recommendation logic
  const findRecommendedTemplates = useCallback((useCaseText: string): WorkflowTemplate[] => {
    const allTemplates = [...organizationTemplates, ...getBuiltInTemplates()];
    
    if (!useCaseText || useCaseText.length < 5) return [];

    const keywords = useCaseText.toLowerCase().split(/\s+/);
    
    return allTemplates
      .map(template => {
        const relevanceScore = keywords.reduce((score, keyword) => {
          if (template.name.toLowerCase().includes(keyword) ||
              template.description.toLowerCase().includes(keyword) ||
              template.category.toLowerCase().includes(keyword)) {
            return score + 1;
          }
          return score;
        }, 0);
        
        return { template, relevanceScore };
      })
      .filter(({ relevanceScore }) => relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3)
      .map(({ template }) => template);
  }, [organizationTemplates]);

  // Built-in enterprise templates
  const getBuiltInTemplates = (): WorkflowTemplate[] => [
    {
      id: 'enterprise-dev',
      name: 'Enterprise Development Workflow',
      description: 'Comprehensive development workflow with CI/CD, security, and monitoring',
      category: 'Development',
      tools: tools.filter(t => ['github-copilot', 'cursor-ai', 'gitlab-ai'].includes(t.id)),
      isRecommended: true,
      complexity: 'Enterprise',
      estimatedSetupTime: '2-3 weeks',
      prerequisites: ['DevOps expertise', 'Security clearance', 'Enterprise licensing']
    },
    {
      id: 'compliance-docs',
      name: 'Compliance Documentation Suite',
      description: 'Regulatory-compliant document creation and management workflow',
      category: 'Documentation',
      tools: tools.filter(t => ['jasper-ai', 'grammarly-go', 'pandadoc-ai'].includes(t.id)),
      isRecommended: true,
      complexity: 'Advanced',
      estimatedSetupTime: '1-2 weeks',
      prerequisites: ['Compliance training', 'Legal review']
    }
  ];

  // Handle workflow updates
  const updateWorkflow = (updates: Partial<EnterpriseWorkflow>) => {
    setWorkflow(prev => ({
      ...prev,
      ...updates,
      metadata: {
        ...prev.metadata,
        lastModified: new Date(),
        version: incrementVersion(prev.metadata.version)
      }
    }));
  };

  const incrementVersion = (version: string): string => {
    const parts = version.split('.').map(Number);
    parts[2] = (parts[2] || 0) + 1;
    return parts.join('.');
  };

  // Enterprise-grade audit logging
  const addAuditEntry = useCallback((action: AuditEntry['action'], changes?: Record<string, any>, notes?: string) => {
    const auditEntry: AuditEntry = {
      id: Date.now().toString(),
      action,
      userId: 'current-user', // This would come from auth context
      userName: 'Current User', // This would come from auth context
      timestamp: new Date(),
      changes,
      notes
    };

    setWorkflow(prev => ({
      ...prev,
      auditLog: [...(prev.auditLog || []), auditEntry]
    }));
  }, []);

  // Approval workflow management
  const requestApproval = useCallback((approvers: string[], notes?: string) => {
    updateWorkflow({
      approvalWorkflow: {
        isEnabled: true,
        approvers,
        status: 'pending',
        requestedAt: new Date(),
        approvalNotes: notes
      },
      metadata: {
        ...workflow.metadata,
        status: 'draft' // Keep as draft until approved
      }
    });
    addAuditEntry('created', { approvers }, `Approval requested from ${approvers.length} approvers`);
  }, [workflow.metadata, addAuditEntry]);

  const approveWorkflow = useCallback((approverId: string, notes?: string) => {
    updateWorkflow({
      approvalWorkflow: {
        ...workflow.approvalWorkflow!,
        status: 'approved',
        currentApprover: approverId,
        approvedAt: new Date(),
        approvalNotes: notes
      },
      metadata: {
        ...workflow.metadata,
        status: 'published',
        approvedBy: approverId
      }
    });
    addAuditEntry('approved', { approverId }, notes);
  }, [workflow.approvalWorkflow, workflow.metadata, addAuditEntry]);

  // Version control management
  const createVersionSnapshot = useCallback((description: string) => {
    const newVersion = incrementVersion(workflow.versionControl?.currentVersion || '1.0.0');
    const snapshot: WorkflowVersion = {
      version: workflow.versionControl?.currentVersion || '1.0.0',
      createdAt: new Date(),
      createdBy: 'current-user',
      description,
      snapshot: { ...workflow }
    };

    updateWorkflow({
      versionControl: {
        ...workflow.versionControl!,
        currentVersion: newVersion,
        previousVersions: [...(workflow.versionControl?.previousVersions || []), snapshot],
        changeLog: [...(workflow.versionControl?.changeLog || []), `v${newVersion}: ${description}`]
      }
    });
    addAuditEntry('updated', { version: newVersion }, `Version ${newVersion} created: ${description}`);
  }, [workflow, addAuditEntry]);

  const restoreVersion = useCallback((version: string) => {
    const versionToRestore = workflow.versionControl?.previousVersions.find(v => v.version === version);
    if (versionToRestore && versionToRestore.snapshot) {
      setWorkflow(prev => ({
        ...versionToRestore.snapshot as EnterpriseWorkflow,
        id: prev.id, // Keep original ID
        versionControl: {
          ...prev.versionControl!,
          changeLog: [...(prev.versionControl?.changeLog || []), `Restored to version ${version}`]
        }
      }));
      addAuditEntry('updated', { restoredVersion: version }, `Workflow restored to version ${version}`);
    }
  }, [workflow.versionControl, addAuditEntry]);

  // Tool management
  const handleAddTool = (tool: Tool) => {
    const updatedTools = [...workflow.tools, tool];
    updateWorkflow({
      tools: updatedTools,
      totalCost: calculateTotalCost(updatedTools)
    });
  };

  const handleRemoveTool = (toolId: string) => {
    const updatedTools = workflow.tools.filter(t => t.id !== toolId);
    updateWorkflow({
      tools: updatedTools,
      totalCost: calculateTotalCost(updatedTools)
    });
  };

  // Template application
  const applyTemplate = (template: WorkflowTemplate) => {
    updateWorkflow({
      name: template.name,
      description: template.description,
      tools: template.tools,
      totalCost: calculateTotalCost(template.tools),
      template,
      metadata: {
        ...workflow.metadata,
        tags: [...workflow.metadata.tags, template.category.toLowerCase()]
      }
    });
    setActiveTab('builder');
  };

  // Apply recommended bundle to workflow
  const applyRecommendedBundle = useCallback((bundle: typeof workflowBundles[0]) => {
    updateWorkflow({
      name: bundle.name,
      description: bundle.description,
      tools: bundle.tools,
      totalCost: calculateTotalCost(bundle.tools)
    });
    setShowRecommendations(false);
  }, [calculateTotalCost]);

  // Use case change handler with AI recommendations
  const handleUseCaseChange = (text: string) => {
    updateWorkflow({ useCase: text });
    
    if (text.length > 5) {
      // COMMENTED OUT - Template recommendations
      // const templates = findRecommendedTemplates(text);
      // setRecommendedTemplates(templates);
      
      // AI Bundle Recommendations
      const recommended = findRecommendedBundle(text);
      if (recommended) {
        setRecommendedBundle(recommended);
        setShowRecommendations(true);
        
        // Also find alternative recommendations
        const alternatives = workflowBundles
          .filter(bundle => bundle.id !== recommended.id)
          .filter(bundle => {
            const bundleText = (bundle.description + ' ' + bundle.name).toLowerCase();
            return text.toLowerCase().split(' ').some(word =>
              word.length > 3 && bundleText.includes(word)
            );
          })
          .slice(0, 2);
        
        setAlternativeRecommendations(alternatives);
      } else {
        setRecommendedBundle(null);
        setAlternativeRecommendations([]);
        setShowRecommendations(false);
      }
    } else {
      // setRecommendedTemplates([]); // COMMENTED OUT
      setRecommendedBundle(null);
      setAlternativeRecommendations([]);
      setShowRecommendations(false);
    }
  };

  // Export functionality
  const handleExportWorkflow = () => {
    if (onExport) {
      onExport(workflow);
    } else {
      // Default export to JSON
      const dataStr = JSON.stringify(workflow, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `${workflow.name.replace(/\s+/g, '_')}_workflow.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.draft}>
        {status === 'published' ? 'Published' : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with workflow status and actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Workflow className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {workflow.name || 'Enterprise Workflow Creator'}
              </h2>
              <StatusBadge status={workflow.metadata.status} />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Version {workflow.metadata.version}
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {workflow.metadata.createdBy}
              </span>
              <span>
                Last modified: {workflow.metadata.lastModified.toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {!isReadOnly && (
              <>
                <Button
                  variant="outline"
                  onClick={handleExportWorkflow}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Export
                </Button>
                {onShare && (
                  <Button
                    variant="outline"
                    onClick={() => onShare(workflow)}
                    leftIcon={<Share2 className="h-4 w-4" />}
                  >
                    Share
                  </Button>
                )}
                <AuthenticatedSaveButton
                  workflow={workflow}
                  isValid={validation.isValid}
                  onSuccess={onSave}
                >
                  Save Workflow
                </AuthenticatedSaveButton>
              </>
            )}
          </div>
        </div>

        {/* Simplified Navigation - Focus on Workflow Builder */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <div className="border-blue-500 text-blue-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2">
              <Wand2 className="h-4 w-4" />
              <span>Workflow Builder</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Validation alerts */}
      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="space-y-2">
          {validation.errors.map((error, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          ))}
          {validation.warnings.map((warning, index) => (
            <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-yellow-700">{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab content */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="workflowName" className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Name *
                </label>
                <input
                  type="text"
                  id="workflowName"
                  value={workflow.name}
                  onChange={(e) => updateWorkflow({ name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a descriptive name for your workflow"
                  disabled={isReadOnly}
                />
              </div>

              {/* COMMENTED OUT - Description field */}
              {/* <div>
                <label htmlFor="workflowDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="workflowDescription"
                  value={workflow.description}
                  onChange={(e) => updateWorkflow({ description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the purpose and goals of this workflow"
                  rows={3}
                  disabled={isReadOnly}
                />
              </div> */}

              <div>
                <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-2">
                  Use Case & Requirements *
                </label>
                <textarea
                  id="useCase"
                  value={workflow.useCase}
                  onChange={(e) => handleUseCaseChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe what you're trying to accomplish, your requirements, and constraints..."
                  rows={4}
                  disabled={isReadOnly}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Bundle Recommendations */}
          {showRecommendations && recommendedBundle && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Wand2 className="h-5 w-5 text-blue-600 mr-2" />
                  AI Recommendation: Best Match Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="min-w-0 flex-1 mr-4">
                      <h3 className="text-lg font-medium text-blue-900 truncate">{recommendedBundle.name}</h3>
                      <p className="text-sm text-blue-700">{recommendedBundle.description}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Estimated Cost:</strong> {recommendedBundle.totalCost}
                      </p>
                    </div>
                    <Button
                      onClick={() => applyRecommendedBundle(recommendedBundle)}
                      className="bg-blue-500 hover:bg-blue-600 flex-shrink-0"
                      leftIcon={<Wand2 className="h-4 w-4" />}
                    >
                      Use This Bundle
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-blue-900">Implementation Steps:</h4>
                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                      {recommendedBundle.implementationSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Included Tools:</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendedBundle.tools.map((tool) => (
                        <Badge key={tool.id} variant="secondary" className="bg-blue-100 text-blue-800">
                          {tool.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Alternative Recommendations */}
                {alternativeRecommendations.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Alternative Suggestions:</h4>
                    <div className="space-y-3">
                      {alternativeRecommendations.map((bundle) => (
                        <div key={bundle.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                          <div className="min-w-0 flex-1 mr-4">
                            <h5 className="font-medium text-gray-900 truncate">{bundle.name}</h5>
                            <p className="text-sm text-gray-500">{bundle.description}</p>
                            <p className="text-xs text-gray-400 mt-1">Cost: {bundle.totalCost}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyRecommendedBundle(bundle)}
                            className="flex-shrink-0"
                          >
                            Use Instead
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* COMMENTED OUT - Template Recommendations */}
          {/* {recommendedTemplates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  Recommended Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <Badge variant="outline">{template.complexity}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{template.estimatedSetupTime}</span>
                        <Button
                          size="sm"
                          onClick={() => applyTemplate(template)}
                          leftIcon={<Wand2 className="h-3 w-3" />}
                          disabled={isReadOnly}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )} */}

          {/* Selected Tools Overview - Show first and prominently when tools are selected */}
          {workflow.tools.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-green-900">
                  <span className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Your Selected Tools ({workflow.tools.length})
                  </span>
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    <span className="text-lg font-semibold text-green-700">
                      ${workflow.totalCost}/month
                    </span>
                  </div>
                </CardTitle>
                {workflow.tools.length > 0 && (
                  <p className="text-sm text-green-700 mt-1">
                    These tools are included in your workflow. You can remove them or add more tools below.
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflow.tools.map(tool => (
                    <div key={tool.id} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{tool.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{tool.pricing.startingPrice || 'Free'}</Badge>
                          {!isReadOnly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTool(tool.id)}
                              leftIcon={<X className="h-4 w-4" />}
                              className="text-gray-500 hover:text-red-500"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{tool.description || tool.shortDescription}</p>
                      
                      {tool.features && (
                        <div className="mb-3">
                          <h5 className="text-xs font-semibold text-gray-700 mb-1">Key Features:</h5>
                          <div className="flex flex-wrap gap-1">
                            {tool.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Cost breakdown and ROI estimation */}
                <div className="mt-6 bg-green-100 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">Enterprise Cost Analysis</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-green-700">Monthly Licenses:</span>
                      <div className="font-semibold text-green-900">${workflow.totalCost}</div>
                    </div>
                    <div>
                      <span className="text-green-700">Annual Cost:</span>
                      <div className="font-semibold text-green-900">${(workflow.totalCost * 12).toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-green-700">Setup Time:</span>
                      <div className="font-semibold text-green-900">2-4 weeks</div>
                    </div>
                    <div>
                      <span className="text-green-700">Team Size:</span>
                      <div className="font-semibold text-green-900">1-5 users</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tool Selection - Collapsible section for adding more tools */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 text-blue-600 mr-2" />
                  Add More Tools
                  {workflow.tools.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      Optional
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowToolSelection(!showToolSelection)}
                  className="flex items-center"
                  disabled={isReadOnly}
                >
                  {showToolSelection ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Tools
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Browse Tools
                    </>
                  )}
                </Button>
              </div>
              {!showToolSelection && workflow.tools.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Your workflow is ready to use! Click "Browse Tools" if you want to add more tools.
                </p>
              )}
            </CardHeader>
            {(showToolSelection || workflow.tools.length === 0) && (
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search tools by name, category, or description"
                      disabled={isReadOnly}
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isReadOnly}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {filteredTools.map(tool => (
                    <Card key={tool.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium truncate flex-1 mr-4">{tool.name}</CardTitle>
                        <Button
                          size="sm"
                          onClick={() => handleAddTool(tool)}
                          leftIcon={<Plus className="h-4 w-4" />}
                          className="flex-shrink-0"
                          disabled={isReadOnly}
                        >
                          Add
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-2">{tool.shortDescription}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{tool.pricing.startingPrice || 'Free'}</Badge>
                          <Badge variant="secondary">{tool.categoryId}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}




      {/* COMMENTED OUT - Compliance Tab */}
      {false && activeTab === 'compliance' && showComplianceFeatures && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              Compliance & Governance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compliance Requirements
              </label>
              <div className="space-y-2">
                {['GDPR', 'HIPAA', 'SOX', 'ISO 27001', 'PCI DSS'].map((requirement) => (
                  <label key={requirement} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={workflow.complianceRequirements?.includes(requirement) || false}
                      onChange={(e) => {
                        const current = workflow.complianceRequirements || [];
                        const updated = e.target.checked
                          ? [...current, requirement]
                          : current.filter(r => r !== requirement);
                        updateWorkflow({ complianceRequirements: updated });
                      }}
                      className="mr-2"
                      disabled={isReadOnly}
                    />
                    <span className="text-sm text-gray-700">{requirement}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compliance Notes
              </label>
              <textarea
                value={workflow.metadata.complianceNotes || ''}
                onChange={(e) => updateWorkflow({
                  metadata: { ...workflow.metadata, complianceNotes: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Document compliance considerations and requirements"
                rows={4}
                disabled={isReadOnly}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Integration Notes
              </label>
              <textarea
                value={workflow.integrationNotes || ''}
                onChange={(e) => updateWorkflow({ integrationNotes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Document integration requirements and security considerations"
                rows={3}
                disabled={isReadOnly}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Workflow Tab */}
      {/* COMMENTED OUT - Approval Workflow Tab */}
      {false && activeTab === 'approval-workflow' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 text-green-600 mr-2" />
              Approval Workflow Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable Approval Workflow */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Enable Approval Workflow</h4>
                <p className="text-sm text-gray-600">Require approval before workflow can be published</p>
              </div>
              <button
                onClick={() => updateWorkflow({
                  approvalWorkflow: {
                    ...workflow.approvalWorkflow!,
                    isEnabled: !workflow.approvalWorkflow!.isEnabled
                  }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  workflow.approvalWorkflow!.isEnabled ? 'bg-green-600' : 'bg-gray-200'
                }`}
                disabled={isReadOnly}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    workflow.approvalWorkflow!.isEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {workflow.approvalWorkflow!.isEnabled && (
              <div className="space-y-4">
                {/* Approvers List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approvers
                  </label>
                  <div className="space-y-2">
                    {workflow.approvalWorkflow!.approvers.map((approver, index) => (
                      <div key={index} className="flex items-center justify-between bg-white border rounded-md p-3">
                        <span className="text-sm text-gray-900">{approver}</span>
                        {!isReadOnly && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const newApprovers = workflow.approvalWorkflow!.approvers.filter((_, i) => i !== index);
                              updateWorkflow({
                                approvalWorkflow: { ...workflow.approvalWorkflow!, approvers: newApprovers }
                              });
                            }}
                            leftIcon={<X className="h-3 w-3" />}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    {!isReadOnly && (
                      <div className="flex space-x-2">
                        <input
                          type="email"
                          placeholder="Enter approver email"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              const newApprover = e.currentTarget.value.trim();
                              if (!workflow.approvalWorkflow!.approvers.includes(newApprover)) {
                                updateWorkflow({
                                  approvalWorkflow: {
                                    ...workflow.approvalWorkflow!,
                                    approvers: [...workflow.approvalWorkflow!.approvers, newApprover]
                                  }
                                });
                              }
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          leftIcon={<Plus className="h-4 w-4" />}
                          onClick={() => {
                            const input = document.querySelector('input[placeholder="Enter approver email"]') as HTMLInputElement;
                            if (input && input.value.trim()) {
                              const newApprover = input.value.trim();
                              if (!workflow.approvalWorkflow!.approvers.includes(newApprover)) {
                                updateWorkflow({
                                  approvalWorkflow: {
                                    ...workflow.approvalWorkflow!,
                                    approvers: [...workflow.approvalWorkflow!.approvers, newApprover]
                                  }
                                });
                              }
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Approval Status */}
                {workflow.approvalWorkflow!.status !== 'none' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Current Approval Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Status:</span>
                        <Badge className={
                          workflow.approvalWorkflow!.status === 'approved' ? 'bg-green-100 text-green-800' :
                          workflow.approvalWorkflow!.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {workflow.approvalWorkflow!.status.charAt(0).toUpperCase() + workflow.approvalWorkflow!.status.slice(1)}
                        </Badge>
                      </div>
                      {workflow.approvalWorkflow?.requestedAt && (
                        <div className="flex justify-between">
                          <span className="text-blue-700">Requested At:</span>
                          <span className="text-blue-900">{workflow.approvalWorkflow?.requestedAt?.toLocaleString()}</span>
                        </div>
                      )}
                      {workflow.approvalWorkflow?.approvedAt && (
                        <div className="flex justify-between">
                          <span className="text-blue-700">Approved At:</span>
                          <span className="text-blue-900">{workflow.approvalWorkflow?.approvedAt?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Approval Actions */}
                {!isReadOnly && workflow.approvalWorkflow!.approvers.length > 0 && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => requestApproval(workflow.approvalWorkflow!.approvers, 'Approval requested')}
                      leftIcon={<Bell className="h-4 w-4" />}
                      disabled={workflow.approvalWorkflow!.status === 'pending'}
                    >
                      Request Approval
                    </Button>
                    {workflow.approvalWorkflow!.status === 'pending' && (
                      <Button
                        variant="outline"
                        onClick={() => approveWorkflow('current-user', 'Auto-approved by creator')}
                        leftIcon={<CheckCircle className="h-4 w-4" />}
                      >
                        Approve (Demo)
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Audit Logging Tab */}
      {/* COMMENTED OUT - Audit Logging Tab */}
      {false && activeTab === 'audit-logging' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 text-purple-600 mr-2" />
              Audit Logging & Activity History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Audit Log Entries */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
              {workflow.auditLog?.length ? (
                <div className="space-y-3">
                  {workflow.auditLog?.slice(-10).reverse().map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant={
                            entry.action === 'created' ? 'default' :
                            entry.action === 'updated' ? 'secondary' :
                            entry.action === 'approved' ? 'default' :
                            'outline'
                          }>
                            {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{entry.userName}</p>
                            <p className="text-xs text-gray-500">{entry.timestamp.toLocaleString()}</p>
                          </div>
                        </div>
                        <Activity className="h-4 w-4 text-gray-400" />
                      </div>
                      {entry.notes && (
                        <p className="mt-2 text-sm text-gray-600">{entry.notes}</p>
                      )}
                      {entry.changes && Object.keys(entry.changes).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            View Changes
                          </summary>
                          <pre className="mt-1 text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
                            {JSON.stringify(entry.changes, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No audit entries yet</p>
                </div>
              )}
            </div>

            {/* Audit Settings */}
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Audit Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Enable Detailed Logging</p>
                    <p className="text-xs text-gray-500">Log all changes and user interactions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" disabled={isReadOnly} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Export Audit Logs</p>
                    <p className="text-xs text-gray-500">Download complete audit trail</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Download className="h-4 w-4" />}
                    onClick={() => {
                      const auditData = JSON.stringify(workflow.auditLog, null, 2);
                      const blob = new Blob([auditData], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${workflow.name}_audit_log.json`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Version Control Tab */}
      {/* COMMENTED OUT - Version Control Tab */}
      {false && activeTab === 'version-control' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GitBranch className="h-5 w-5 text-blue-600 mr-2" />
              Version Control & History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Version Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900">Current Version</h4>
                <Badge className="bg-blue-100 text-blue-800">
                  v{workflow.versionControl?.currentVersion}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Auto-save:</span>
                  <span className="ml-2 text-blue-900">
                    {workflow.versionControl?.autoSave ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Backup:</span>
                  <span className="ml-2 text-blue-900">
                    {workflow.versionControl?.backupEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Version History */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Version History</h4>
                {!isReadOnly && (
                  <Button
                    size="sm"
                    onClick={() => {
                      const description = prompt('Enter version description:');
                      if (description) {
                        createVersionSnapshot(description);
                      }
                    }}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Create Snapshot
                  </Button>
                )}
              </div>

              {workflow.versionControl?.previousVersions?.length ? (
                <div className="space-y-3">
                  {workflow.versionControl?.previousVersions?.slice(-5).reverse().map((version) => (
                    <div key={version.version} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">v{version.version}</Badge>
                          <span className="text-sm text-gray-600">{version.description}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{version.createdAt.toLocaleDateString()}</span>
                          {!isReadOnly && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => restoreVersion(version.version)}
                              leftIcon={<History className="h-3 w-3" />}
                            >
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Created by {version.createdBy}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <GitBranch className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No previous versions</p>
                </div>
              )}
            </div>

            {/* Change Log */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Change Log</h4>
              {workflow.versionControl?.changeLog?.length ? (
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <ul className="space-y-2 text-sm">
                    {workflow.versionControl?.changeLog?.slice(-10).reverse().map((change, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No change log entries</p>
              )}
            </div>

            {/* Version Control Settings */}
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Version Control Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Auto-save</p>
                    <p className="text-xs text-gray-500">Automatically save changes</p>
                  </div>
                  <button
                    onClick={() => updateWorkflow({
                      versionControl: {
                        ...workflow.versionControl!,
                        autoSave: !workflow.versionControl!.autoSave
                      }
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      workflow.versionControl!.autoSave ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    disabled={isReadOnly}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        workflow.versionControl!.autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Backup Enabled</p>
                    <p className="text-xs text-gray-500">Keep backup copies of versions</p>
                  </div>
                  <button
                    onClick={() => updateWorkflow({
                      versionControl: {
                        ...workflow.versionControl!,
                        backupEnabled: !workflow.versionControl!.backupEnabled
                      }
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      workflow.versionControl!.backupEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    disabled={isReadOnly}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        workflow.versionControl!.backupEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions panel */}
      {validation.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 text-yellow-500 mr-2" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {validation.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};