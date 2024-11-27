import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function constructSearchQuery(
  jobTitles: string,
  locations: string,
  workLocations: string,
  platformDomains: string[]
): string[] {
  const jobQuery = jobTitles
    .split(",")
    .map((title) => title.trim())
    .filter(Boolean)
    .slice(0, 3) // Limit to 3 job titles
    .join(" OR ");

  const locationQuery = locations
    ? locations
        .split(",")
        .map((location) => location.trim())
        .filter(Boolean)
        .slice(0, 2) // Limit to 2 locations
        .join(" OR ")
    : "";

  // Split platforms into smaller groups to avoid query length limits
  const platformGroups = [];
  for (let i = 0; i < platformDomains.length; i += 4) {
    platformGroups.push(platformDomains.slice(i, i + 4));
  }

  return platformGroups.map(platforms => {
    const platformQuery = platforms
      .map(domain => `site:${domain}`)
      .join(" OR ");

    const parts = [];
    if (platformQuery) parts.push(`(${platformQuery})`);
    if (jobQuery) parts.push(`(${jobQuery})`);
    if (locationQuery) parts.push(`(${locationQuery})`);
    if (workLocations) parts.push(`(${workLocations})`);

    return parts.join(" ");
  });
}

export async function validateSearchResults(query: string): Promise<boolean> {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl);
    const html = await response.text();
    
    // Check if the response contains job listings
    return !html.includes("did not match any documents") && 
           (html.includes("jobs") || html.includes("careers") || html.includes("position"));
  } catch (error) {
    console.error('Error validating search results:', error);
    return false;
  }
}