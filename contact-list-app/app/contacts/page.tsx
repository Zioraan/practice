"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, LogOut, Mail, Phone, Building, Download, Upload } from "lucide-react";
import { TagManager } from "@/components/tags/tag-manager";
import { Badge } from "@/components/ui/badge";
import type { Contact, Tag } from "@/lib/types/contact";
import { exportContactsToCSV, downloadCSV } from "@/lib/utils/csv";
import { ContactAvatar } from "@/components/contacts/contact-avatar";
import { ContactSkeleton } from "@/components/contacts/contact-skeleton";
import { useDebounce } from "@/hooks/use-debounce";

interface ContactWithTags extends Contact {
  tags?: Tag[];
}

export default function ContactsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [contacts, setContacts] = useState<ContactWithTags[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactWithTags[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const CONTACTS_PER_PAGE = 12;
  
  // Debounced search for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchUser();
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, contacts]);

  async function fetchUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }

  async function fetchContacts() {
    setIsLoading(true);
    try {
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("*")
        .order("first_name", { ascending: true });

      if (contactsError) throw contactsError;

      // Fetch tags for each contact
      const contactsWithTags = await Promise.all(
        (contactsData || []).map(async (contact) => {
          const { data: tagData } = await supabase
            .from("contact_tags")
            .select("tag_id, tags(*)")
            .eq("contact_id", contact.id);

          const tags = tagData?.map((ct: any) => ct.tags).filter(Boolean) || [];
          return { ...contact, tags };
        })
      );

      setContacts(contactsWithTags);
      setFilteredContacts(contactsWithTags);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch contacts",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function filterContacts() {
    setCurrentPage(1); // Reset to first page when filtering

    if (!debouncedSearchQuery.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const query = debouncedSearchQuery.toLowerCase();
    const filtered = contacts.filter((contact) => {
      return (
        contact.first_name.toLowerCase().includes(query) ||
        contact.last_name.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.phone?.toLowerCase().includes(query) ||
        contact.company?.toLowerCase().includes(query) ||
        contact.job_title?.toLowerCase().includes(query)
      );
    });

    setFilteredContacts(filtered);
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredContacts.length / CONTACTS_PER_PAGE);
  const startIndex = (currentPage - 1) * CONTACTS_PER_PAGE;
  const endIndex = startIndex + CONTACTS_PER_PAGE;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out",
      });
      return;
    }
    router.push("/auth/login");
    router.refresh();
  }

  function handleExportCSV() {
    if (contacts.length === 0) {
      toast({
        title: "No contacts to export",
        description: "Add some contacts first before exporting.",
      });
      return;
    }

    const csvContent = exportContactsToCSV(contacts);
    const timestamp = new Date().toISOString().split("T")[0];
    downloadCSV(csvContent, `contacts-${timestamp}.csv`);

    toast({
      title: "Export successful!",
      description: `Exported ${contacts.length} contacts to CSV.`,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Contact Manager</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <TagManager />
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Link href="/contacts/import">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </Link>
            <Link href="/contacts/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </Link>
          </div>
        </div>

        {/* Contacts Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ContactSkeleton key={i} />
            ))}
          </div>
        ) : filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "No contacts found matching your search"
                  : "No contacts yet"}
              </p>
              {!searchQuery && (
                <Link href="/contacts/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Contact
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedContacts.map((contact) => (
              <Link key={contact.id} href={`/contacts/${contact.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <ContactAvatar
                        firstName={contact.first_name}
                        lastName={contact.last_name}
                        email={contact.email}
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {contact.first_name} {contact.last_name}
                        </CardTitle>
                        {contact.job_title && (
                          <CardDescription>{contact.job_title}</CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    {contact.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{contact.company}</span>
                      </div>
                    )}
                    {contact.tags && contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {contact.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            className="text-xs text-white border-none"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredContacts.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredContacts.length)} of{" "}
              {filteredContacts.length} contact
              {filteredContacts.length !== 1 ? "s" : ""}
              {filteredContacts.length !== contacts.length &&
                ` (filtered from ${contacts.length} total)`}
            </p>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
