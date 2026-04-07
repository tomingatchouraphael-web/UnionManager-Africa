// app/api/membres/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, getOrgFromToken } from "@/lib/auth";
import { z } from "zod";

const MembreSchema = z.object({
  nom: z.string().min(2).max(100),
  prenom: z.string().min(2).max(100),
  sexe: z.enum(["M", "F"]).optional(),
  date_naissance: z.string().optional(),
  nationalite: z.string().optional(),
  numero_cni: z.string().optional(),
  telephone: z.string().min(8),
  telephone_2: z.string().optional(),
  email: z.string().email().optional(),
  adresse: z.string().optional(),
  profession: z.string().optional(),
  entreprise: z.string().optional(),
  poste: z.string().optional(),
  section_id: z.string().uuid().optional(),
  region_id: z.string().uuid().optional(),
  date_adhesion: z.string().optional(),
  statut: z.enum(["actif", "inactif", "suspendu", "retraite"]).default("actif"),
  montant_cotisation_mensuel: z.number().positive().default(2500),
});

export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;
    const search = searchParams.get("search") || "";
    const region_id = searchParams.get("region_id");
    const section_id = searchParams.get("section_id");
    const statut = searchParams.get("statut");

    let query = `
      SELECT 
        m.*,
        s.nom AS section_nom,
        r.nom AS region_nom
      FROM membres m
      LEFT JOIN sections s ON s.id = m.section_id
      LEFT JOIN regions r ON r.id = m.region_id
      WHERE m.organisation_id = $1
    `;
    const params: unknown[] = [user.organisation_id];
    let paramIdx = 2;

    if (search) {
      query += ` AND (m.nom ILIKE $${paramIdx} OR m.prenom ILIKE $${paramIdx} OR m.email ILIKE $${paramIdx} OR m.numero_adherent ILIKE $${paramIdx})`;
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (region_id) {
      query += ` AND m.region_id = $${paramIdx}`;
      params.push(region_id);
      paramIdx++;
    }
    if (section_id) {
      query += ` AND m.section_id = $${paramIdx}`;
      params.push(section_id);
      paramIdx++;
    }
    if (statut) {
      query += ` AND m.statut = $${paramIdx}`;
      params.push(statut);
      paramIdx++;
    }

    const countQuery = query.replace("SELECT \n        m.*,\n        s.nom AS section_nom,\n        r.nom AS region_nom", "SELECT COUNT(*)");
    const [countResult, membres] = await Promise.all([
      db.query(countQuery, params),
      db.query(query + ` ORDER BY m.created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`, [...params, limit, offset]),
    ]);

    return NextResponse.json({
      data: membres.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    if (!["super_admin", "secretaire_general", "president"].includes(user.role)) {
      return NextResponse.json({ error: "Permission insuffisante" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = MembreSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.errors }, { status: 400 });
    }

    const d = parsed.data;
    const result = await db.query(
      `INSERT INTO membres (
        organisation_id, nom, prenom, sexe, date_naissance, nationalite,
        numero_cni, telephone, telephone_2, email, adresse, profession,
        entreprise, poste, section_id, region_id, date_adhesion, statut,
        montant_cotisation_mensuel, cree_par
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      RETURNING *`,
      [
        user.organisation_id, d.nom, d.prenom, d.sexe || null, d.date_naissance || null,
        d.nationalite || "Sénégalaise", d.numero_cni || null, d.telephone, d.telephone_2 || null,
        d.email || null, d.adresse || null, d.profession || null, d.entreprise || null,
        d.poste || null, d.section_id || null, d.region_id || null,
        d.date_adhesion || new Date().toISOString().split("T")[0],
        d.statut, d.montant_cotisation_mensuel, user.id,
      ]
    );

    return NextResponse.json({ data: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ============================================================
// app/api/membres/[id]/route.ts
// ============================================================

export async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const result = await db.query(
      `SELECT m.*, s.nom AS section_nom, r.nom AS region_nom,
        (SELECT json_agg(c ORDER BY c.created_at DESC) FROM cotisations c WHERE c.membre_id = m.id) AS cotisations
       FROM membres m
       LEFT JOIN sections s ON s.id = m.section_id
       LEFT JOIN regions r ON r.id = m.region_id
       WHERE m.id = $1 AND m.organisation_id = $2`,
      [params.id, user.organisation_id]
    );

    if (!result.rows[0]) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await req.json();
    const parsed = MembreSchema.partial().safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

    const fields = Object.entries(parsed.data)
      .filter(([, v]) => v !== undefined)
      .map(([k], i) => `${k} = $${i + 3}`)
      .join(", ");

    const values = Object.values(parsed.data).filter(v => v !== undefined);

    if (!fields) return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 });

    const result = await db.query(
      `UPDATE membres SET ${fields} WHERE id = $1 AND organisation_id = $2 RETURNING *`,
      [params.id, user.organisation_id, ...values]
    );

    if (!result.rows[0]) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    if (!["super_admin", "president"].includes(user.role)) {
      return NextResponse.json({ error: "Permission insuffisante" }, { status: 403 });
    }

    // Soft delete - marquer comme inactif
    await db.query(
      "UPDATE membres SET statut = 'inactif' WHERE id = $1 AND organisation_id = $2",
      [params.id, user.organisation_id]
    );

    return NextResponse.json({ message: "Membre désactivé avec succès" });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
