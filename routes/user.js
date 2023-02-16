const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express")

const router = express.Router()

const prisma = new PrismaClient();


// Get a specific user
router.get('/:id', async (req, res) => {
    const {id} = req.params
    try{

        // Find user
        const user = await prisma.user.findFirst({
            where: {id: id}
        })

        if (user === null) return res.status(404).json({success: false, message: `User does not exist`})

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
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
                return res.status(404).json({success: false, message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
        }

    }
})

//Update user infomation
router.put('/:id', async (req, res) => {
    const {name, email, role} = req.body
    const {id} = req.params
    const currentId = req.header["userId"]
    try{

        // Normal account can update their name, password. Only admin account can update user's role
        const currentUser = await prisma.user.findFirst({where: {id: currentId}})
        if (role && currentUser.role !== "admin") return 
        const queryRes = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                name: name ? name : undefined,
                email: email ? email: undefined,
                role: role ? role : undefined
            }
        })

        return res.json({success: true, user: queryRes})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})

//Delete user
//Wanted req : { header: {userId: ""}} , url has a id param (target)
router.delete('/:id', async (req, res) => {
    const currentuid = req.header("userId")
    console.log(currentuid)
    const {id} = req.params
    try{
        const currenUser = await prisma.user.findFirst({
            where: {id: currentuid}
        })

        if (currentUser && currenUser.role !==  "admin") throw new Error("Current user is not admin")

        const queryRes = await prisma.user.delete({
            where: {
                id: id
            }
        })

        console.log(queryRes)

        return res.json({success: true, user: queryRes})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})


module.exports = router