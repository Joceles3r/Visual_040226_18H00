/**
 * VIXUAL Ranking Reintegration System
 * 
 * Permet aux projets elimines du TOP 100 de revenir dans la competition.
 * 
 * Regles:
 * - Fenetre de reintegration: 1 heure apres cloture du cycle
 * - Cout: 25 EUR via Stripe
 * - Priorite sur la file d'attente standard
 * - Maximum 1 reintegration par projet par cycle
 */

export const REINTEGRATION_CONFIG = {
  /** Prix en centimes EUR */
  priceEurCents: 2500,
  /** Prix affiche */
  priceDisplay: "25,00 EUR",
  /** Fenetre de reintegration en heures apres cloture */
  windowHours: 1,
  /** Nom affiche */
  displayName: "Reintegration TOP 100",
  /** Description courte */
  shortDescription: "Reintegrez votre projet dans le TOP 100 apres elimination",
} as const;

export interface ReintegrationRequest {
  id: string;
  projectId: string;
  userId: string;
  cycleId: string;
  requestedAt: Date;
  windowOpensAt: Date;
  windowClosesAt: Date;
  status: "pending" | "approved" | "expired" | "paid";
  stripePaymentId?: string;
  position?: number; // Position de reintegration dans le TOP 100
}

export interface ReintegrationStatus {
  canRequest: boolean;
  reason?: string;
  windowOpen: boolean;
  windowOpensAt?: Date;
  windowClosesAt?: Date;
  existingRequest?: ReintegrationRequest;
}

/**
 * Verifie si un projet peut demander une reintegration
 */
export function canRequestReintegration(
  projectId: string,
  cycleId: string,
  cycleClosedAt: Date,
  existingRequests: ReintegrationRequest[]
): ReintegrationStatus {
  const now = new Date();
  
  // Calculer la fenetre de reintegration
  const windowOpensAt = new Date(cycleClosedAt);
  const windowClosesAt = new Date(cycleClosedAt);
  windowClosesAt.setHours(windowClosesAt.getHours() + REINTEGRATION_CONFIG.windowHours);
  
  const windowOpen = now >= windowOpensAt && now <= windowClosesAt;
  
  // Verifier si une demande existe deja pour ce projet dans ce cycle
  const existingRequest = existingRequests.find(
    r => r.projectId === projectId && r.cycleId === cycleId
  );
  
  if (existingRequest) {
    if (existingRequest.status === "paid") {
      return {
        canRequest: false,
        reason: "Vous avez deja utilise la reintegration pour ce cycle",
        windowOpen,
        windowOpensAt,
        windowClosesAt,
        existingRequest,
      };
    }
    if (existingRequest.status === "pending") {
      return {
        canRequest: false,
        reason: "Une demande de reintegration est deja en cours",
        windowOpen,
        windowOpensAt,
        windowClosesAt,
        existingRequest,
      };
    }
  }
  
  if (!windowOpen) {
    if (now < windowOpensAt) {
      return {
        canRequest: false,
        reason: "La fenetre de reintegration n'est pas encore ouverte",
        windowOpen: false,
        windowOpensAt,
        windowClosesAt,
      };
    }
    return {
      canRequest: false,
      reason: "La fenetre de reintegration est fermee",
      windowOpen: false,
      windowOpensAt,
      windowClosesAt,
    };
  }
  
  return {
    canRequest: true,
    windowOpen: true,
    windowOpensAt,
    windowClosesAt,
  };
}

/**
 * Cree une demande de reintegration
 */
export function createReintegrationRequest(
  projectId: string,
  userId: string,
  cycleId: string,
  cycleClosedAt: Date
): ReintegrationRequest {
  const windowOpensAt = new Date(cycleClosedAt);
  const windowClosesAt = new Date(cycleClosedAt);
  windowClosesAt.setHours(windowClosesAt.getHours() + REINTEGRATION_CONFIG.windowHours);
  
  return {
    id: `reint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    projectId,
    userId,
    cycleId,
    requestedAt: new Date(),
    windowOpensAt,
    windowClosesAt,
    status: "pending",
  };
}

/**
 * Formate le temps restant de la fenetre
 */
export function formatWindowTimeRemaining(windowClosesAt: Date): string {
  const now = new Date();
  const diff = windowClosesAt.getTime() - now.getTime();
  
  if (diff <= 0) return "Fermee";
  
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes} minutes restantes`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours}h ${remainingMins}min restantes`;
}

/**
 * Genere les metadata Stripe pour le paiement
 */
export function getStripeMetadataReintegration(
  projectId: string,
  userId: string,
  cycleId: string
): Record<string, string> {
  return {
    product_type: "reintegration_top100",
    project_id: projectId,
    user_id: userId,
    cycle_id: cycleId,
    price_eur_cents: String(REINTEGRATION_CONFIG.priceEurCents),
  };
}

// UI Helpers
export const REINTEGRATION_UI = {
  badge: {
    text: "Reintegration disponible",
    icon: "RefreshCw",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
  },
  card: {
    gradient: "from-purple-500/20 to-indigo-600/20",
    borderColor: "border-purple-500/30",
  },
  button: {
    text: `Reintegrer - ${REINTEGRATION_CONFIG.priceDisplay}`,
    gradient: "from-purple-500 to-indigo-600",
    hoverGradient: "hover:from-purple-400 hover:to-indigo-500",
  },
} as const;
