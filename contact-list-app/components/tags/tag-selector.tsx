"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tag } from "@/lib/types/contact";

interface TagSelectorProps {
  contactId: string;
  selectedTags: Tag[];
  onTagsChange?: () => void;
}

export function TagSelector({
  contactId,
  selectedTags,
  onTagsChange,
}: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      fetchAvailableTags();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function fetchAvailableTags() {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setAvailableTags(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch tags",
      });
    }
  }

  async function handleToggleTag(tag: Tag) {
    const isSelected = selectedTags.some((t) => t.id === tag.id);

    try {
      if (isSelected) {
        // Remove tag
        const { error } = await supabase
          .from("contact_tags")
          .delete()
          .eq("contact_id", contactId)
          .eq("tag_id", tag.id);

        if (error) throw error;

        toast({
          title: "Tag removed",
          description: `Removed "${tag.name}" from contact`,
        });
      } else {
        // Add tag
        const { error } = await supabase
          .from("contact_tags")
          .insert([
            {
              contact_id: contactId,
              tag_id: tag.id,
            },
          ]);

        if (error) throw error;

        toast({
          title: "Tag added",
          description: `Added "${tag.name}" to contact`,
        });
      }

      if (onTagsChange) {
        onTagsChange();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update tag",
      });
    }
  }

  return (
    <div className="flex items-center gap-2">
      {selectedTags.map((tag) => (
        <Badge
          key={tag.id}
          className="text-white border-none"
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
        </Badge>
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-6 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-2">
            <p className="text-sm font-medium">Select tags for this contact</p>
            {availableTags.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No tags available. Create tags from the Manage Tags button.
              </p>
            ) : (
              <div className="space-y-1">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.some((t) => t.id === tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleToggleTag(tag)}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors",
                        isSelected && "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-sm">{tag.name}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
