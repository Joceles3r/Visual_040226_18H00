/**
 * VIXUAL Ranking Queue System
 * 
 * File d'attente equitable et automatique pour les projets.
 * Premier arrive = premier servi, sans favoritisme.
 */

import { sql, isDatabaseConfigured } from "@/lib/db";

export const QUEUE_CONFIG = {
  maxActiveProjects: 100,
  categories: ["video", "text", "podcast"] as const,
} as const;

export type CategoryKey = typeof QUEUE_CONFIG.categories[number];

export interface QueueEntry {
  id: string;
  projectId: string;
  categoryKey: CategoryKey;
  queuePosition: number;
  insertedAt: Date;
  status: "waiting" | "selected" | "expired" | "withdrawn";
  selectedAt?: Date;
}

export interface QueueStatus {
  position: number;
  totalInQueue: number;
  estimatedWait?: string;
  isSelected: boolean;
}

/**
 * Ajoute un projet a la file d'attente
 */
export async function addToQueue(
  projectId: string,
  categoryKey: CategoryKey
): Promise<QueueEntry | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    // Obtenir la prochaine position
    const positionResult = await sql`
      SELECT COALESCE(MAX(queue_position), 0) + 1 as next_position
      FROM project_queue
      WHERE category_key = ${categoryKey} AND status = 'waiting'
    `;
    
    const nextPosition = positionResult[0]?.next_position || 1;

    const result = await sql`
      INSERT INTO project_queue (project_id, category_key, queue_position, status)
      VALUES (${projectId}, ${categoryKey}, ${nextPosition}, 'waiting')
      ON CONFLICT (project_id, category_key) DO UPDATE SET
        queue_position = EXCLUDED.queue_position,
        status = 'waiting',
        inserted_at = NOW()
      RETURNING *
    `;

    if (result.length > 0) {
      return {
        id: result[0].id,
        projectId: result[0].project_id,
        categoryKey: result[0].category_key,
        queuePosition: result[0].queue_position,
        insertedAt: new Date(result[0].inserted_at),
        status: result[0].status,
      };
    }
    return null;
  } catch (error) {
    console.error("[v0] Error adding to queue:", error);
    return null;
  }
}

/**
 * Obtient le statut d'un projet dans la file d'attente
 */
export async function getQueueStatus(
  projectId: string,
  categoryKey: CategoryKey
): Promise<QueueStatus | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    const result = await sql`
      SELECT 
        q.queue_position,
        q.status,
        q.selected_at,
        (SELECT COUNT(*) FROM project_queue WHERE category_key = ${categoryKey} AND status = 'waiting') as total_waiting
      FROM project_queue q
      WHERE q.project_id = ${projectId} AND q.category_key = ${categoryKey}
    `;

    if (result.length === 0) return null;

    const entry = result[0];
    return {
      position: entry.queue_position,
      totalInQueue: entry.total_waiting,
      isSelected: entry.status === "selected",
    };
  } catch (error) {
    console.error("[v0] Error getting queue status:", error);
    return null;
  }
}

/**
 * Compte les projets actifs dans une categorie
 */
export async function countActiveProjects(
  categoryKey: CategoryKey,
  sessionId: string
): Promise<number> {
  if (!isDatabaseConfigured()) return 0;

  try {
    const result = await sql`
      SELECT COUNT(*) as count
      FROM contents
      WHERE session_id = ${sessionId}::uuid
        AND type = ${categoryKey}
        AND status IN ('selected', 'active')
    `;
    return parseInt(result[0]?.count || "0", 10);
  } catch {
    return 0;
  }
}

/**
 * Selectionne les prochains projets de la file pour remplir les places
 */
export async function fillCategorySlots(
  categoryKey: CategoryKey,
  sessionId: string
): Promise<string[]> {
  if (!isDatabaseConfigured()) return [];

  try {
    const activeCount = await countActiveProjects(categoryKey, sessionId);
    const remainingSlots = QUEUE_CONFIG.maxActiveProjects - activeCount;

    if (remainingSlots <= 0) return [];

    // 1. D'abord les projets reintegres prioritairement
    const reentries = await sql`
      SELECT project_id FROM contents
      WHERE type = ${categoryKey}
        AND reentry_paid = true
        AND reentry_window_expires_at > NOW()
        AND session_id IS NULL
      ORDER BY reentry_paid_at ASC
      LIMIT ${remainingSlots}
    `;

    const selectedIds: string[] = reentries.map((r: { project_id: string }) => r.project_id);

    // 2. Ensuite les projets en file d'attente
    const stillRemaining = remainingSlots - selectedIds.length;
    if (stillRemaining > 0) {
      const queued = await sql`
        SELECT project_id FROM project_queue
        WHERE category_key = ${categoryKey}
          AND status = 'waiting'
        ORDER BY queue_position ASC
        LIMIT ${stillRemaining}
      `;
      selectedIds.push(...queued.map((q: { project_id: string }) => q.project_id));
    }

    // 3. Mettre a jour les statuts
    for (const projectId of selectedIds) {
      await sql`
        UPDATE contents SET
          session_id = ${sessionId}::uuid,
          selected_at = NOW(),
          status = 'selected'
        WHERE id = ${projectId}::uuid
      `;
      await sql`
        UPDATE project_queue SET
          status = 'selected',
          selected_at = NOW()
        WHERE project_id = ${projectId}::uuid
      `;
    }

    return selectedIds;
  } catch (error) {
    console.error("[v0] Error filling category slots:", error);
    return [];
  }
}

/**
 * Message UX pour projet en file d'attente
 */
export const QUEUE_UX_MESSAGES = {
  inQueue: {
    title: "Votre projet est en file d'attente",
    body: "Votre projet a bien ete enregistre. La categorie est actuellement complete. Votre projet a ete place dans la file d'attente officielle. Vous serez averti par email des qu'il entrera dans les 100 projets selectionnes.",
  },
  selected: {
    title: "Votre projet est selectionne",
    body: "Bonne nouvelle : votre projet fait desormais partie des 100 projets selectionnes dans sa categorie sur VIXUAL. Il est maintenant officiellement en competition.",
  },
} as const;
