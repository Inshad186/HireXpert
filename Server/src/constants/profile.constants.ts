export const CLIENT_FIELDS = [
  "name", "accountType", "companyName", "companySize", "contactTitle", "about", "website",
  "linkedinUrl", "industry", "address", "country", "workType", "budgetRange",
] as const;

export const MAX_LENGTH: Record<string, number> = {
  about: 500, website: 200, linkedinUrl: 200, address: 200,
  preferredTechStack: 200, budgetRange: 50,
};


export const TEXT_LIMITS: Record<string, number> = {
  name: 100, profession: 100, company: 100, qualification: 150, bio: 1000,
  work_experience: 100, working_days: 100, active_hours: 100, portfolio: 200,
};

export const ACCOUNT_TYPES = ["individual", "company"];
export const COMPANY_SIZES = ["1", "2-10", "11-50", "51-200", "200+"];
export const WORK_TYPES = ["Short-term", "Long-term", "Both"];

export const BUDGET_RANGES = ["Under $100", "$100 - $500", "$500 - $2,000", "$2,000+"];

export const spentRange = (n: number) =>
  n <= 0 ? "No spending yet" : n >= 10000 ? "$10K+" : n >= 5000 ? "$5K+" : n >= 1000 ? "$1K+" : n >= 100 ? "$100+" : "Under $100";