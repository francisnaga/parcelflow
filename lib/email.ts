import { Parcel, TrackingUpdate } from "./types";

export function generateParcelEmailTemplate(
  parcel: Parcel,
  trackingUrl: string
): { subject: string; html: string } {
  const subject = `Your ParcelFlow Tracking ID: ${parcel.tracking_id}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; }
        .card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 15px 0; background: #f9f9f9; }
        .label { color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
        .value { font-size: 16px; font-weight: 500; margin-bottom: 15px; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
        .footer { color: #666; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 ParcelFlow Tracking</h1>
          <p>Your parcel is on its way!</p>
        </div>
        
        <div class="card">
          <div class="label">Tracking ID</div>
          <div class="value" style="font-family: monospace;">${parcel.tracking_id}</div>
          
          <div class="label">Current Status</div>
          <div class="value">${parcel.current_status.toUpperCase()}</div>
          
          <div class="label">Receiver</div>
          <div class="value">${parcel.receiver_name}</div>
          
          <div class="label">Route</div>
          <div class="value">${parcel.origin} → ${parcel.destination}</div>
          
          ${parcel.estimated_delivery_date ? `
            <div class="label">Est. Delivery</div>
            <div class="value">${new Date(parcel.estimated_delivery_date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          ` : ''}
        </div>
        
        <a href="${trackingUrl}" class="button">Track Your Parcel</a>
        
        <div class="footer">
          <p>Questions? Contact us at support@parcelflow.com</p>
          <p>ParcelFlow © 2026. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

export function generateUpdateEmailTemplate(
  parcel: Parcel,
  update: TrackingUpdate,
  trackingUrl: string
): { subject: string; html: string } {
  const subject = `Parcel Update: ${parcel.tracking_id} - ${update.status.toUpperCase()}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; }
        .card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 15px 0; background: #f9f9f9; }
        .label { color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
        .value { font-size: 16px; font-weight: 500; margin-bottom: 15px; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
        .footer { color: #666; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
        .status-badge { display: inline-block; background: #4CAF50; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Parcel Update</h1>
          <p>We have an update on your shipment</p>
        </div>
        
        <div class="card">
          <div class="label">Tracking ID</div>
          <div class="value" style="font-family: monospace;">${parcel.tracking_id}</div>
          
          <div class="label">Status Update</div>
          <div class="value"><span class="status-badge">${update.status.toUpperCase()}</span></div>
          
          ${update.location ? `
            <div class="label">Location</div>
            <div class="value">📍 ${update.location}</div>
          ` : ''}
          
          ${update.description ? `
            <div class="label">Details</div>
            <div class="value">${update.description}</div>
          ` : ''}
          
          <div class="label">Updated At</div>
          <div class="value">${new Date(update.created_at).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</div>
        </div>
        
        <a href="${trackingUrl}" class="button">View Full Tracking</a>
        
        <div class="footer">
          <p>Questions? Contact us at support@parcelflow.com</p>
          <p>ParcelFlow © 2026. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
