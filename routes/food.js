const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express")

const router = express.Router()

const prisma = new PrismaClient();

// Get all foods
router.get('/', async (req, res)=>{
    try {
        const foods = await prisma.foodItem.findMany()
        return res.json({success: true, method: "get", foods})
    }
    catch (e) {
        return res.status(401).json({success: "false", method: "get", message: e.message})
    }
})

// Get a specific foods infomation
router.get('/:id', async (req, res) =>{
    const id = req.params.id
    try {
        const food = await prisma.foodItem.findFirst({where: {id}, include: {foodIngredient: true}})

        return res.json({success: true, method: "get", food})
    }
    catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2001') {
                return res.status(404).json({success: false, method: "post", message: `${e.meta.target} not found`})
            }
        }
        return res.status(401).json({success: false, method: "put", message: e.message})
    }
} )
// Create a new food item
router.post('/', async (req, res) =>{
    const {name, price, sale_price, img, description, state, category} = req.body
    const ingredients = req.body.ingredients // ingredients : [{id, amount}]

    // If ingredients are posted, create a connect for many-many table
    let connectIngredient;
    if(ingredients) connectIngredient = {
        foodIngredient: {
            create: ingredients.map((ing) => ({amount: ing.amount, ingredient: {connect: {id: ing.id}}}))
        }
    }

    try {
        let newFood = {
            name, price, sale_price, img, description, state, category
        }
        const queryRes = await prisma.foodItem.create({
            data: {...newFood, ...connectIngredient}, include: {foodIngredient: true}})

        return res.json({success: true, method: "post", food: queryRes})
    }
    catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
                return res.status(404).json({success: false, method: "post", message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
        }
        return res.status(401).json({success: false, method: "put", message: e.message})
    }
} )

// Update food information
router.put('/:id', async (req, res) => {
    const {name, price, sale_price, img, description, state, category} = req.body
    const ingredients = req.body.ingredients // ingredients : [{id, amount}]

    const {id} = req.params
    // If ingredients are posted, create a connect for many-many table
    let connectIngredient;
    if(ingredients) {
        await prisma.foodIngredient.deleteMany({where: {foodId: id}})
        connectIngredient = {
            foodIngredient: {
                create: ingredients.map((ing) => (
                    {amount: ing.amount, ingredient: {connect: {id: ing.id}}})
                )
            }
        }
    }
    try{
        const queryRes = await prisma.foodItem.update({
            where: {
                id
            },
            data: {
                name: name ? name : undefined,
                price: price ? price : undefined,
                sale_price: sale_price ? sale_price : undefined,
                img: img ? img : undefined,
                description: description ? description : undefined,
                state: state ? state : undefined,
                category: category ? category : undefined,
                // Catch food ingredient size and undefined
                ...connectIngredient
            }, include: {foodIngredient: true}
        })

        return res.json({success: true, method: "put", food: queryRes})
    }
    catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
                return res.status(404).json({success: false, method: "put", message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
            if (e.code === 'P2001') {
                return res.status(404).json({success: false, method: "put", message: `${e.meta.target} not found`})
            }
        }
        return res.status(401).json({success: false, method: "put", message: e.message})

    }
})
// Delete a food item
router.delete('/:id', async (req, res) => {
    const {id} = req.params
    try{
        const delTarget = prisma.foodItem.delete({
            where: {
                id: id
            }
        })

        const delFoodIngredient = prisma.foodIngredient.deleteMany({
            where: {
                foodId: id
            }
        })

        await prisma.$transaction([delFoodIngredient, delTarget])

        return res.json({success: true, method: "delete"})
    }
    catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return res.status(404).json({success: false, method: "put", message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
            if (e.code === 'P2001') {
                return res.status(404).json({success: false, method: "put", message: `${e.meta.target} not found`})
            }
            if (e.code === 'P2025') {
                return res.status(404).json({success: false, method: "put", message: `${e.meta.target} not found`})
            }
        }
        return res.status(401).json({success: false, method: "put", message: e.message})

    }
})

module.exports = router