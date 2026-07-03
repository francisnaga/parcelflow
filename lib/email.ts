import { Parcel, TrackingUpdate } from "./types";

export function generateParcelEmailTemplate(
  parcel: Parcel,
  trackingUrl: string
): { subject: string; html: string; text: string } {
  const subject = `Your ParcelFlow Shipment - Tracking ID: ${parcel.tracking_id}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ParcelFlow Tracking Update</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; color: #1f2937; line-height: 1.6; margin: 0; padding: 0; }
        .wrapper { padding: 40px 20px; text-align: center; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; text-align: left; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #111827; color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
        .header p { margin: 10px 0 0 0; color: #9ca3af; font-size: 15px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; margin-bottom: 24px; color: #111827; }
        .details-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 30px; }
        .detail-row { margin-bottom: 16px; }
        .detail-row:last-child { margin-bottom: 0; }
        .detail-label { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 4px; font-weight: 600; }
        .detail-value { font-size: 16px; color: #111827; font-weight: 500; }
        .tracking-id { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background-color: #e5e7eb; padding: 4px 8px; border-radius: 4px; letter-spacing: 0.5px; }
        .button-container { text-align: center; margin-top: 10px; }
        .button { display: inline-block; background-color: #f97316; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { margin: 0 0 10px 0; color: #6b7280; font-size: 14px; }
        .footer-links { margin-top: 20px; font-size: 12px; color: #9ca3af; }
        .footer-links a { color: #9ca3af; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>ParcelFlow</h1>
            <p>Shipment Confirmation</p>
          </div>
          
          <div class="content">
            <div class="greeting">Hello ${parcel.receiver_name},</div>
            <p style="margin-bottom: 24px; color: #4b5563;">Your shipment has been successfully processed and is currently <strong>${parcel.current_status}</strong>. You can track the progress of your delivery using the tracking number below.</p>
            
            <div class="details-box">
              <div class="detail-row">
                <div class="detail-label">Tracking Number</div>
                <div class="detail-value"><span class="tracking-id">${parcel.tracking_id}</span></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Shipment Route</div>
                <div class="detail-value">${parcel.origin} &rarr; ${parcel.destination}</div>
              </div>
              
              ${parcel.estimated_delivery_date ? `
              <div class="detail-row">
                <div class="detail-label">Estimated Delivery</div>
                <div class="detail-value">${new Date(parcel.estimated_delivery_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              ` : ''}
            </div>
            
            <div class="button-container">
              <a href="${trackingUrl}" class="button">Track Shipment</a>
            </div>
          </div>
          
          <div class="footer">
            <p>If you have any questions regarding your shipment, please contact our support team.</p>
            <p style="margin-bottom: 0;">Support Email: <a href="mailto:support@parcelflow.com" style="color: #f97316; text-decoration: none;">support@parcelflow.com</a></p>
            
            <div class="footer-links">
              &copy; ${new Date().getFullYear()} ParcelFlow Logistics. All rights reserved.<br>
              This is an automated message, please do not reply directly to this email.
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Hello ${parcel.receiver_name},

Your shipment has been successfully processed and is currently ${parcel.current_status}. 

Tracking Number: ${parcel.tracking_id}
Shipment Route: ${parcel.origin} to ${parcel.destination}
${parcel.estimated_delivery_date ? `Estimated Delivery: ${new Date(parcel.estimated_delivery_date).toLocaleDateString()}` : ''}

You can track your shipment here: ${trackingUrl}

If you have any questions, please contact our support team at support@parcelflow.jointaccount.org.

ParcelFlow Logistics
  `.trim();

  return { subject, html, text };
}

export function generateUpdateEmailTemplate(
  parcel: Parcel,
  update: TrackingUpdate,
  trackingUrl: string
): { subject: string; html: string; text: string } {
  const subject = `Shipment Update: ${parcel.tracking_id} - ${update.status.toUpperCase()}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ParcelFlow Tracking Update</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; color: #1f2937; line-height: 1.6; margin: 0; padding: 0; }
        .wrapper { padding: 40px 20px; text-align: center; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; text-align: left; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #111827; color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
        .header p { margin: 10px 0 0 0; color: #9ca3af; font-size: 15px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; margin-bottom: 24px; color: #111827; }
        .details-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 30px; }
        .detail-row { margin-bottom: 16px; }
        .detail-row:last-child { margin-bottom: 0; }
        .detail-label { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 4px; font-weight: 600; }
        .detail-value { font-size: 16px; color: #111827; font-weight: 500; }
        .status-badge { display: inline-block; background-color: #10b981; color: #ffffff; padding: 4px 12px; border-radius: 4px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-pending { background-color: #f59e0b; }
        .status-failed { background-color: #ef4444; }
        .button-container { text-align: center; margin-top: 10px; }
        .button { display: inline-block; background-color: #f97316; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { margin: 0 0 10px 0; color: #6b7280; font-size: 14px; }
        .footer-links { margin-top: 20px; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>ParcelFlow</h1>
            <p>Tracking Status Update</p>
          </div>
          
          <div class="content">
            <div class="greeting">Hello ${parcel.receiver_name},</div>
            <p style="margin-bottom: 24px; color: #4b5563;">There is a new status update regarding your shipment. Please review the latest tracking details below.</p>
            
            <div class="details-box">
              <div class="detail-row">
                <div class="detail-label">Tracking Number</div>
                <div class="detail-value" style="font-family: monospace;">${parcel.tracking_id}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Current Status</div>
                <div class="detail-value">
                  <span class="status-badge ${update.status === 'pending' || update.status === 'on hold' ? 'status-pending' : update.status === 'failed' ? 'status-failed' : ''}">
                    ${update.status}
                  </span>
                </div>
              </div>
              
              ${update.location ? `
              <div class="detail-row">
                <div class="detail-label">Location</div>
                <div class="detail-value">${update.location}</div>
              </div>
              ` : ''}
              
              ${update.description ? `
              <div class="detail-row">
                <div class="detail-label">Update Details</div>
                <div class="detail-value">${update.description}</div>
              </div>
              ` : ''}
              
              <div class="detail-row">
                <div class="detail-label">Time of Update</div>
                <div class="detail-value">${new Date(update.created_at).toLocaleString('en-US', {
                  weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
                })}</div>
              </div>
            </div>
            
            <div class="button-container">
              <a href="${trackingUrl}" class="button">View Full Tracking Details</a>
            </div>
          </div>
          
          <div class="footer">
            <p>If you have any questions regarding your shipment, please contact our support team.</p>
            <p style="margin-bottom: 0;">Support Email: <a href="mailto:support@parcelflow.com" style="color: #f97316; text-decoration: none;">support@parcelflow.com</a></p>
            
            <div class="footer-links">
              &copy; ${new Date().getFullYear()} ParcelFlow Logistics. All rights reserved.<br>
              This is an automated message, please do not reply directly to this email.
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Hello ${parcel.receiver_name},

There is a new status update regarding your shipment: ${update.status.toUpperCase()}

Tracking Number: ${parcel.tracking_id}
${update.location ? `Location: ${update.location}` : ''}
${update.description ? `Update Details: ${update.description}` : ''}
Time of Update: ${new Date(update.created_at).toLocaleString('en-US', { timeZoneName: 'short' })}

You can view full tracking details here: ${trackingUrl}

If you have any questions, please contact our support team at support@parcelflow.jointaccount.org.

ParcelFlow Logistics
  `.trim();

  return { subject, html, text };
}
