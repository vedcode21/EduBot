import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Copy, Trash2, Search } from "lucide-react";
import type { ResponseTemplate, Category, InsertResponseTemplate } from "@shared/schema";

export default function ResponseTemplatesTable() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ResponseTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/response-templates", searchQuery],
    queryFn: async () => {
      const searchParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      const response = await fetch(`/api/response-templates${searchParam}`);
      return response.json();
    },
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertResponseTemplate) => {
      const response = await apiRequest("POST", "/api/response-templates", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/response-templates"] });
      setIsCreateDialogOpen(false);
      toast({ title: "Response template created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create response template", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertResponseTemplate> }) => {
      const response = await apiRequest("PUT", `/api/response-templates/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/response-templates"] });
      setEditingTemplate(null);
      toast({ title: "Response template updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update response template", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/response-templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/response-templates"] });
      toast({ title: "Response template deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete response template", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const keywords = (formData.get("keywords") as string)
      .split(",")
      .map(k => k.trim())
      .filter(k => k);
    
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      categoryId: formData.get("categoryId") as string,
      keywords,
    };

    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDuplicate = (template: ResponseTemplate) => {
    const duplicatedTemplate = {
      title: `${template.title} (Copy)`,
      content: template.content,
      categoryId: template.categoryId,
      keywords: template.keywords,
    };
    createMutation.mutate(duplicatedTemplate);
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((c: Category) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const getCategoryColor = (categoryId: string | null) => {
    if (!categoryId) return "#gray";
    const category = categories.find((c: Category) => c.id === categoryId);
    return category?.color || "#gray";
  };

  if (templatesLoading || categoriesLoading) {
    return <div>Loading response templates...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Response Templates Management</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Response Template</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" name="content" rows={6} required />
                  </div>
                  <div>
                    <Label htmlFor="categoryId">Category</Label>
                    <Select name="categoryId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: Category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input id="keywords" name="keywords" placeholder="keyword1, keyword2, keyword3" />
                  </div>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Template"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Template</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Usage Count</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template: ResponseTemplate) => (
              <TableRow key={template.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{template.title}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {template.content.length > 50 
                        ? `${template.content.substring(0, 50)}...` 
                        : template.content}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className="text-white"
                    style={{ backgroundColor: getCategoryColor(template.categoryId) }}
                  >
                    {getCategoryName(template.categoryId)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-900">{template.usageCount}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Progress 
                      value={(template.successRate || 0) * 100} 
                      className="w-16 mr-2"
                    />
                    <span className="text-sm text-gray-900">
                      {Math.round((template.successRate || 0) * 100)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(template.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                      className="text-primary hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(template)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(template.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">
              {Math.min(10, templates.length)}
            </span> of <span className="font-medium">{templates.length}</span> results
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="default" size="sm" className="bg-primary">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Response Template</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={editingTemplate?.title}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                name="content"
                rows={6}
                defaultValue={editingTemplate?.content}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-categoryId">Category</Label>
              <Select name="categoryId" defaultValue={editingTemplate?.categoryId || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-keywords">Keywords (comma-separated)</Label>
              <Input
                id="edit-keywords"
                name="keywords"
                defaultValue={editingTemplate?.keywords?.join(", ") || ""}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Template"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
