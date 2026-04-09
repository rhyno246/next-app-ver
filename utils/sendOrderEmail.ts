import { transporter } from "./mailer";


type OrderItem = {
  title: string;
  quantity: number;
  price: number;
  sale: number;
};

type SendOrderEmailArgs = {
  to: string;
  code: number;
  items: OrderItem[];
  shippingName: string;
  shippingAddress: string;
  shippingPhone: string;
  shippingFee: number;
  total: number;
};

export const sendOrderEmail = async (args: SendOrderEmailArgs) => {
  const itemsHtml = args.items
    .map((item) => {
      const finalPrice =
        item.sale > 0
          ? item.price - (item.price * item.sale) / 100
          : item.price;
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${item.title}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">$${(finalPrice * item.quantity).toFixed(0)}</td>
        </tr>
      `;
    })
    .join("");

  await transporter.sendMail({
    from: `"NextMerce" <${process.env.SMTP_USER}>`,
    to: args.to,
    subject: `Order #${args.code} Confirmed`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#1a1a1a">Thank you for your order!</h2>
        <p style="color:#555">Your order <strong>#${args.code}</strong> has been placed successfully.</p>

        <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:24px 0">
          <p style="margin:0 0 4px;color:#555;font-size:14px">Shipping to</p>
          <p style="margin:0;font-weight:600;color:#1a1a1a">${args.shippingName}</p>
          <p style="margin:4px 0 0;color:#555;font-size:14px">${args.shippingAddress}</p>
          <p style="margin:4px 0 0;color:#555;font-size:14px">${args.shippingPhone}</p>
        </div>

        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f0f0f0">
              <th style="padding:10px 12px;text-align:left;font-size:14px">Product</th>
              <th style="padding:10px 12px;text-align:center;font-size:14px">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:14px">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="margin-top:16px;text-align:right">
          <p style="color:#555;font-size:14px">
            Shipping: ${args.shippingFee === 0 ? "Free" : `$${args.shippingFee}`}
          </p>
          <p style="font-size:18px;font-weight:700;color:#1a1a1a">
            Total: $${args.total}
          </p>
        </div>

        <p style="color:#999;font-size:12px;margin-top:32px">
          If you have any questions, please contact us.
        </p>
      </div>
    `,
  });
};