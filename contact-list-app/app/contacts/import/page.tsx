"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { parseCSV, validateCSVRow, type CSVRow } from "@/lib/utils/csv";

interface ImportResult {
  row: number;
  status: "success" | "error" | "skipped";
  message: string;
  data?: CSVRow;
}

export default function ImportContactsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const supabase = createClient();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select a CSV file",
        });
        return;
      }
      setFile(selectedFile);
      setShowResults(false);
    }
  }

  async function handleImport() {
    if (!file) return;

    setIsUploading(true);
    setResults([]);
    setShowResults(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Read file content
      const fileContent = await file.text();
      const rows = parseCSV(fileContent);

      if (rows.length === 0) {
        throw new Error("CSV file is empty or invalid");
      }

      toast({
        title: "Processing...",
        description: `Importing ${rows.length} contacts...`,
      });

      // Process each row
      const importResults: ImportResult[] = [];
      let successCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const validation = validateCSVRow(row);

        if (!validation.isValid) {
          importResults.push({
            row: i + 2, // +2 because of 0-index and header row
            status: "error",
            message: validation.errors.join(", "),
            data: row,
          });
          continue;
        }

        try {
          const { error } = await supabase.from("contacts").insert([
            {
              user_id: user.id,
              first_name: row["First Name"].trim(),
              last_name: row["Last Name"].trim(),
              email: row.Email?.trim() || null,
              phone: row.Phone?.trim() || null,
              company: row.Company?.trim() || null,
              job_title: row["Job Title"]?.trim() || null,
              notes: row.Notes?.trim() || null,
            },
          ]);

          if (error) throw error;

          importResults.push({
            row: i + 2,
            status: "success",
            message: `Imported ${row["First Name"]} ${row["Last Name"]}`,
            data: row,
          });
          successCount++;
        } catch (error: any) {
          importResults.push({
            row: i + 2,
            status: "error",
            message: error.message || "Failed to import",
            data: row,
          });
        }
      }

      setResults(importResults);
      setShowResults(true);

      toast({
        title: "Import complete!",
        description: `Successfully imported ${successCount} of ${rows.length} contacts.`,
      });

      if (successCount > 0) {
        // Delay redirect to show results
        setTimeout(() => {
          router.push("/contacts");
          router.refresh();
        }, 3000);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to import contacts",
      });
    } finally {
      setIsUploading(false);
    }
  }

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/contacts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contacts
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Import Contacts from CSV</CardTitle>
            <CardDescription>
              Upload a CSV file to bulk import contacts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Instructions */}
            <div className="bg-muted p-4 rounded-md space-y-2">
              <p className="text-sm font-medium">CSV Format Requirements:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Required columns: First Name, Last Name</li>
                <li>Optional columns: Email, Phone, Company, Job Title, Notes, Tags</li>
                <li>First row should contain column headers</li>
                <li>Tags should be separated by semicolons (e.g., &quot;Client; Friend&quot;)</li>
              </ul>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                  disabled={isUploading}
                />
              </div>

              {file && !showResults && (
                <div className="flex items-center justify-between p-4 bg-accent rounded-md">
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button onClick={handleImport} disabled={isUploading}>
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Importing..." : "Import"}
                  </Button>
                </div>
              )}
            </div>

            {/* Import Results */}
            {showResults && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {successCount} Successful
                      </span>
                    </div>
                  </div>
                  {errorCount > 0 && (
                    <div className="flex-1 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {errorCount} Failed
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Detailed Results */}
                <div className="border rounded-md max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border-b last:border-b-0"
                    >
                      {result.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">Row {result.row}:</span>{" "}
                          {result.message}
                        </p>
                        {result.status === "error" && result.data && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.data["First Name"]} {result.data["Last Name"]}
                            {result.data.Email && ` (${result.data.Email})`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Link href="/contacts" className="flex-1">
                    <Button className="w-full">View Imported Contacts</Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setShowResults(false);
                      setResults([]);
                    }}
                  >
                    Import Another File
                  </Button>
                </div>
              </div>
            )}

            {/* Download Sample CSV */}
            {!showResults && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Need a template? Download a sample CSV file to see the format.
                </p>
                <Button
                  variant="link"
                  className="h-auto p-0"
                  onClick={() => {
                    const sample = `First Name,Last Name,Email,Phone,Company,Job Title,Notes,Tags
John,Doe,john.doe@example.com,+1 555-123-4567,Acme Corp,Software Engineer,Great colleague,Client; Friend
Jane,Smith,jane.smith@example.com,+1 555-987-6543,Tech Inc,Product Manager,Met at conference,Client`;
                    const blob = new Blob([sample], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "contacts-template.csv";
                    link.click();
                  }}
                >
                  Download Sample CSV
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
