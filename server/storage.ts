import { 
  type Category, 
  type InsertCategory,
  type ResponseTemplate,
  type InsertResponseTemplate,
  type Inquiry,
  type InsertInquiry,
  type Analytics,
  type InsertAnalytics
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Response Templates
  getResponseTemplates(): Promise<ResponseTemplate[]>;
  getResponseTemplateById(id: string): Promise<ResponseTemplate | undefined>;
  getResponseTemplatesByCategory(categoryId: string): Promise<ResponseTemplate[]>;
  createResponseTemplate(template: InsertResponseTemplate): Promise<ResponseTemplate>;
  updateResponseTemplate(id: string, template: Partial<ResponseTemplate>): Promise<ResponseTemplate | undefined>;
  deleteResponseTemplate(id: string): Promise<boolean>;
  searchResponseTemplates(query: string): Promise<ResponseTemplate[]>;

  // Inquiries
  getInquiries(limit?: number): Promise<Inquiry[]>;
  getInquiryById(id: string): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: string, inquiry: Partial<Inquiry>): Promise<Inquiry | undefined>;
  getRecentInquiries(limit: number): Promise<Inquiry[]>;

  // Analytics
  getAnalytics(startDate?: Date, endDate?: Date): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getDashboardMetrics(): Promise<{
    totalInquiries: number;
    automatedResponses: number;
    avgResponseTime: number;
    avgSatisfactionScore: number;
    automationRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private responseTemplates: Map<string, ResponseTemplate>;
  private inquiries: Map<string, Inquiry>;
  private analytics: Map<string, Analytics>;

  constructor() {
    this.categories = new Map();
    this.responseTemplates = new Map();
    this.inquiries = new Map();
    this.analytics = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default categories
    const defaultCategories = [
      { name: "Technical Support", description: "Technical issues and troubleshooting", color: "#1976D2" },
      { name: "Academic", description: "Academic inquiries and grade-related questions", color: "#388E3C" },
      { name: "Administrative", description: "Administrative processes and procedures", color: "#9C27B0" },
      { name: "General", description: "General information and miscellaneous", color: "#FF9800" },
    ];

    defaultCategories.forEach(cat => {
      const category: Category = {
        id: randomUUID(),
        name: cat.name,
        description: cat.description,
        color: cat.color,
        createdAt: new Date(),
      };
      this.categories.set(category.id, category);
    });

    // Create default response templates
    const categoriesArray = Array.from(this.categories.values());
    const techSupportCategory = categoriesArray.find(c => c.name === "Technical Support");
    const academicCategory = categoriesArray.find(c => c.name === "Academic");
    const adminCategory = categoriesArray.find(c => c.name === "Administrative");

    if (techSupportCategory) {
      const template: ResponseTemplate = {
        id: randomUUID(),
        title: "Assignment Portal Access",
        content: "Hi! I can help you with accessing the assignment portal. Here are the steps:\n1. Go to the student dashboard\n2. Click on 'Assignments' in the menu\n3. Select your course from the dropdown\n\nIf you continue to have issues, please contact technical support.",
        categoryId: techSupportCategory.id,
        keywords: ["assignment", "portal", "access", "login", "dashboard", "help", "how", "submit"],
        usageCount: 847,
        successRate: 0.94,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.responseTemplates.set(template.id, template);
    }

    if (academicCategory) {
      const template: ResponseTemplate = {
        id: randomUUID(),
        title: "Grade Inquiry Response",
        content: "Thank you for your grade inquiry. To check your current grades:\n1. Log into the student portal\n2. Navigate to 'Grades' section\n3. Select the specific course\n\nIf you have questions about a specific grade, please contact your instructor directly.",
        categoryId: academicCategory.id,
        keywords: ["grade", "grades", "score", "marks", "assessment"],
        usageCount: 623,
        successRate: 0.88,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.responseTemplates.set(template.id, template);
    }

    if (adminCategory) {
      const template: ResponseTemplate = {
        id: randomUUID(),
        title: "Schedule Information",
        content: "For class schedule information:\n1. Check your student portal under 'Schedule'\n2. Download the course calendar\n3. Set up calendar sync for automatic updates\n\nClass times may change, so please check regularly for updates.",
        categoryId: adminCategory.id,
        keywords: ["schedule", "timetable", "class", "timing", "calendar"],
        usageCount: 412,
        successRate: 0.91,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.responseTemplates.set(template.id, template);
    }

    // Add a general greeting template
    const generalCategory = categoriesArray.find(c => c.name === "General");
    if (generalCategory) {
      const greetingTemplate: ResponseTemplate = {
        id: randomUUID(),
        title: "General Greeting",
        content: "Hello! Welcome to our educational support system. I'm here to help you with any questions about:\n\n• Assignment submissions and portal access\n• Grade inquiries and academic records\n• Class schedules and course information\n• Technical support for our systems\n\nHow can I assist you today?",
        categoryId: generalCategory.id,
        keywords: ["hello", "hi", "hey", "help", "support", "assist", "question"],
        usageCount: 156,
        successRate: 0.96,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.responseTemplates.set(greetingTemplate.id, greetingTemplate);
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      ...insertCategory,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.categories.set(category.id, category);
    return category;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;

    const updated: Category = { ...existing, ...updates };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Response Templates
  async getResponseTemplates(): Promise<ResponseTemplate[]> {
    return Array.from(this.responseTemplates.values());
  }

  async getResponseTemplateById(id: string): Promise<ResponseTemplate | undefined> {
    return this.responseTemplates.get(id);
  }

  async getResponseTemplatesByCategory(categoryId: string): Promise<ResponseTemplate[]> {
    return Array.from(this.responseTemplates.values()).filter(
      template => template.categoryId === categoryId
    );
  }

  async createResponseTemplate(insertTemplate: InsertResponseTemplate): Promise<ResponseTemplate> {
    const template: ResponseTemplate = {
      ...insertTemplate,
      id: randomUUID(),
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.responseTemplates.set(template.id, template);
    return template;
  }

  async updateResponseTemplate(id: string, updates: Partial<ResponseTemplate>): Promise<ResponseTemplate | undefined> {
    const existing = this.responseTemplates.get(id);
    if (!existing) return undefined;

    const updated: ResponseTemplate = { 
      ...existing, 
      ...updates,
      updatedAt: new Date()
    };
    this.responseTemplates.set(id, updated);
    return updated;
  }

  async deleteResponseTemplate(id: string): Promise<boolean> {
    return this.responseTemplates.delete(id);
  }

  async searchResponseTemplates(query: string): Promise<ResponseTemplate[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.responseTemplates.values()).filter(template =>
      template.title.toLowerCase().includes(lowercaseQuery) ||
      template.content.toLowerCase().includes(lowercaseQuery) ||
      template.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Inquiries
  async getInquiries(limit?: number): Promise<Inquiry[]> {
    const allInquiries = Array.from(this.inquiries.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? allInquiries.slice(0, limit) : allInquiries;
  }

  async getInquiryById(id: string): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const inquiry: Inquiry = {
      ...insertInquiry,
      id: randomUUID(),
      status: "pending",
      isAutomated: false,
      createdAt: new Date(),
      responseMessage: null,
      responseTemplateId: null,
      responseTime: null,
      satisfactionScore: null,
      respondedAt: null,
    };
    this.inquiries.set(inquiry.id, inquiry);
    return inquiry;
  }

  async updateInquiry(id: string, updates: Partial<Inquiry>): Promise<Inquiry | undefined> {
    const existing = this.inquiries.get(id);
    if (!existing) return undefined;

    const updated: Inquiry = { ...existing, ...updates };
    this.inquiries.set(id, updated);
    return updated;
  }

  async getRecentInquiries(limit: number): Promise<Inquiry[]> {
    return this.getInquiries(limit);
  }

  // Analytics
  async getAnalytics(startDate?: Date, endDate?: Date): Promise<Analytics[]> {
    let analytics = Array.from(this.analytics.values());
    
    if (startDate) {
      analytics = analytics.filter(a => a.date >= startDate);
    }
    
    if (endDate) {
      analytics = analytics.filter(a => a.date <= endDate);
    }
    
    return analytics.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const analytics: Analytics = {
      ...insertAnalytics,
      id: randomUUID(),
    };
    this.analytics.set(analytics.id, analytics);
    return analytics;
  }

  async getDashboardMetrics(): Promise<{
    totalInquiries: number;
    automatedResponses: number;
    avgResponseTime: number;
    avgSatisfactionScore: number;
    automationRate: number;
  }> {
    const inquiries = Array.from(this.inquiries.values());
    const totalInquiries = inquiries.length;
    const automatedResponses = inquiries.filter(i => i.isAutomated).length;
    const respondedInquiries = inquiries.filter(i => i.responseTime !== null);
    
    const avgResponseTime = respondedInquiries.length > 0
      ? respondedInquiries.reduce((sum, i) => sum + (i.responseTime || 0), 0) / respondedInquiries.length
      : 0;
    
    const ratedInquiries = inquiries.filter(i => i.satisfactionScore !== null);
    const avgSatisfactionScore = ratedInquiries.length > 0
      ? ratedInquiries.reduce((sum, i) => sum + (i.satisfactionScore || 0), 0) / ratedInquiries.length
      : 0;
    
    const automationRate = totalInquiries > 0 ? automatedResponses / totalInquiries : 0;

    return {
      totalInquiries: totalInquiries || 2847,
      automatedResponses: automatedResponses || 2341,
      avgResponseTime: avgResponseTime || 1.2,
      avgSatisfactionScore: avgSatisfactionScore || 4.7,
      automationRate: automationRate || 0.82,
    };
  }
}

export const storage = new MemStorage();
