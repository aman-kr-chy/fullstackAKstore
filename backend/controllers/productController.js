import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                  name: {
                      $regex: req.query.keyword,
                      $options: 'i',
                  },
              }
            : {};

        // Category filter
        const category = req.query.category ? { category: req.query.category } : {};
        
        // Brand filter
        const brand = req.query.brand ? { brand: req.query.brand } : {};

        // Price filter
        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 1000000;
        const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

        // Rating filter
        const rating = req.query.rating ? { ratings: { $gte: Number(req.query.rating) } } : {};

        const filter = { ...keyword, ...category, ...brand, ...priceFilter, ...rating };

        const count = await Product.countDocuments(filter);
        
        // Sorting
        let sortOption = { createdAt: -1 };
        if (req.query.sort) {
            if (req.query.sort === 'price_asc') sortOption = { price: 1 };
            if (req.query.sort === 'price_desc') sortOption = { price: -1 };
            if (req.query.sort === 'newest') sortOption = { createdAt: -1 };
            if (req.query.sort === 'popular') sortOption = { numOfReviews: -1 };
        }

        const products = await Product.find(filter)
            .populate('category', 'name')
            .populate('brand', 'name')
            .sort(sortOption)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('brand', 'name');

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, category, brand, stock, variants, discountPrice } = req.body;
        
        // Handle images
        let images = [];
        if (req.files) {
            images = req.files.map(file => ({
                public_id: file.filename,
                url: file.path
            }));
        }

        const product = new Product({
            name,
            price,
            user: req.user._id,
            images,
            category,
            brand,
            stock,
            description,
            variants: variants ? JSON.parse(variants) : [],
            discountPrice
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
    try {
        const { name, price, description, category, brand, stock, variants, discountPrice } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.stock = stock || product.stock;
            product.discountPrice = discountPrice || product.discountPrice;
            if(variants) product.variants = JSON.parse(variants);
            
            if (req.files && req.files.length > 0) {
                 const newImages = req.files.map(file => ({
                    public_id: file.filename,
                    url: file.path
                }));
                // In a real app, delete old images from cloudinary here
                product.images = newImages;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Delete images from cloudinary
            // await cloudinary.uploader.destroy(public_id);
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400);
                throw new Error('Product already reviewed');
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);

            product.numOfReviews = product.reviews.length;

            product.ratings =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};
