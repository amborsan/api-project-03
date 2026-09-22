import prisma from '../lib/prisma.js';
import crypto from 'crypto';

export const checkout = async (req, res) => {
  const { userId } = req.body;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { product: true } }
    }
  });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  let subtotal = 0;
  const orderItemsData = cart.items.map(item => {
    const unitPrice = parseFloat(item.product.price);
    subtotal += unitPrice * item.quantity;
    
    return {
      productId: item.product.id,
      productName: item.product.name,
      unitPrice,
      quantity: item.quantity
    };
  });

  const orderNumber = `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        grandTotal: subtotal,
        items: { create: orderItemsData }
      },
      include: { items: true }
    });

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.product.id },
        data: { stock: { decrement: item.quantity } }
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  res.status(201).json({ message: 'Order placed successfully', order });
};