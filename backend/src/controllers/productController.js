import prisma from '../lib/prisma.js';

export const getAllProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true }, // Only fetch active products based on schema default
    include: {
      brand: true,
      categories: { include: { category: true } }
    }
  });
  res.json(products);
};

export const createProduct = async (req, res) => {
  const { name, slug, price, brandId, stock, categoryIds } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      price,
      brandId,
      stock,
      categories: {
        create: categoryIds?.map(id => ({
          category: { connect: { id } },
          name: name,
          desctiption: "Default mapped description" // Typo 'desctiption' matched to your schema
        }))
      }
    }
  });

  res.status(201).json(product);
};
