import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertResponseTemplateSchema, insertInquirySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, updates);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update category" });
      }
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCategory(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Response Templates routes
  app.get("/api/response-templates", async (req, res) => {
    try {
      const { search, categoryId } = req.query;
      
      let templates;
      if (search) {
        templates = await storage.searchResponseTemplates(search as string);
      } else if (categoryId) {
        templates = await storage.getResponseTemplatesByCategory(categoryId as string);
      } else {
        templates = await storage.getResponseTemplates();
      }
      
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch response templates" });
    }
  });

  app.post("/api/response-templates", async (req, res) => {
    try {
      const templateData = insertResponseTemplateSchema.parse(req.body);
      const template = await storage.createResponseTemplate(templateData);
      res.json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid template data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create response template" });
      }
    }
  });

  app.put("/api/response-templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertResponseTemplateSchema.partial().parse(req.body);
      const template = await storage.updateResponseTemplate(id, updates);
      
      if (!template) {
        return res.status(404).json({ message: "Response template not found" });
      }
      
      res.json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid template data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update response template" });
      }
    }
  });

  app.delete("/api/response-templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteResponseTemplate(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Response template not found" });
      }
      
      res.json({ message: "Response template deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete response template" });
    }
  });

  // Inquiries routes
  app.get("/api/inquiries", async (req, res) => {
    try {
      const { limit } = req.query;
      const inquiries = await storage.getInquiries(limit ? parseInt(limit as string) : undefined);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(inquiryData);
      
      // Try to find automated response
      const templates = await storage.getResponseTemplates();
      const matchedTemplate = findBestMatchingTemplate(inquiry.message, templates);
      
      if (matchedTemplate) {
        const responseTime = Math.random() * 2 + 0.5; // 0.5-2.5 seconds
        const updatedInquiry = await storage.updateInquiry(inquiry.id, {
          responseTemplateId: matchedTemplate.id,
          responseMessage: matchedTemplate.content,
          responseTime,
          isAutomated: true,
          status: "responded",
          respondedAt: new Date(),
        });

        // Update template usage
        await storage.updateResponseTemplate(matchedTemplate.id, {
          usageCount: matchedTemplate.usageCount + 1,
        });

        res.json(updatedInquiry);
      } else {
        res.json(inquiry);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid inquiry data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create inquiry" });
      }
    }
  });

  app.put("/api/inquiries/:id/satisfaction", async (req, res) => {
    try {
      const { id } = req.params;
      const { score } = req.body;
      
      if (score < 1 || score > 5) {
        return res.status(400).json({ message: "Satisfaction score must be between 1 and 5" });
      }
      
      const inquiry = await storage.updateInquiry(id, {
        satisfactionScore: score,
      });
      
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update satisfaction score" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  app.get("/api/analytics/trends", async (req, res) => {
    try {
      // Generate mock trend data for the last 7 days
      const trends = [];
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const inquiryData = [180, 230, 195, 267, 298, 156, 134];
      const automatedData = [148, 187, 162, 219, 244, 128, 110];
      
      for (let i = 0; i < 7; i++) {
        trends.push({
          day: days[i],
          totalInquiries: inquiryData[i],
          automatedResponses: automatedData[i],
        });
      }
      
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trend data" });
    }
  });

  app.get("/api/analytics/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      const categoryData = [
        { name: "Technical Support", value: 35, color: "#1976D2" },
        { name: "Academic", value: 25, color: "#388E3C" },
        { name: "Administrative", value: 20, color: "#9C27B0" },
        { name: "General", value: 15, color: "#FF9800" },
        { name: "Other", value: 5, color: "#F44336" },
      ];
      
      res.json(categoryData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to find best matching response template
function findBestMatchingTemplate(message: string, templates: any[]): any | null {
  const lowercaseMessage = message.toLowerCase();
  let bestMatch = null;
  let highestScore = 0;

  for (const template of templates.filter(t => t.isActive)) {
    let score = 0;
    
    // Check keywords
    for (const keyword of template.keywords) {
      if (lowercaseMessage.includes(keyword.toLowerCase())) {
        score += 2;
      }
    }
    
    // Check title words
    const titleWords = template.title.toLowerCase().split(' ');
    for (const word of titleWords) {
      if (lowercaseMessage.includes(word)) {
        score += 1;
      }
    }
    
    if (score > highestScore && score >= 2) {
      highestScore = score;
      bestMatch = template;
    }
  }
  
  return bestMatch;
}
