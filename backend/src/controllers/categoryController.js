import prisma from '../lib/prisma.js';

// Get categories as a tree (fetching top-level categories and their immediate children)
export const getCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { parentId: null }, // Only fetch root categories
    include: { 
      children: true // Include sub-categories
    }
  });
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const { name, slug, parentId } = req.body;
  
  const category = await prisma.category.create({
    data: { name, slug, parentId }
  });
  
  res.status(201).json(category);
};

// Fetch a single category and all products assigned to it via the junction table
export const getCategoryProducts = async (req, res) => {
  const { slug } = req.params;

  const categoryWithProducts = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          product: {
            select: { id: true, name: true, price: true, isActive: true }
          }
        }
      }
    }
  });

  if (!categoryWithProducts) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Format the response to flatten the junction table data
  const formattedProducts = categoryWithProducts.products.map(p => ({
    ...p.product,
    mappingName: p.name,
    mappingDescription: p.desctiption // Matching the typo in your schema
  }));

  res.json({
    category: { id: categoryWithProducts.id, name: categoryWithProducts.name },
    products: formattedProducts
  });
};