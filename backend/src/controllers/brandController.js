import prisma from '../lib/prisma.js';

export const getBrands = async (req, res) => {
  const brands = await prisma.brand.findMany();
  res.json(brands);
};

export const getBrandById = async (req, res) => {
  const { id } = req.params;
  
  const brand = await prisma.brand.findUnique({
    where: { id: parseInt(id, 10) },
    include: { 
      products: {
        select: { id: true, name: true, price: true, isActive: true }
      } 
    }
  });

  if (!brand) return res.status(404).json({ error: 'Brand not found' });
  res.json(brand);
};

export const createBrand = async (req, res) => {
  const { name, slug } = req.body;
  
  const brand = await prisma.brand.create({
    data: { name, slug }
  });
  
  res.status(201).json(brand);
};