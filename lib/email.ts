import { Parcel, TrackingUpdate } from "./types";

const PRIMARY_COLOR = "#FF6B35";
const COMPANY_NAME = "ParcelFlow Logistics";
const WHATSAPP_NUMBER = "09130436032"; 
const WHATSAPP_LINK = `https://wa.me/2349130436032`;

const baseStyles = `
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; color: #1f2937; line-height: 1.6; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
  .wrapper { padding: 40px 20px; background-color: #f4f5f7; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; text-align: left; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
  .header { background-color: #ffffff; padding: 32px 40px; border-bottom: 3px solid ${PRIMARY_COLOR}; text-align: center; }
  .header-logo { font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.5px; margin: 0; text-align: center; }
  .header-logo span { color: ${PRIMARY_COLOR}; }
  .content { padding: 40px; }
  .greeting { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #111827; }
  .intro-text { color: #4b5563; font-size: 15px; margin-bottom: 32px; }
  .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; margin-bottom: 32px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
  .detail-row { margin-bottom: 20px; display: block; }
  .detail-row:last-child { margin-bottom: 0; }
  .detail-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 8px; font-weight: 700; display: block; }
  .detail-value { font-size: 16px; color: #0f172a; font-weight: 600; display: block; word-break: break-word; }
  .tracking-id { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background-color: #f1f5f9; padding: 6px 12px; border-radius: 6px; letter-spacing: 1px; color: ${PRIMARY_COLOR}; font-weight: 700; border: 1px solid #e2e8f0; display: inline-block; margin-top: 4px; }
  .button-container { text-align: center; margin-top: 20px; }
  .button { display: inline-block; background-color: ${PRIMARY_COLOR}; color: #ffffff; padding: 16px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(255, 107, 53, 0.25); }
  .footer { background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
  .footer p { margin: 0 0 12px 0; color: #64748b; font-size: 14px; }
  .footer-links { margin-top: 24px; font-size: 12px; color: #94a3b8; line-height: 1.8; }
  .status-badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
`;

export function generateParcelEmailTemplate(
  parcel: Parcel,
  trackingUrl: string
): { subject: string; html: string; text: string } {
  const subject = `Shipment Confirmation: ${parcel.tracking_id} - ${COMPANY_NAME}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shipment Confirmation</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 class="header-logo">Parcel<span>Flow</span></h1>
            <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Shipment Confirmation</p>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${parcel.receiver_name},</div>
            <p class="intro-text">Your shipment has been successfully registered in our network. The current status is <strong>${parcel.current_status.toUpperCase()}</strong>. You can monitor the progress of your delivery using the details below.</p>
            
            <div class="details-box">
              <div class="detail-row">
                <div class="detail-label">Tracking Number</div>
                <div class="detail-value"><span class="tracking-id">${parcel.tracking_id}</span></div>
              </div>
              
              <div class="detail-row" style="margin-top: 24px;">
                <div class="detail-label">Route</div>
                <div class="detail-value">
                  ${parcel.origin} 
                  <span style="color: ${PRIMARY_COLOR}; font-size: 18px; margin: 0 8px; display: inline-block;">&rarr;</span> 
                  ${parcel.destination}
                </div>
              </div>
              
              ${parcel.estimated_delivery_date ? `
              <div class="detail-row" style="margin-top: 24px;">
                <div class="detail-label">Estimated Delivery</div>
                <div class="detail-value" style="color: #047857;">${new Date(parcel.estimated_delivery_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              ` : ''}
            </div>
            
            <div class="button-container">
              <a href="${trackingUrl}" class="button">Track Your Shipment</a>
              <p style="margin-top: 20px; font-size: 13px; color: #64748b;">If the button doesn't work, copy and paste this link:<br><a href="${trackingUrl}" style="color: ${PRIMARY_COLOR}; word-break: break-all; margin-top: 6px; display: inline-block;">${trackingUrl}</a></p>
            </div>
          </div>
          
          <div class="footer">
            <p>Need assistance? Contact our 24/7 support team.</p>
            <p style="margin-bottom: 0;">Support Email: <a href="mailto:support@parcelflow.jointaccount.org" style="color: ${PRIMARY_COLOR}; text-decoration: none; font-weight: 600;">support@parcelflow.jointaccount.org</a></p>
            
            <div class="footer-links">
              &copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.<br>
              Premium Logistics & Global Freight Solutions<br>
              This is an automated operational message.
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Dear ${parcel.receiver_name},

Your shipment has been successfully registered in our network and is currently ${parcel.current_status.toUpperCase()}. 

Tracking Number: ${parcel.tracking_id}
Route: ${parcel.origin} to ${parcel.destination}
${parcel.estimated_delivery_date ? `Estimated Delivery: ${new Date(parcel.estimated_delivery_date).toLocaleDateString()}` : ''}

Track your shipment live: ${trackingUrl}

If you have any questions, contact our support team at support@parcelflow.jointaccount.org.

${COMPANY_NAME}
  `.trim();

  return { subject, html, text };
}

export function generateUpdateEmailTemplate(
  parcel: Parcel,
  update: TrackingUpdate,
  trackingUrl: string
): { subject: string; html: string; text: string } {
  let subject = `Tracking Update: ${parcel.tracking_id} - ${update.status.toUpperCase()}`;
  if (update.status === 'payment required') {
    subject = `ACTION REQUIRED: Payment Pending for Shipment ${parcel.tracking_id}`;
  }

  let feeAmountDisplay = '';
  let cleanDescription = update.description;
  if (update.status === 'payment required' && update.description) {
    const match = update.description.match(/^Fee Amount:\s*(.*?)\s*\|(.*)/);
    if (match) {
      feeAmountDisplay = match[1].trim();
      cleanDescription = match[2].trim();
    }
  }

  let statusColor = "#3b82f6"; 
  let statusBg = "#dbeafe";
  if (update.status === 'pending' || update.status === 'on hold') { statusColor = "#d97706"; statusBg = "#fef3c7"; }
  if (update.status === 'failed') { statusColor = "#dc2626"; statusBg = "#fee2e2"; }
  if (update.status === 'delivered') { statusColor = "#059669"; statusBg = "#d1fae5"; }
  if (update.status === 'payment required') { statusColor = "#be123c"; statusBg = "#ffe4e6"; }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tracking Update</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 class="header-logo">Parcel<span>Flow</span></h1>
            <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Shipment Status Update</p>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${parcel.receiver_name},</div>
            <p class="intro-text">There is a new update regarding your shipment. Please review the latest details below.</p>
            
            <div class="details-box">
              <div class="detail-row">
                <div class="detail-label">Tracking Number</div>
                <div class="detail-value"><span class="tracking-id">${parcel.tracking_id}</span></div>
              </div>
              
              <div class="detail-row" style="margin-top: 24px;">
                <div class="detail-label">Current Status</div>
                <div class="detail-value">
                  <span class="status-badge" style="background-color: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusColor}40;">
                    ${update.status}
                  </span>
                </div>
              </div>
              
              ${update.location ? `
              <div class="detail-row" style="margin-top: 24px;">
                <div class="detail-label">Location</div>
                <div class="detail-value" style="color: #334155;">${update.location}</div>
              </div>
              ` : ''}
              
              ${cleanDescription ? `
              <div class="detail-row" style="margin-top: 24px;">
                <div class="detail-label">Update Details</div>
                <div class="detail-value" style="color: #334155; line-height: 1.5;">${cleanDescription}</div>
              </div>
              ` : ''}
              
              <div class="detail-row" style="margin-top: 24px;">
                <div class="detail-label">Timestamp</div>
                <div class="detail-value" style="font-size: 14px; color: #64748b;">${new Date(update.created_at).toLocaleString('en-US', {
                  weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
                })}</div>
              </div>
            </div>
            
            ${update.status === 'payment required' ? `
            <div style="background-color: #fff1f2; border-left: 5px solid #e11d48; padding: 32px; margin-top: 32px; border-radius: 0 12px 12px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
              <h3 style="margin-top: 0; color: #be123c; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                Action Required: Payment Needed
              </h3>
              <p style="color: #881337; margin-bottom: 24px; font-size: 15px; line-height: 1.6;">
                To proceed with your delivery and avoid delays, a clearance fee is required. Please settle this payment immediately using one of our supported methods below.
                ${feeAmountDisplay ? `<br><br><strong style="font-size: 18px; color: #be123c; background-color: #ffe4e6; padding: 8px 12px; border-radius: 6px; display: inline-block;">Amount Due: ${feeAmountDisplay}</strong>` : ''}
              </p>
              
              <div style="background-color: #ffffff; padding: 24px; border-radius: 10px; margin-bottom: 24px; border: 1px solid #fecdd3; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <h4 style="margin: 0 0 16px 0; color: #be123c; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Supported Payment Methods</h4>
                <div style="margin-bottom: 12px; color: #4c0519; font-size: 15px;">
                  <strong style="color: #9f1239;">1. Gift Cards</strong><br>
                  <span style="color: #881337;">Apple, Steam, or Amazon Gift Cards are accepted. Purchase the card for the required amount and send the details to our WhatsApp agent.</span>
                </div>
                <div style="color: #4c0519; font-size: 15px;">
                  <strong style="color: #9f1239;">2. PayPal / Crypto</strong><br>
                  <span style="color: #881337;">Fast and secure transfers. Ask our WhatsApp agent for the current billing address.</span>
                </div>
              </div>
              
              <a href="${WHATSAPP_LINK}" style="display: block; width: 100%; text-align: center; background-color: #25D366; color: #ffffff; padding: 18px 0; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);">
                Message us on WhatsApp to Pay
              </a>
              <p style="text-align: center; margin-top: 16px; font-size: 14px; color: #9f1239;">
                WhatsApp Number: <strong>${WHATSAPP_NUMBER}</strong>
              </p>
            </div>
            ` : ''}

            ${update.status !== 'payment required' ? `
            <div class="button-container">
              <a href="${trackingUrl}" class="button">View Live Tracking</a>
            </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>Need assistance? Contact our 24/7 support team.</p>
            <p style="margin-bottom: 0;">Support Email: <a href="mailto:support@parcelflow.jointaccount.org" style="color: ${PRIMARY_COLOR}; text-decoration: none; font-weight: 600;">support@parcelflow.jointaccount.org</a></p>
            
            <div class="footer-links">
              &copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.<br>
              Premium Logistics & Global Freight Solutions<br>
              This is an automated operational message.
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  let text = `
Dear ${parcel.receiver_name},

There is a new status update regarding your shipment: ${update.status.toUpperCase()}

Tracking Number: ${parcel.tracking_id}
${update.location ? `Location: ${update.location}` : ''}
${cleanDescription ? `Update Details: ${cleanDescription}` : ''}
Timestamp: ${new Date(update.created_at).toLocaleString('en-US', { timeZoneName: 'short' })}
`.trim();

  if (update.status === 'payment required') {
    text += `\n\n*** ACTION REQUIRED: PAYMENT NEEDED ***\nTo proceed with your delivery and avoid delays, a clearance fee is required.\n${feeAmountDisplay ? `\nAMOUNT DUE: ${feeAmountDisplay}\n` : ''}\nSUPPORTED PAYMENT METHODS:\n1. Gift Cards: Apple, Steam, or Amazon Gift Cards are accepted.\n2. PayPal / Crypto: Secure and fast transfers.\n\nTO PAY, CONTACT US ON WHATSAPP: ${WHATSAPP_NUMBER}\nOr click this link to message us: ${WHATSAPP_LINK}\n`;
  } else {
    text += `\n\nYou can view full tracking details here: ${trackingUrl}`;
  }

  text += `\n\nIf you have any questions, contact our support team at support@parcelflow.jointaccount.org.\n\n${COMPANY_NAME}\nPremium Logistics & Global Freight Solutions`;

  return { subject, html, text };
}
