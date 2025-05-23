
const Order = require('../../models/user/order-schema');
const code  = require('../../helpers/user/statusCode');
const PDFDocument = require('pdfkit');
const Product = require('../../models/admin/productSchema');


// const downloadInvoice = async (req,res) => {
//     try {
//         const orderId = req.params.orderId;
//         const order = await Order.findOne({ orderId })
//          console.log("==========order Data",order)
//       } catch (error) {
//         console.log('error during download the pdf',error)
//         res.status(code.HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to generate invoice');
//       }
// }


// const downloadInvoice = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     const order = await Order.findOne({ orderId }).populate('orderedItems.product');

//     if (!order) {
//       return res.status(404).send('Order not found');
//     }

//     const doc = new PDFDocument({ margin: 50 });

//     // Set response headers
//     res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
//     res.setHeader('Content-Type', 'application/pdf');

//     // Pipe PDF to response
//     doc.pipe(res);

//     // ========== Invoice Header ==========
//     doc
//       .fontSize(20)
//       .text('INVOICE', { align: 'center' })
//       .moveDown();

//     doc
//       .fontSize(12)
//       .text(`Invoice ID: ${order.orderId}`)
//       .text(`Date: ${new Date(order.invoiceDate).toLocaleString()}`)
//       .text(`Status: ${order.status}`)
//       .moveDown();

//     // ========== Customer Info ==========
//     doc.fontSize(14).text('Customer Details', { underline: true }).moveDown(0.5);

//     const { name, email, phone } = order.userData;
//     const addr = order.address;

//     doc
//       .fontSize(12)
//       .text(`Name: ${name}`)
//       .text(`Email: ${email}`)
//       .text(`Phone: ${phone}`)
//       .moveDown();

//     doc.fontSize(14).text('Shipping Address', { underline: true }).moveDown(0.5);

//     doc
//       .fontSize(12)
//       .text(`${addr.fullname}, ${addr.house_flat}, ${addr.village_city}, ${addr.district}, ${addr.state}, ${addr.pincode}`)
//       .text(`Mobile: ${addr.mobile}`)
//       .text(`Landmark: ${addr.landmark}`)
//       .text(`Address Type: ${addr.addressType}`)
//       .moveDown();

//     // ========== Ordered Items ==========
//     doc.fontSize(14).text('Ordered Items', { underline: true }).moveDown(0.5);

//     const tableTop = doc.y;
//     const itemX = 50;
//     const quantityX = 300;
//     const priceX = 370;
//     const totalX = 440;

//     doc
//       .fontSize(12)
//       .text('Product', itemX, tableTop)
//       .text('Qty', quantityX, tableTop)
//       .text('Price', priceX, tableTop)
//       .text('Total', totalX, tableTop);

//     doc.moveDown(0.5);

//     order.orderedItems.forEach(item => {
//       const y = doc.y;
//       const productName = item.productDetails?.name || 'Product';
//       doc
//         .text(productName, itemX, y)
//         .text(item.quantity, quantityX, y)
//         .text(`₹${item.price}`, priceX, y)
//         .text(`₹${item.price * item.quantity}`, totalX, y);
//       doc.moveDown(0.5);
//     });

//     // ========== Payment Summary ==========
//     doc.moveDown(2);
//     doc.fontSize(14).text('Payment Summary', { underline: true }).moveDown(0.5);

//     doc
//       .fontSize(12)
//       .text(`Subtotal: ${order.totalPrice}`)
//       .text(`Discount: ${order.discount}`)
//       .text(`Shipping: ${order.shippingCharge}`)
//       .text(`Final Amount: ${order.finalAmount}`)
//       .text(`Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}`);

//     // Finalize PDF
//     doc.end();
//   } catch (error) {
//     console.error('Error during download the PDF', error);
//     res.status(500).send('Failed to generate invoice');
//   }
// };



// const downloadInvoice = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     const order = await Order.findOne({ orderId }).populate('orderedItems.product');

//     if (!order) {
//       return res.status(404).send('Order not found');
//     }

//     const doc = new PDFDocument({ margin: 50 });

//     // Set response headers
//     res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
//     res.setHeader('Content-Type', 'application/pdf');

//     // Pipe PDF to response
//     doc.pipe(res);

//     const primaryColor = '#3b5d50';

//     // ========== Invoice Header ==========
//     doc
//       .fillColor(primaryColor)
//       .fontSize(22)
//       .text('INVOICE', { align: 'center' })
//       .moveDown();

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text(`Invoice ID: ${order.orderId}`)
//       .text(`Date: ${new Date(order.invoiceDate).toLocaleString()}`)
//       .text(`Status: ${order.status}`)
//       .moveDown();

//     // ========== Customer Info ==========
//     doc.fillColor(primaryColor).fontSize(14).text('Customer Details', { underline: true }).moveDown(0.5);

//     const { name, email, phone } = order.userData;
//     const addr = order.address;

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text(`Name: ${name}`)
//       .text(`Email: ${email}`)
//       .text(`Phone: ${phone}`)
//       .moveDown();

//     doc.fillColor(primaryColor).fontSize(14).text('Shipping Address', { underline: true }).moveDown(0.5);

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text(`${addr.fullname}, ${addr.house_flat}, ${addr.village_city}, ${addr.district}, ${addr.state}, ${addr.pincode}`)
//       .text(`Mobile: ${addr.mobile}`)
//       .text(`Landmark: ${addr.landmark}`)
//       .text(`Address Type: ${addr.addressType}`)
//       .moveDown();

//     // ========== Ordered Items ==========
//     doc.fillColor(primaryColor).fontSize(14).text('Ordered Items', { underline: true }).moveDown(0.5);

//     const tableTop = doc.y;
//     const itemX = 50;
//     const quantityX = 300;
//     const priceX = 370;
//     const totalX = 440;

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text('Product', itemX, tableTop)
//       .text('Qty', quantityX, tableTop)
//       .text('Price', priceX, tableTop)
//       .text('Total', totalX, tableTop);

//     doc.moveDown(0.5);

//     order.orderedItems.forEach(item => {
//       const y = doc.y;
//       const productName = item.productDetails?.name || 'Product';
//       doc
//         .text(productName, itemX, y)
//         .text(item.quantity, quantityX, y)
//         .text(`${item.price}`, priceX, y)
//         .text(`${item.price * item.quantity}`, totalX, y);
//       doc.moveDown(0.5);
//     });

//     // ========== Payment Summary ==========
//     doc.moveDown(2);
//     doc.fillColor(primaryColor).fontSize(14).text('Payment Summary', { underline: true }).moveDown(0.5);

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text(`Subtotal: ${order.totalPrice}`)
//       .text(`Discount: ${order.discount}`)
//       .text(`Shipping: ${order.shippingCharge}`)
//       .text(`Final Amount: ${order.finalAmount}`)
//       .text(`Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}`);

//     doc.end();
//   } catch (error) {
//     console.error('Error during download the PDF', error);
//     res.status(500).send('Failed to generate invoice');
//   }
// };


// const downloadInvoice = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     const order = await Order.findOne({ orderId }).populate('orderedItems.product');

//     if (!order) {
//       return res.status(404).send('Order not found');
//     }

//     const doc = new PDFDocument({ margin: 50 });

//     // Set response headers
//     res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
//     res.setHeader('Content-Type', 'application/pdf');

//     doc.pipe(res);

//     // Header
//     doc
//       .fillColor('#3b5d50')
//       .fontSize(20)
//       .text('INVOICE', { align: 'center' })
//       .moveDown();

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text(`Invoice ID: ${order.orderId}`)
//       .text(`Date: ${new Date(order.invoiceDate).toLocaleString()}`)
//       .text(`Status: ${order.status}`)
//       .moveDown();

//     // Customer Info
//     doc
//       .fillColor('#3b5d50')
//       .fontSize(14)
//       .text('Customer Details', { underline: true })
//       .moveDown(0.5);

//     const { name, email, phone } = order.userData;
//     const addr = order.address;

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text(`Name: ${name}`)
//       .text(`Email: ${email}`)
//       .text(`Phone: ${phone}`)
//       .moveDown();

//     doc
//       .fillColor('#3b5d50')
//       .fontSize(14)
//       .text('Shipping Address', { underline: true })
//       .moveDown(0.5);

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text(`${addr.fullname}, ${addr.house_flat}, ${addr.village_city}, ${addr.district}, ${addr.state}, ${addr.pincode}`)
//       .text(`Mobile: ${addr.mobile}`)
//       .text(`Landmark: ${addr.landmark}`)
//       .text(`Address Type: ${addr.addressType}`)
//       .moveDown();

//     // Ordered Items
//     doc
//       .fillColor('#3b5d50')
//       .fontSize(14)
//       .text('Ordered Items', { underline: true })
//       .moveDown(0.5);

//     const itemX = 50;
//     const quantityX = 300;
//     const priceX = 370;
//     const totalX = 440;

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text('Product', itemX)
//       .text('Qty', quantityX)
//       .text('Price', priceX)
//       .text('Total', totalX);

//     doc.moveDown(0.5);

//     order.orderedItems.forEach(item => {
//       const y = doc.y;
//       const productName = item.productDetails?.name || item.product.name || 'Product';
//       doc
//         .text(productName, itemX, y)
//         .text(item.quantity, quantityX, y)
//         .text(`${item.price}`, priceX, y)
//         .text(`${item.price * item.quantity}`, totalX, y);
//       doc.moveDown(0.5);
//     });

//     // Payment Summary
//     doc
//       .moveDown(2)
//       .fillColor('#3b5d50')
//       .fontSize(14)
//       .text('Payment Summary', { underline: true })
//       .moveDown(0.5)
//       .fillColor('black')
//       .fontSize(12)
//       .text(`Subtotal: ${order.totalPrice}`)
//       .text(`Discount: ${order.discount}`)
//       .text(`Shipping: ${order.shippingCharge}`)
//       .text(`Final Amount: ${order.finalAmount}`)
//       .text(`Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}`);

//     doc.end();
//   } catch (error) {
//     console.error('Error during download the PDF', error);
//     res.status(500).send('Failed to generate invoice');
//   }
// };



// const downloadInvoice = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;

//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return res.status(404).send('Order not found');
//     }

//     const doc = new PDFDocument({ margin: 50 });

//     res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
//     res.setHeader('Content-Type', 'application/pdf');

//     doc.pipe(res);

//     // Header
//     doc
//       .fillColor('#3b5d50')
//       .fontSize(22)
//       .text('INVOICE', { align: 'center' })
//       .moveDown();

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text(`Invoice ID: ${order.orderId}`)
//       .text(`Date: ${new Date(order.invoiceDate).toLocaleString()}`)
//       .text(`Status: ${order.status}`)
//       .moveDown();

//     // Customer Info
//     doc
//       .fillColor('#3b5d50')
//       .fontSize(14)
//       .text('Customer Details', { underline: true })
//       .moveDown(0.5);

//     const { name, email, phone } = order.userData;
//     const addr = order.address;

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text(`Name: ${name}`)
//       .text(`Email: ${email}`)
//       .text(`Phone: ${phone}`)
//       .moveDown();

//     // Address
//     doc
//       .fillColor('#3b5d50')
//       .fontSize(14)
//       .text('Shipping Address', { underline: true })
//       .moveDown(0.5);

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text(`${addr.fullname}, ${addr.house_flat}, ${addr.village_city}, ${addr.district}, ${addr.state}, ${addr.pincode}`)
//       .text(`Mobile: ${addr.mobile}`)
//       .text(`Landmark: ${addr.landmark}`)
//       .text(`Address Type: ${addr.addressType}`)
//       .moveDown();

//     // Ordered Items
//     doc
//       .fillColor('#3b5d50')
//       .fontSize(14)
//       .text('Ordered Items', { underline: true })
//       .moveDown(0.5);

//     const itemX = 50;
//     const quantityX = 300;
//     const priceX = 370;
//     const totalX = 440;

//     doc
//       .fillColor('black')
//       .fontSize(12)
//       .text('Product', itemX)
//       .text('Qty', quantityX)
//       .text('Price', priceX)
//       .text('Total', totalX);

//     doc.moveDown(0.5);

//     order.orderedItems.forEach(item => {
//       const y = doc.y;
//       const productName = item.productDetails?.productTitle || 'Unnamed Product';
//       doc
//         .text(productName, itemX, y)
//         .text(item.quantity.toString(), quantityX, y)
//         .text(`${item.price}`, priceX, y)
//         .text(`${(item.price * item.quantity).toFixed(2)}`, totalX, y);
//       doc.moveDown(0.5);
//     });

//     // Summary
//     doc
//       .moveDown(2)
//       .fillColor('#3b5d50')
//       .fontSize(14)
//       .text('Payment Summary', { underline: true })
//       .moveDown(0.5)
//       .fillColor('black')
//       .fontSize(12)
//       .text(`Subtotal: ${order.totalPrice.toFixed(2)}`)
//       .text(`Discount: ${order.discount.toFixed(2)}`)
//       .text(`Shipping: ${order.shippingCharge.toFixed(2)}`)
//       .text(`Final Amount: ${order.finalAmount.toFixed(2)}`)
//       .text(`Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}`);

//     doc.end();
//   } catch (error) {
//     console.error('Error during download the PDF:', error);
//     res.status(500).send('Failed to generate invoice');
//   }
// };


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

    // doc
    //   .fillColor('black')
    //   .fontSize(12)
    //   .text('Product', itemX)
    //   .text('Qty', quantityX)
    //   .text('Price', priceX)
    //   .text('Total', totalX);

    // doc.moveDown(0.5);
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