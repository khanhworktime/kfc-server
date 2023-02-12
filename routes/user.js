const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express")

const router = express.Router()

const prisma = new PrismaClient();


// Get a specific user
router.get('/?id=:id', async (req, res) => {
    const {id} = req.params
    console.log(id)
    try{

        // Find user
        const user = await prisma.user.findFirst({
            where: {id: id}
        })

        //Not found
        if (user===null) throw new Error('No user found')

        return res.json({success: true, user: user})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})

// Get all users
router.get('/', async (req, res)=>{
    try{

        // Find user
        const user = await prisma.user.findMany()

        return res.json({success: true, users: user})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})



//Create a user
router.post('/', async (req, res) => {
    const {name, username, email, password, role} = req.body
    try{
        // Create a new user
        let newUser = {
            name, username, email, password, role
        }
        // Query this
        const queryRes = await prisma.user.create({data: newUser})

        return res.json({success: true, user: queryRes})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})

//Update user infomation
router.put('/?id=:id', async (req, res) => {
    const {name, username, email, password, role} = req.body
    const {id} = req.params
    try{

        //TODO Normal account can update their name, password. Only admin account can update user's role
        const queryRes = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                name: name ? name : undefined, password, role
            }
        })

        return res.json({success: true, user: queryRes})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})

//Delete user
router.delete('/:id', async (req, res) => {
    const {uid} = req.params
    try{
        //TODO Only admin account can delete a user
        const queryRes = await prisma.user.delete({
            where: {
                id: uid
            }
        })

        return res.json({success: true, user: queryRes})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})


module.exports = router