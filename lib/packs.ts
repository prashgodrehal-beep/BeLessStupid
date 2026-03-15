// lib/packs.ts
export interface CreditPack {
  id:          string;
  label:       string;
  credits:     number;
  price:       number;
  paise:       number;
  perAudit:    number;
  popular:     boolean;
  description: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id:"single", label:"1 Audit",   credits:1,  price:299,  paise:29900, perAudit:299, popular:false, description:"One full decision audit with Decision Memo" },
  { id:"five",   label:"5 Audits",  credits:5,  price:699,  paise:69900, perAudit:140, popular:true,  description:"Best value — save 53% per audit" },
  { id:"ten",    label:"10 Audits", credits:10, price:999,  paise:99900, perAudit:100, popular:false, description:"Team or power user — ₹100 per audit" },
];

export const FREE_CREDITS = 3;
export const getPack = (id: string) => CREDIT_PACKS.find(p => p.id === id);
