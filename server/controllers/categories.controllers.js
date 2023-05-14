const Category = require('../models/category.js');

async function getCategories(req, res) {
    const categories = await Category.find({}).exec();

    res.json(categories);
}

async function getCategory(req, res) {
    try {
        const categoryId = req.params.categoryId;
        const category = await Catagory.findOne({_id: categoryId}).exec();

        res.json(category);
    } catch {
        console.log(err)
        res.status(500).json({message: 'server error'})
    }
}

async function createCategory (req, res) {
    const body = req.body;
    const category = new Category(body);

    try {
        await category.save();
    }  catch {
        res.status(500).json({message: "Failed to create"});
        return;
    }

    res.json(category);
}

function removeCategory() {

}

function updateCategory() {

}



module.exports = {
    getCategories,
    getCategory,
    createCategory,
    removeCategory,
    updateCategory

}