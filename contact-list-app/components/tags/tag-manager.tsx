"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Tags as TagsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tag } from "@/lib/types/contact";

const PRESET_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
];

export function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function fetchTags() {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch tags",
      });
    }
  }

  async function handleCreateTag() {
    if (!newTagName.trim()) return;

    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("tags")
        .insert([
          {
            user_id: user.id,
            name: newTagName.trim(),
            color: selectedColor,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Tag created successfully.",
      });

      setNewTagName("");
      setSelectedColor(PRESET_COLORS[0]);
      fetchTags();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create tag",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteTag(tagId: string) {
    try {
      const { error } = await supabase.from("tags").delete().eq("id", tagId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Tag deleted successfully.",
      });

      fetchTags();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete tag",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <TagsIcon className="mr-2 h-4 w-4" />
          Manage Tags
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Create and manage tags to organize your contacts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create New Tag */}
          <div className="space-y-3">
            <Input
              placeholder="Tag name (e.g., Client, Friend, Family)"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleCreateTag();
                }
              }}
            />

            {/* Color Picker */}
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Color:</span>
              <div className="flex gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all",
                      selectedColor === color
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || isLoading}
              size="sm"
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Tag
            </Button>
          </div>

          {/* Existing Tags List */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Your Tags ({tags.length})</p>
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tags yet. Create your first tag above.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    className="pl-3 pr-1 py-1 text-white border-none flex items-center gap-1"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
