"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  Briefcase,
  FileText,
  Calendar,
  Tag as TagIcon,
} from "lucide-react";
import { TagSelector } from "@/components/tags/tag-selector";
import { ContactAvatar } from "@/components/contacts/contact-avatar";
import type { Contact, Tag } from "@/lib/types/contact";

interface ContactWithTags extends Contact {
  tags?: Tag[];
}

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const supabase = createClient();
  const [contact, setContact] = useState<ContactWithTags | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchContact();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function fetchContact() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;

      // Fetch tags for this contact
      const { data: tagData } = await supabase
        .from("contact_tags")
        .select("tag_id, tags(*)")
        .eq("contact_id", params.id);

      const tags = tagData?.map((ct: any) => ct.tags).filter(Boolean) || [];

      setContact({ ...data, tags });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch contact",
      });
      router.push("/contacts");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", params.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Contact has been deleted successfully.",
      });

      router.push("/contacts");
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete contact",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading contact...</p>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Contact not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/contacts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contacts
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/contacts/${contact.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the contact for {contact.first_name} {contact.last_name}.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Contact"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <ContactAvatar
                firstName={contact.first_name}
                lastName={contact.last_name}
                email={contact.email}
                size="lg"
              />
              <div className="flex-1">
                <CardTitle className="text-3xl">
                  {contact.first_name} {contact.last_name}
                </CardTitle>
                {contact.job_title && (
                  <CardDescription className="text-lg">
                    {contact.job_title}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tags Section */}
            <div className="flex items-start gap-3">
              <TagIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Tags
                </p>
                <TagSelector
                  contactId={contact.id}
                  selectedTags={contact.tags || []}
                  onTagsChange={fetchContact}
                />
              </div>
            </div>

            <div className="border-t pt-4" />

            <div className="grid gap-4">
              {contact.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-primary hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Phone
                    </p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-primary hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {contact.company && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Company
                    </p>
                    <p>{contact.company}</p>
                  </div>
                </div>
              )}

              {contact.job_title && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Job Title
                    </p>
                    <p>{contact.job_title}</p>
                  </div>
                </div>
              )}

              {contact.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Notes
                    </p>
                    <p className="text-sm whitespace-pre-wrap">
                      {contact.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(contact.created_at)}
                  {contact.updated_at !== contact.created_at && (
                    <span className="ml-4">
                      <span className="font-medium">Updated:</span>{" "}
                      {formatDate(contact.updated_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
