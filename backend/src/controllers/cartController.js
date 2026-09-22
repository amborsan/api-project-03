import prisma from '../lib/prisma.js';

export const getCart = async (req, res) => {
  const { userId } = req.params;
  
  const cart = await prisma.cart.findUnique({
    where: { userId: parseInt(userId, 10) },
    include: {
      items: {
        include: { product: true } // Fetches the product directly
      }
    }
  });

  if (!cart) return res.status(404).json({ message: 'Cart is empty or not found' });
  res.json(cart);
};

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId }
  });

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } }
  });

  let cartItem;
  if (existingItem) {
    cartItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity }
    });
  }

  res.status(200).json({ message: 'Item added to cart', cartItem });
};