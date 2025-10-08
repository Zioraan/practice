import type { Contact } from "@/lib/types/contact";

export function exportContactsToCSV(contacts: Contact[]): string {
  // Define CSV headers
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Company",
    "Job Title",
    "Notes",
    "Tags",
  ];

  // Convert contacts to CSV rows
  const rows = contacts.map((contact) => {
    const tags = contact.tags?.map((t) => t.name).join("; ") || "";
    return [
      contact.first_name,
      contact.last_name,
      contact.email || "",
      contact.phone || "",
      contact.company || "",
      contact.job_title || "",
      contact.notes?.replace(/\n/g, " ") || "",
      tags,
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return csvContent;
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface CSVRow {
  "First Name": string;
  "Last Name": string;
  Email?: string;
  Phone?: string;
  Company?: string;
  "Job Title"?: string;
  Notes?: string;
  Tags?: string;
}

export function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return [];

  // Parse headers
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));

  // Parse rows
  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export function validateCSVRow(row: CSVRow): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!row["First Name"] || !row["First Name"].trim()) {
    errors.push("First Name is required");
  }

  if (!row["Last Name"] || !row["Last Name"].trim()) {
    errors.push("Last Name is required");
  }

  if (row.Email && !isValidEmail(row.Email)) {
    errors.push("Invalid email format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
