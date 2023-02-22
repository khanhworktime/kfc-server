const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express")

const router = express.Router()

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await prisma.user.findFirstOrThrow({where: {email: email}})
        if (user.password === password) {
            return res.status(200).json({success: true, uid: user.id})
        }
        return res.status(401).json({success: false, message: "Wrong password or username"})
    }
    catch(e){
        return res.status(500).json({success:false, message: e.message})
    }
})

module.exports = router