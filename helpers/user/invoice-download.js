
const Order = require('../../models/user/order-schema');
const code  = require('../../helpers/user/statusCode');
const PDFDocument = require('pdfkit');
const Product = require('../../models/admin/productSchema');


const downloadInvoice = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Populate product to get its name
    const order = await Order.findOne({ orderId }).populate('orderedItems.product');

    if (!order) {
      return res.status(404).send('Order not found');
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    doc
      .fillColor('#3b5d50')
      .fontSize(22)
      .text('INVOICE', { align: 'center' })
      .moveDown();

    doc
      .fillColor('black')
      .fontSize(12)
      .text(`Invoice ID: ${order.orderId}`)
      .text(`Date: ${new Date(order.invoiceDate).toLocaleString()}`)
      .text(`Status: ${order.status}`)
      .moveDown();

    const { name, email, phone } = order.userData;
    const addr = order.address;

    doc
      .fillColor('#3b5d50')
      .fontSize(14)
      .text('Customer Details', { underline: true })
      .moveDown(0.5);

    doc
      .fillColor('black')
      .fontSize(12)
      .text(`Name: ${name}`)
      .text(`Email: ${email}`)
      .text(`Phone: ${phone}`)
      .moveDown();

    doc
      .fillColor('#3b5d50')
      .fontSize(14)
      .text('Shipping Address', { underline: true })
      .moveDown(0.5);

    doc
      .fillColor('black')
      .fontSize(12)
      .text(`${addr.fullname}, ${addr.house_flat}, ${addr.village_city}, ${addr.district}, ${addr.state}, ${addr.pincode}`)
      .text(`Mobile: ${addr.mobile}`)
      .text(`Landmark: ${addr.landmark}`)
      .text(`Address Type: ${addr.addressType}`)
      .moveDown();

    doc
      .fillColor('#3b5d50')
      .fontSize(14)
      .text('Ordered Items', { underline: true })
      .moveDown(0.5);

    const itemX = 50;
    const quantityX = 300;
    const priceX = 370;
    const totalX = 440;

 
    doc
  .fontSize(12);

const headerY = doc.y; // Store the current y-position

doc
  .text('Product', itemX, headerY)
  .text('Qty', quantityX, headerY)
  .text('Price', priceX, headerY)
  .text('Total', totalX, headerY);

doc.moveDown(0.5);
//==============================

    order.orderedItems.forEach(item => {
      const y = doc.y;
      const productName = item.product?.productTitle || 'Unnamed Product';
      doc
        .text(productName, itemX, y)
        .text(item.quantity.toString(), quantityX, y)
        .text(`${item.price}`, priceX, y)
        .text(`${(item.price * item.quantity).toFixed(2)}`, totalX, y);
      doc.moveDown(0.5);
    });

    doc
      .moveDown(2)
      .fillColor('#3b5d50')
      .fontSize(14)
      .text('Payment Summary', { underline: true })
      .moveDown(0.5)
      .fillColor('black')
      .fontSize(12)
      .text(`Subtotal: ${order.totalPrice.toFixed(2)}`)
      .text(`Discount: ${order.discount.toFixed(2)}`)
      .text(`Shipping: ${order.shippingCharge.toFixed(2)}`)
      .text(`Total Amount: ${order.totalPrice.toFixed(2)}`)
      .text(`Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}`);

    doc.end();
  } catch (error) {
    console.error('Error during download the PDF:', error);
    res.status(500).send('Failed to generate invoice');
  }
};



module.exports = {
    downloadInvoice
}