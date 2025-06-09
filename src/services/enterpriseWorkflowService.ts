import { supabase } from '../lib/supabase';
import { 
  createWorkflow, 
  updateWorkflow, 
  deleteWorkflow, 
  createToolBundle,
  updateToolBundle,
  deleteToolBundle,
  saveItem,
  unsaveItem
} from '../database/workflows';
import type { Workflow, ToolBundle } from '../database/types';

// Enterprise workflow interfaces
export interface EnterpriseWorkflow {
  id?: string;
  name: string;
  description: string;
  useCase: string;
  tools: any[];
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

export interface ApprovalWorkflow {
  isEnabled: boolean;
  approvers: string[];
  currentApprover?: string;
  status: 'pending' | 'approved' | 'rejected' | 'none';
  approvalNotes?: string;
  requestedAt?: Date;
  approvedAt?: Date;
}

export interface AuditEntry {
  id: string;
  action: 'created' | 'updated' | 'approved' | 'rejected' | 'shared' | 'exported' | 'archived';
  userId: string;
  userName: string;
  timestamp: Date;
  changes?: Record<string, any>;
  notes?: string;
}

export interface VersionControl {
  currentVersion: string;
  previousVersions: WorkflowVersion[];
  changeLog: string[];
  autoSave: boolean;
  backupEnabled: boolean;
}

export interface WorkflowVersion {
  version: string;
  createdAt: Date;
  createdBy: string;
  description: string;
  snapshot: Partial<EnterpriseWorkflow>;
}

export interface WorkflowMetadata {
  version: string;
  lastModified: Date;
  createdBy: string;
  approvedBy?: string;
  status: 'draft' | 'published' | 'archived' | 'approved' | 'review';
  tags: string[];
  department?: string;
  businessUnit?: string;
  complianceNotes?: string;
}

export interface CollaborationSettings {
  isShared: boolean;
  permissions: 'view' | 'edit' | 'admin';
  sharedWith: string[];
  allowComments: boolean;
  requireApproval: boolean;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tools: any[];
  isRecommended: boolean;
  complexity: 'Basic' | 'Intermediate' | 'Advanced' | 'Enterprise';
  estimatedSetupTime: string;
  prerequisites: string[];
}

export interface WorkflowValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface WorkflowAuditLog {
  id: string;
  workflowId: string;
  userId: string;
  action: 'created' | 'updated' | 'approved' | 'archived' | 'shared' | 'commented';
  changes?: Record<string, any>;
  timestamp: Date;
  notes?: string;
}

export interface WorkflowComment {
  id: string;
  workflowId: string;
  userId: string;
  userName: string;
  content: string;
  isResolved: boolean;
  createdAt: Date;
  parentCommentId?: string;
}

export interface WorkflowApproval {
  id: string;
  workflowId: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  reviewedAt?: Date;
  notes?: string;
}

class EnterpriseWorkflowService {
  // Workflow CRUD with enterprise features
  async createEnterpriseWorkflow(workflow: EnterpriseWorkflow, userId: string): Promise<EnterpriseWorkflow> {
    try {
      // Convert to database format
      const dbWorkflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'> = {
        creator_id: userId,
        title: workflow.name,
        description: workflow.description,
        is_public: workflow.collaboration.isShared,
        tags: workflow.metadata.tags,
        metadata: {
          useCase: workflow.useCase,
          tools: workflow.tools,
          totalCost: workflow.totalCost,
          estimatedROI: workflow.estimatedROI,
          riskAssessment: workflow.riskAssessment,
          complianceRequirements: workflow.complianceRequirements,
          integrationNotes: workflow.integrationNotes,
          maintenanceSchedule: workflow.maintenanceSchedule,
          collaboration: workflow.collaboration,
          businessMetadata: {
            department: workflow.metadata.department,
            businessUnit: workflow.metadata.businessUnit,
            complianceNotes: workflow.metadata.complianceNotes,
          }
        },
        version: parseInt(workflow.metadata.version.split('.')[0]) || 1,
        status: (workflow.metadata.status === 'approved' || workflow.metadata.status === 'review') ? 'published' : workflow.metadata.status as 'draft' | 'published' | 'archived'
      };

      const createdWorkflow = await createWorkflow(dbWorkflow);
      
      // Log the creation
      await this.logWorkflowAction(createdWorkflow.id, userId, 'created', {
        name: workflow.name,
        toolCount: workflow.tools.length
      });

      // If approval is required, create approval request
      if (workflow.collaboration.requireApproval && workflow.metadata.status === 'review') {
        await this.createApprovalRequest(createdWorkflow.id, userId);
      }

      return this.mapDbWorkflowToEnterprise(createdWorkflow);
    } catch (error) {
      console.error('Error creating enterprise workflow:', error);
      throw new Error('Failed to create workflow');
    }
  }

  async updateEnterpriseWorkflow(workflowId: string, workflow: EnterpriseWorkflow, userId: string): Promise<EnterpriseWorkflow> {
    try {
      const updates: Partial<Workflow> = {
        title: workflow.name,
        description: workflow.description,
        is_public: workflow.collaboration.isShared,
        tags: workflow.metadata.tags,
        metadata: {
          useCase: workflow.useCase,
          tools: workflow.tools,
          totalCost: workflow.totalCost,
          estimatedROI: workflow.estimatedROI,
          riskAssessment: workflow.riskAssessment,
          complianceRequirements: workflow.complianceRequirements,
          integrationNotes: workflow.integrationNotes,
          maintenanceSchedule: workflow.maintenanceSchedule,
          collaboration: workflow.collaboration,
          businessMetadata: {
            department: workflow.metadata.department,
            businessUnit: workflow.metadata.businessUnit,
            complianceNotes: workflow.metadata.complianceNotes,
          }
        },
        status: (workflow.metadata.status === 'approved' || workflow.metadata.status === 'review') ? 'published' : workflow.metadata.status as 'draft' | 'published' | 'archived'
      };

      const updatedWorkflow = await updateWorkflow(workflowId, updates);
      
      // Log the update
      await this.logWorkflowAction(workflowId, userId, 'updated', {
        changes: updates
      });

      return this.mapDbWorkflowToEnterprise(updatedWorkflow);
    } catch (error) {
      console.error('Error updating enterprise workflow:', error);
      throw new Error('Failed to update workflow');
    }
  }

  async deleteEnterpriseWorkflow(workflowId: string, userId: string): Promise<void> {
    try {
      await deleteWorkflow(workflowId);
      
      // Log the deletion
      await this.logWorkflowAction(workflowId, userId, 'archived', {
        reason: 'Deleted by user'
      });
    } catch (error) {
      console.error('Error deleting enterprise workflow:', error);
      throw new Error('Failed to delete workflow');
    }
  }

  // Workflow validation
  validateWorkflow(workflow: EnterpriseWorkflow): WorkflowValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Required field validation
    if (!workflow.name?.trim()) {
      errors.push('Workflow name is required');
    }
    if (!workflow.description?.trim()) {
      errors.push('Workflow description is required');
    }
    if (!workflow.useCase?.trim()) {
      errors.push('Use case description is required');
    }
    if (!workflow.tools?.length) {
      errors.push('At least one tool must be selected');
    }

    // Business validation
    if (workflow.tools?.length > 10) {
      warnings.push('Consider reducing the number of tools for better manageability');
    }
    if (workflow.totalCost > 1000) {
      warnings.push('High monthly cost detected. Consider cost optimization.');
    }
    if (workflow.collaboration.isShared && !workflow.metadata.department) {
      warnings.push('Department should be specified for shared workflows');
    }

    // Security validation
    if (workflow.complianceRequirements?.includes('HIPAA') && workflow.collaboration.isShared) {
      warnings.push('HIPAA workflows require careful sharing controls');
    }
    if (workflow.complianceRequirements?.includes('PCI DSS') && workflow.tools.some(tool => tool.category === 'payment')) {
      warnings.push('PCI DSS compliance requires additional security measures');
    }

    // Suggestions
    if (workflow.tools?.length < 3) {
      suggestions.push('Consider adding complementary tools to create a more comprehensive workflow');
    }
    if (!workflow.metadata.tags?.length) {
      suggestions.push('Add tags to improve workflow discoverability');
    }
    if (!workflow.estimatedROI) {
      suggestions.push('Consider documenting expected ROI for better business case');
    }
    if (!workflow.riskAssessment) {
      suggestions.push('Add risk assessment for enterprise governance');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  // Template management
  async getOrganizationTemplates(organizationId: string): Promise<WorkflowTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching organization templates:', error);
      return [];
    }
  }

  async createTemplate(template: Omit<WorkflowTemplate, 'id'>, organizationId: string): Promise<WorkflowTemplate> {
    try {
      const { data, error } = await supabase
        .from('workflow_templates')
        .insert([{
          ...template,
          organization_id: organizationId,
          created_at: new Date().toISOString(),
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw new Error('Failed to create template');
    }
  }

  // Collaboration features
  async shareWorkflow(workflowId: string, userIds: string[], permissions: 'view' | 'edit', sharedBy: string): Promise<void> {
    try {
      const shareData = userIds.map(userId => ({
        workflow_id: workflowId,
        user_id: userId,
        permissions,
        shared_by: sharedBy,
        shared_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('workflow_shares')
        .insert(shareData);

      if (error) throw error;

      // Log the sharing action
      await this.logWorkflowAction(workflowId, sharedBy, 'shared', {
        sharedWith: userIds,
        permissions
      });
    } catch (error) {
      console.error('Error sharing workflow:', error);
      throw new Error('Failed to share workflow');
    }
  }

  async addComment(workflowId: string, userId: string, userName: string, content: string, parentCommentId?: string): Promise<WorkflowComment> {
    try {
      const { data, error } = await supabase
        .from('workflow_comments')
        .insert([{
          workflow_id: workflowId,
          user_id: userId,
          user_name: userName,
          content,
          parent_comment_id: parentCommentId,
          created_at: new Date().toISOString(),
          is_resolved: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Log the comment action
      await this.logWorkflowAction(workflowId, userId, 'commented', {
        commentLength: content.length,
        isReply: !!parentCommentId
      });

      return {
        id: data.id,
        workflowId: data.workflow_id,
        userId: data.user_id,
        userName: data.user_name,
        content: data.content,
        isResolved: data.is_resolved,
        createdAt: new Date(data.created_at),
        parentCommentId: data.parent_comment_id
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment');
    }
  }

  async getWorkflowComments(workflowId: string): Promise<WorkflowComment[]> {
    try {
      const { data, error } = await supabase
        .from('workflow_comments')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(comment => ({
        id: comment.id,
        workflowId: comment.workflow_id,
        userId: comment.user_id,
        userName: comment.user_name,
        content: comment.content,
        isResolved: comment.is_resolved,
        createdAt: new Date(comment.created_at),
        parentCommentId: comment.parent_comment_id
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  // Approval workflow
  async createApprovalRequest(workflowId: string, requestedBy: string, notes?: string): Promise<WorkflowApproval> {
    try {
      const { data, error } = await supabase
        .from('workflow_approvals')
        .insert([{
          workflow_id: workflowId,
          requested_by: requestedBy,
          status: 'pending',
          requested_at: new Date().toISOString(),
          notes
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        workflowId: data.workflow_id,
        requestedBy: data.requested_by,
        approvedBy: data.approved_by,
        status: data.status,
        requestedAt: new Date(data.requested_at),
        reviewedAt: data.reviewed_at ? new Date(data.reviewed_at) : undefined,
        notes: data.notes
      };
    } catch (error) {
      console.error('Error creating approval request:', error);
      throw new Error('Failed to create approval request');
    }
  }

  async approveWorkflow(approvalId: string, approvedBy: string, notes?: string): Promise<void> {
    try {
      const { data: approval, error: approvalError } = await supabase
        .from('workflow_approvals')
        .update({
          approved_by: approvedBy,
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          notes
        })
        .eq('id', approvalId)
        .select()
        .single();

      if (approvalError) throw approvalError;

      // Update workflow status
      await updateWorkflow(approval.workflow_id, { status: 'published' });

      // Log the approval
      await this.logWorkflowAction(approval.workflow_id, approvedBy, 'approved', {
        approvalId,
        notes
      });
    } catch (error) {
      console.error('Error approving workflow:', error);
      throw new Error('Failed to approve workflow');
    }
  }

  // Audit logging
  private async logWorkflowAction(
    workflowId: string, 
    userId: string, 
    action: WorkflowAuditLog['action'], 
    changes?: Record<string, any>,
    notes?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('workflow_audit_logs')
        .insert([{
          workflow_id: workflowId,
          user_id: userId,
          action,
          changes,
          timestamp: new Date().toISOString(),
          notes
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging workflow action:', error);
      // Don't throw here as this is a background operation
    }
  }

  async getWorkflowAuditLog(workflowId: string): Promise<WorkflowAuditLog[]> {
    try {
      const { data, error } = await supabase
        .from('workflow_audit_logs')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return (data || []).map(log => ({
        id: log.id,
        workflowId: log.workflow_id,
        userId: log.user_id,
        action: log.action,
        changes: log.changes,
        timestamp: new Date(log.timestamp),
        notes: log.notes
      }));
    } catch (error) {
      console.error('Error fetching audit log:', error);
      return [];
    }
  }

  // Export functionality
  async exportWorkflow(workflow: EnterpriseWorkflow, format: 'json' | 'yaml' | 'csv'): Promise<string> {
    try {
      switch (format) {
        case 'json':
          return JSON.stringify(workflow, null, 2);
        
        case 'yaml':
          // Basic YAML export (you might want to use a proper YAML library)
          return this.convertToYAML(workflow);
        
        case 'csv':
          return this.convertToCSV(workflow);
        
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Error exporting workflow:', error);
      throw new Error('Failed to export workflow');
    }
  }

  // Helper methods
  private mapDbWorkflowToEnterprise(dbWorkflow: Workflow): EnterpriseWorkflow {
    const metadata = dbWorkflow.metadata as any;
    
    return {
      id: dbWorkflow.id,
      name: dbWorkflow.title,
      description: dbWorkflow.description || '',
      useCase: metadata?.useCase || '',
      tools: metadata?.tools || [],
      totalCost: metadata?.totalCost || 0,
      estimatedROI: metadata?.estimatedROI,
      riskAssessment: metadata?.riskAssessment,
      complianceRequirements: metadata?.complianceRequirements,
      integrationNotes: metadata?.integrationNotes,
      maintenanceSchedule: metadata?.maintenanceSchedule,
      metadata: {
        version: `${dbWorkflow.version}.0.0`,
        lastModified: dbWorkflow.updated_at,
        createdBy: dbWorkflow.creator_id,
        status: dbWorkflow.status === 'published' ? 'published' : dbWorkflow.status as 'draft' | 'published' | 'archived',
        tags: dbWorkflow.tags,
        department: metadata?.businessMetadata?.department,
        businessUnit: metadata?.businessMetadata?.businessUnit,
        complianceNotes: metadata?.businessMetadata?.complianceNotes,
      },
      collaboration: metadata?.collaboration || {
        isShared: dbWorkflow.is_public,
        permissions: 'view',
        sharedWith: [],
        allowComments: false,
        requireApproval: false
      }
    };
  }

  private convertToYAML(workflow: EnterpriseWorkflow): string {
    // Basic YAML conversion (for production, use a proper YAML library)
    return `name: "${workflow.name}"
description: "${workflow.description}"
useCase: "${workflow.useCase}"
tools:
${workflow.tools.map(tool => `  - name: "${tool.name}"\n    id: "${tool.id}"`).join('\n')}
totalCost: ${workflow.totalCost}
metadata:
  version: "${workflow.metadata.version}"
  status: "${workflow.metadata.status}"
  department: "${workflow.metadata.department || ''}"
  tags: [${workflow.metadata.tags.map(tag => `"${tag}"`).join(', ')}]`;
  }

  private convertToCSV(workflow: EnterpriseWorkflow): string {
    const headers = ['Tool Name', 'Tool ID', 'Category', 'Cost'];
    const rows = workflow.tools.map(tool => 
      [tool.name, tool.id, tool.categoryId || '', tool.pricing?.startingPrice || '0'].join(',')
    );
    
    return [
      `Workflow: ${workflow.name}`,
      `Description: ${workflow.description}`,
      `Total Cost: $${workflow.totalCost}`,
      '',
      headers.join(','),
      ...rows
    ].join('\n');
  }
}

export const enterpriseWorkflowService = new EnterpriseWorkflowService();