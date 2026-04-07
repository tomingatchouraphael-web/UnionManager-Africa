// lib/auth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = "7d";
const REFRESH_EXPIRES = "30d";

export interface JWTPayload {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  organisation_id: string;
}

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function signRefreshToken(payload: Pick<JWTPayload, "id" | "organisation_id">): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export async function verifyToken(req: NextRequest): Promise<JWTPayload | null> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return payload;
  } catch {
    return null;
  }
}

export function getOrgFromToken(req: NextRequest): string | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;
    const token = authHeader.slice(7);
    const payload = jwt.decode(token) as JWTPayload;
    return payload?.organisation_id || null;
  } catch {
    return null;
  }
}

export const PERMISSIONS: Record<string, string[]> = {
  super_admin: ["*"],
  president: [
    "membres:read", "membres:write", "membres:delete",
    "cotisations:read", "cotisations:write",
    "reunions:read", "reunions:write",
    "actions:read", "actions:write",
    "plaintes:read", "plaintes:write",
    "finances:read", "finances:write",
    "documents:read", "documents:write",
    "communication:read", "communication:write",
    "utilisateurs:read",
  ],
  secretaire_general: [
    "membres:read", "membres:write",
    "cotisations:read",
    "reunions:read", "reunions:write",
    "actions:read", "actions:write",
    "plaintes:read", "plaintes:write",
    "documents:read", "documents:write",
    "communication:read", "communication:write",
  ],
  tresorier: [
    "membres:read",
    "cotisations:read", "cotisations:write",
    "finances:read", "finances:write",
    "documents:read",
  ],
  responsable_section: [
    "membres:read",
    "cotisations:read",
    "reunions:read",
    "plaintes:read",
    "communication:read",
  ],
  lecteur: [
    "membres:read",
    "reunions:read",
    "documents:read",
    "communication:read",
  ],
};

export function hasPermission(role: string, permission: string): boolean {
  const perms = PERMISSIONS[role] || [];
  return perms.includes("*") || perms.includes(permission);
}
