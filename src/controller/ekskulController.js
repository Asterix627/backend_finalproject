const prisma = require("../../prisma/client/index")
const uploadImage = require("../services/uploadImage")
const cloudinary = require("cloudinary").v2

const addEkskul = async(req, res, next) => {
    const {extraName, catagory, shortDesc, fullDesc, meetingDays, coach, location, contactInfo} = req.body
    const images = req.files
    const addImages = []
    let createEkskul
    let createImage

    try{
        createEkskul = await prisma.ekskul.create({
            data : {
                extraName : extraName,
                catagory : catagory,
                shortDesc : shortDesc,
                fullDesc : fullDesc,
                meetingDays : meetingDays,
                coach : coach,
                location : location,
                contactInfo : contactInfo
            }
        })

        if(images && images.length > 0){
            for(const image of images){
                const imgUrl = await uploadImage(image)
                createImage = await prisma.image.create({
                    data : {
                        imageName : image.originalname,
                        imageUrl : imgUrl,
                        ekskulId : createEkskul.id
                    }
                })
                addImages.push(createImage)
            }
        }

        res.status(201).json({
            message : "Ekskul created successfully",
            data : {
                ekskul : createEkskul,
                images : addImages.map(img => img.imageUrl)
            }
        })
    }catch(err){
        if(createEkskul){
            await prisma.ekskul.delete({
                where : {
                    id : createEkskul.id
                }
            })

            if(addImages && addImages.length > 0){
                for(const image of addImages){
                    const publicId = image.imageUrl.split("/").pop().split(".")[0]
                    await cloudinary.uploader.destroy(publicId)
                }
            }

            await prisma.ekskul.delete({
                where : {
                    id : createImage.id
                }
            })
            res.status(400).json({
                error : "Add ekskul failed",
                detail : err.message
            })
        }
        next(err)
    }
}

const getAllEkskul = async(req, res) => {
    try{
        const ekskul = await prisma.ekskul.findMany({
            select : {
                id : true,
                extraName : true,
                catagory : true,
                shortDesc : true,
                meetingDays : true,
                coach : true
            }
        })
        res.status(200).json({
            message : "Get ekskul data success",
            data : ekskul
        })
    }catch(err){
        res.status(500).json({
            error : "Failed to get ekskuls",
            detail : err.message
        })
    }
}

const getEkskulById = async(req, res, next) => {
    try{
        const ekskul = await prisma.ekskul.findUnique({
            where : {id : req.params.id},
            include : {
                images : {
                    select : {
                        imageUrl : true
                    }
                }
            }
        })

        if(!ekskul){
            return res.status(404).json({
                message : "Ekskul Not Found"
            })
        }

        res.status(200).json({
            message : "Get Ekskul Success",
            data : ekskul
        })
    }catch(err){
        next(err)
    }
}

const updateEkskul = async(req, res, next) => {
    const {extraName, catagory, shortDesc, fullDesc, meetingDays, coach, location, contactInfo} = req.body
    const id = req.params.id
    const images = req.files
    const imagesUpdate = []

    try {
        const currentEkskul = await prisma.ekskul.findUnique({
            where : {id},
            include : {
                images : true
            }
        })

        if(!currentEkskul){
            return res.status(404).json({
                message : "Ekskul Not Found"
            })
        }

        if(images){
            if(currentEkskul.images.length > 0){
                for(const image of currentEkskul.images){
                    const publicId = image.imageUrl.split("/").pop().split(".")[0]
                    await cloudinary.uploader.destroy(publicId)
                }
            }

            await prisma.image.deleteMany({
                where : {ekskulId : id}
            })
        }

        const newEkskul = await prisma.ekskul.update({
            where : {id},
            data : {
                extraName : extraName,
                catagory : catagory,
                shortDesc : shortDesc,
                fullDesc : fullDesc,
                meetingDays : meetingDays,
                coach : coach,
                location : location,
                contactInfo : contactInfo
            }
        })

        if(images && images.length > 0){
            for(const image of images){
                const imgUrl = await uploadImage(image)
                const updateImage = await prisma.image.create({
                    data : {
                        imageName : image.originalname,
                        imageUrl : imgUrl,
                        ekskulId : newEkskul.id
                    }
                })
                imagesUpdate.push(updateImage)
            }
        }

        res.status(200).json({
            message : "Eskul updated successfully",
            data : {
                ekskul : newEkskul,
                images : imagesUpdate.map(img => img.imageUrl)
            }
        })
    } catch(err){
        next(err)
    }
}

const deleteEkskul = async(req, res, next) => {
    const id = req.params.id
    try{
        const currentEkskul = await prisma.ekskul.findUnique({
            where : {id},
            include : {
                images : true
            }
        })

        if(!currentEkskul){
            return res.status(404).json({
                message : "Ekskul Not Found"
            })
        }

        for(const image of currentEkskul.images){
            const publicId = image.imageUrl.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(publicId)
        }

        await prisma.image.deleteMany({
            where : {ekskulId : id}
        })

        await prisma.ekskul.delete({
            where : {id}
        })

        res.status(200).json({
            message : "Ekskul Deleted Successfully"
        })
    }catch(err){
        next(err)
    }
}

module.exports = {addEkskul, getAllEkskul, getEkskulById, updateEkskul, deleteEkskul}