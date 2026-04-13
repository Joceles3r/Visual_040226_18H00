/**
 * VIXUAL Ranking Module - Email Templates
 * 
 * Templates pour les notifications liees au classement:
 * - Selection dans les 100 projets
 * - Fenetre de reintegration ouverte
 * - Confirmation de reintegration payee
 */

import { REINTEGRATION_CONFIG } from "./reintegration";

export interface EmailTemplate {
  subject: string;
  body: string;
  html?: string;
}

/**
 * Email envoye quand un projet entre dans les 100 selectionnes
 */
export function getProjectSelectedEmail(projectTitle: string): EmailTemplate {
  const subject = "Votre projet a integre les 100 selectionnes sur VIXUAL";
  
  const body = `Bonjour,

Bonne nouvelle : votre projet "${projectTitle}" fait desormais partie des 100 projets selectionnes dans sa categorie sur VIXUAL.

Votre projet est maintenant officiellement en competition dans la session active.

Connectez-vous a votre espace pour suivre son evolution, sa visibilite et ses resultats.

Merci de votre confiance,
L'equipe VIXUAL`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
    
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">Bonne nouvelle !</h1>
    </div>
    
    <div style="padding: 32px;">
      <p style="color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        Votre projet <strong style="color: #10b981;">"${projectTitle}"</strong> fait desormais partie des 100 projets selectionnes dans sa categorie sur VIXUAL.
      </p>
      
      <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <p style="color: #10b981; font-size: 18px; font-weight: 600; margin: 0;">
          Votre projet est officiellement en competition
        </p>
      </div>
      
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        Connectez-vous a votre espace pour suivre son evolution, sa visibilite et ses resultats.
      </p>
      
      <a href="https://vixual.app/dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        Acceder a mon espace
      </a>
    </div>
    
    <div style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
      <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
        L'equipe VIXUAL
      </p>
    </div>
  </div>
</body>
</html>`;

  return { subject, body, html };
}

/**
 * Email envoye quand la fenetre de reintegration s'ouvre (projet non TOP 10)
 */
export function getReentryWindowOpenEmail(projectTitle: string): EmailTemplate {
  const subject = "Votre projet peut etre relance pendant 1 heure";
  
  const body = `Bonjour,

Votre projet "${projectTitle}" ne fait pas partie des 10 premiers de la session.

Vous disposez d'une heure pour le relancer en priorite sur VIXUAL.

Montant : ${REINTEGRATION_CONFIG.priceDisplay}

Passe ce delai, cette option ne sera plus disponible.

L'equipe VIXUAL`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
    
    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); padding: 32px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">Reintegration disponible</h1>
      <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.8);">Temps limite : 1 heure</p>
    </div>
    
    <div style="padding: 32px;">
      <p style="color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        Votre projet <strong style="color: #8b5cf6;">"${projectTitle}"</strong> ne figure pas parmi les 10 premiers gagnants de la session cloturee.
      </p>
      
      <div style="background-color: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="color: rgba(255,255,255,0.6); font-size: 14px;">Acces prioritaire</span>
          <span style="color: #10b981; font-weight: 600;">Prochaine selection</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="color: rgba(255,255,255,0.6); font-size: 14px;">Activation</span>
          <span style="color: #f59e0b; font-weight: 600;">${REINTEGRATION_CONFIG.priceDisplay}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: rgba(255,255,255,0.6); font-size: 14px;">Delai</span>
          <span style="color: #ef4444; font-weight: 600;">1 heure</span>
        </div>
      </div>
      
      <a href="https://vixual.app/dashboard" style="display: block; text-align: center; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-bottom: 16px;">
        Relancer mon projet (${REINTEGRATION_CONFIG.priceDisplay})
      </a>
      
      <p style="color: rgba(255,255,255,0.4); font-size: 12px; line-height: 1.6; margin: 0; text-align: center;">
        Passe ce delai, cette option ne sera plus disponible.
      </p>
    </div>
    
    <div style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
      <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
        L'equipe VIXUAL
      </p>
    </div>
  </div>
</body>
</html>`;

  return { subject, body, html };
}

/**
 * Email de confirmation apres paiement de la reintegration
 */
export function getReentryConfirmedEmail(projectTitle: string): EmailTemplate {
  const subject = "Reintegration confirmee - Votre projet est prioritaire";
  
  const body = `Bonjour,

Votre paiement de ${REINTEGRATION_CONFIG.priceDisplay} a bien ete recu.

Votre projet "${projectTitle}" est maintenant prioritaire pour la prochaine session de selection.

Vous serez informe par email des que votre projet integrera les 100 projets selectionnes.

Merci de votre confiance,
L'equipe VIXUAL`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
    
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; text-align: center;">
      <div style="width: 64px; height: 64px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 32px;">&#10003;</span>
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">Reintegration confirmee</h1>
    </div>
    
    <div style="padding: 32px;">
      <p style="color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        Votre paiement de <strong style="color: #10b981;">${REINTEGRATION_CONFIG.priceDisplay}</strong> a bien ete recu.
      </p>
      
      <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <p style="color: #10b981; font-size: 18px; font-weight: 600; margin: 0 0 8px;">
          "${projectTitle}"
        </p>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">
          est maintenant prioritaire pour la prochaine selection
        </p>
      </div>
      
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        Vous serez informe par email des que votre projet integrera les 100 projets selectionnes.
      </p>
      
      <a href="https://vixual.app/dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        Suivre mon projet
      </a>
    </div>
    
    <div style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
      <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
        Merci de votre confiance,<br>L'equipe VIXUAL
      </p>
    </div>
  </div>
</body>
</html>`;

  return { subject, body, html };
}

/**
 * Email envoye quand un projet est place en file d'attente
 */
export function getQueuePositionEmail(projectTitle: string, position: number): EmailTemplate {
  const subject = "Votre projet est en file d'attente sur VIXUAL";
  
  const body = `Bonjour,

Votre projet "${projectTitle}" a bien ete enregistre.

La categorie est actuellement complete. Votre projet a ete place dans la file d'attente officielle en position ${position}.

Vous serez averti par email des qu'il entrera dans les 100 projets selectionnes.

L'equipe VIXUAL`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
    
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 32px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">Projet enregistre</h1>
    </div>
    
    <div style="padding: 32px;">
      <p style="color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        Votre projet <strong style="color: #f59e0b;">"${projectTitle}"</strong> a bien ete enregistre.
      </p>
      
      <div style="background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0 0 8px;">
          Position dans la file d'attente
        </p>
        <p style="color: #f59e0b; font-size: 36px; font-weight: bold; margin: 0;">
          #${position}
        </p>
      </div>
      
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        La categorie est actuellement complete. Vous serez averti par email des que votre projet entrera dans les 100 projets selectionnes.
      </p>
      
      <a href="https://vixual.app/dashboard" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        Voir mon projet
      </a>
    </div>
    
    <div style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
      <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
        L'equipe VIXUAL
      </p>
    </div>
  </div>
</body>
</html>`;

  return { subject, body, html };
}
