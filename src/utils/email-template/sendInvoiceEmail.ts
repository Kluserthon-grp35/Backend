import { Invoice } from '../../services/email.service';

export const generateInvoiceEmailTemplate = (invoice: Invoice): string => {
	return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="x-ua-compatible" content="ie=edge"/>
    <title>Invoice</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <style type="text/css">
        body, table, td, a {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        table, td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
        }

        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }

        body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        table {
            border-collapse: collapse !important;
        }

        a {
            color: #1a82e2;
        }

        img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
        }
    </style>
</head>
<body style="background-color: #e9ecef">

<div class="preheader"
     style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0">
    A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
</div>

<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                <tr>
                    <td align="center" valign="top" style="padding: 36px 24px">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px">
                            Payzen
                        </h1>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                <tr>
                    <td align="left" bgcolor="#1a82e2"
                        style="padding: 20px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                        <div style="color: #fff; display: flex; justify-content: space-between;">
                            <div>Payzen</div>
                            <div>Invoice</div>
                        </div>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Add your invoice content here -->

    <!-- Header -->
    

    <!-- Body -->
    <tr>
        <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                <tr>
                    <td align="left" bgcolor="#ffffff"
                        style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                        <!-- Invoice details go here -->
                        <tr>
                            <td align="center" bgcolor="#e9ecef">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                                    <!-- Invoice Number and Date -->
                                    <tr>
                                        <td align="left" bgcolor="#ffffff"
                                            style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                                            <p style="margin: 0; font-size: 18px; font-weight: 700; color: #1a82e2;">Invoice Number: ${
																							invoice.invoiceId
																						}</p>
                                            <p style="margin: 0; font-size: 16px; color: #1a82e2;">Date: ${
																							invoice.invoiceDate
																						}</p>
                                        </td>
                                    </tr>
                        
                                    <!-- User Greetings -->
                                    <tr>
                                        <td align="left" bgcolor="#ffffff"
                                            style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                                            <p style="margin: 0; font-size: 16px;">
                                                Dear ${invoice.clientName},
                                            </p>
                                            <p style="margin: 0; font-size: 16px;">
                                                Below are the details of your invoice:
                                            </p>
                                        </td>
                                    </tr>
                        
                                    <!-- Invoice Table -->
                                    <tr>
                                        <td align="left" bgcolor="#ffffff"
                                            style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                                            <!-- Replace the following table with actual invoice data -->
                                            <table border="1" cellpadding="10" cellspacing="0" width="100%">
                                                <thead>
                                                <tr style="background-color: #1a82e2; color: #fff;">
                                                    <th>Product</th>
                                                    <th>Amount</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <!-- Replace the following rows with actual invoice data -->
                                                ${invoice.products
																									.map(
																										(product) => `
                                                    <tr>
                                                        <td>${
																													product.productName
																												}</td>
                                                        <td>${
																													product.amount
																												}</td>
                                                        <td>${
																													product.quantity
																												}</td>
                                                        <td>${
																													product.amount *
																													product.quantity
																												}</td>
                                                    </tr>
                                                `,
																									)
																									.join('')}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                                            
                                    <!-- Invoice Totals -->
                                    <tr>
                                        <td align="right" bgcolor="#ffffff"
                                            style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                                            <p style="margin: 0; font-size: 16px; color: #1a82e2;">Subtotal: ${
																							invoice.subtotal
																						}</p>
                                            <p style="margin: 0; font-size: 16px; color: #1a82e2;">VAT: ${
																							invoice.vat
																						}</p>
                                            <p style="margin: 0; font-size: 18px; font-weight: 700; color: #1a82e2;">Grand Total: ${
																							invoice.grandTotal
																						}</p>
                                            <p style="margin: 0; font-size: 16px; color: #1a82e2;">Due Date: ${
																							invoice.date
																						}</p>
                                        </td>
                                    </tr>
                        
                                    <!-- Payment Link -->
                                    <tr>
                                        <td align="center" bgcolor="#ffffff"
                                            style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                                            <a href="[PaymentLink]" style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #fff; text-decoration: none; border-radius: 6px; background-color: #1a82e2;"
                                               target="_blank">Click to make payment</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Footer -->
    <tr>
        <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                <tr>
                    <td align="center" bgcolor="#e9ecef"
                        style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                        <p style="margin: 0">
                            You received this email because of an invoice from Payzen. If you have any questions, please contact us.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

</body>
</html>
    `;
};

// export const generateInvoiceEmailTemplate = (invoice: Invoice): string => {
//     return `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <meta charset="utf-8" />
//       <meta http-equiv="x-ua-compatible" content="ie=edge" />
//       <title>Invoice</title>
//       <meta name="viewport" content="width=device-width, initial-scale=1" />
//       <style type="text/css">
//         /* Your styling goes here */
//       </style>
//     </head>

//     <body style="background-color: #e9ecef">
//       <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
//         Invoice details for ${invoice.invoiceId}
//       </div>

//       <table border="0" cellpadding="0" cellspacing="0" width="100%">
//         <!-- Header section -->
//         <tr>
//           <td align="center" bgcolor="#1a82e2">
//             <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//               <tr>
//                 <td align="left" valign="top" style="padding: 36px 24px; color: #ffffff; font-size: 24px; font-weight: 700;">
//                   Payzen
//                 </td>
//                 <td align="right" valign="top" style="padding: 36px 24px; color: #ffffff; font-size: 24px; font-weight: 700;">
//                   Invoice
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         <!-- Body section -->
//         <tr>
//           <td align="center" bgcolor="#e9ecef">
//             <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//               <!-- Invoice details -->
//               <tr>
//                 <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
//                   <h2 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
//                     Invoice Details
//                   </h2>
//                   <p style="margin: 0">
//                     Invoice Number: ${invoice.invoiceId}<br/>
//                     Date: ${invoice.date}<br/>
//                     Address: ${invoice.address}
//                   </p>
//                 </td>
//               </tr>

//               <!-- Greeting and Table section -->
//               <tr>
//                 <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
//                   <p style="margin: 0">
//                     ${invoice.greeting}
//                   </p>

//                   <!-- Invoice table -->
//                   <table border="1" cellpadding="10" cellspacing="0" width="100%">
//                     <tr bgcolor="#1a82e2" style="color: #ffffff;">
//                       <th>Product Name</th>
//                       <th>Amount</th>
//                       <th>Quantity</th>
//                       <th>Total</th>
//                     </tr>
//                     ${invoice.items.map(item => `
//                       <tr>
//                         <td>${item.product}</td>
//                         <td>${item.amount}</td>
//                         <td>${item.quantity}</td>
//                         <td>${item.amount * item.quantity}</td>
//                       </tr>
//                     `).join('')}
//                   </table>
//                 </td>
//               </tr>

//               <!-- Totals section -->
//               <tr>
//                 <td align="right" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
//                   <p style="margin: 0">
//                     Subtotal: ${invoice.subtotal}<br/>
//                     VAT: ${invoice.vat}<br/>
//                     Grand Total: ${invoice.grandTotal}
//                   </p>
//                 </td>
//               </tr>

//               <!-- Payment link section -->
//               <tr>
//                 <td align="center" bgcolor="#1a82e2" style="padding: 24px;">
//                   <a href="your_payment_link_here" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; background-color: #1a82e2;">Click to Make Payment</a>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         <!-- Footer section -->
//         <tr>
//           <td align="center" bgcolor="#e9ecef" style="padding: 24px">
//             <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//               <tr>
//                 <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
//                   <p style="margin: 0">
//                     You received this email because of an invoice from Payzen. If you have any questions, please contact us.
//                   </p>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//       </table>
//     </body>
//   </html>
//   `;
// };
