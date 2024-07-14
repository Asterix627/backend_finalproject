const prisma = require("../../prisma/client/index");
const uploadImage = require("../services/uploadImage");
const cloudinary = require("cloudinary").v2;
const idGenerator = require("../utils/idGenerator");

const addEkskul = async (req, res, next) => {
    const {
        extraName,
        catagory,
        shortDesc,
        fullDesc,
        meetingDays,
        coach,
        location,
        contactInfo,
    } = req.body;
    const images = req.files;
    let createEkskul;
    let createImage;
    let addImages = [];

    try {
        createEkskul = await prisma.ekskul.create({
            data: {
                extraName: extraName,
                catagory: catagory,
                shortDesc: shortDesc,
                fullDesc: fullDesc,
                meetingDays: meetingDays,
                coach: coach,
                location: location,
                contactInfo: contactInfo,
            },
        });
        for (const image of images) {
            const imageId = idGenerator("IMG");
            const imgUrl = await uploadImage(image);
            const createImage = await prisma.image.create({
                data: {
                    id: imageId,
                    imageName: image.originalname,
                    imageUrl: imgUrl,
                    ekskulId: createEkskul.id,
                },
            });
            addImages.push(createImage);
        }

        res.status(201).json({
            message: "Ekskul created successfully",
            success : true,
            data: {
                ekskul: createEkskul,
                images: addImages.map((img) => img.imageUrl),
            },
        });
    } catch (err) {
        console.error("Error uploading image:", err);
        if (createEkskul) {
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

            await prisma.image.deleteMany({
                where : {
                    ekskulId : createEkskul.id
                }
            })
            
            res.status(400).json({
                error: "Add ekskul failed",
                detail: err.message,
            });
        }
        next(err);
    }
};

const getAllEkskul = async (req, res) => {
    try {
        const {page, limit} = req.query
        const pageNumber = parseInt(page) || 1
        const pageSizeNumber = parseInt(limit) || 3

        const ekskul = await prisma.ekskul.findMany({
            include: {
                images: {
                    select : {
                        imageUrl : true
                    }
                }
            },
            skip: (pageNumber - 1) * pageSizeNumber,
            take: pageSizeNumber, 
            orderBy: {
                extraName: "asc"
            }
        });

        const ekskulTotal = await prisma.ekskul.count()
        const paginationMetaData = {
            page : pageNumber,
            ekskulTotal,
            limit : pageSizeNumber
        }

        res.status(200).json({
            success: true,
            message: "Get ekskul data success",
            data: ekskul,
            paginationMetaData
        });
        
    } catch (err) {
        res.status(500).json({
            error: "Failed to get ekskuls",
            detail: err.message,
        });
    }
};

const getEkskulById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ekskulId = parseInt(id, 10);

        const ekskul = await prisma.ekskul.findUnique({
            where: { id: ekskulId },
            include: {
                images: true,
            },
        });

        console.log(ekskul);

        if (!ekskul) {
            return res.status(404).json({
                message: "Ekskul Not Found",
            });
        }

        const imageUrl = ekskul.images.map((images) => images.imageUrl);

        res.status(200).json({
            success: true,
            message: "Get Ekskul Success",
            data: {
                ...ekskul,
                images: imageUrl,
            },
        });
    } catch (err) {
        next(err);
    }
};

const updateEkskul = async (req, res, next) => {
    const {
        extraName,
        catagory,
        shortDesc,
        fullDesc,
        meetingDays,
        coach,
        location,
        contactInfo,
    } = req.body;
    const id = req.params.id;
    const ekskulId = parseInt(id, 10);
    const images = req.files;
    const imagesUpdate = [];

    try {
        const currentEkskul = await prisma.ekskul.findUnique({
            where: { id: ekskulId },
            include: {
                images: true,
            },
        });

        if (!currentEkskul) {
            return res.status(404).json({
                message: "Ekskul Not Found",
            });
        }

        if (images) {
            if (currentEkskul.images.length > 0) {
                for (const image of currentEkskul.images) {
                    const publicId = image.imageUrl
                        .split("/")
                        .pop()
                        .split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            await prisma.image.deleteMany({
                where: { ekskulId: ekskulId },
            });
        }

        const newEkskul = await prisma.ekskul.update({
            where: { id: ekskulId },
            data: {
                extraName: extraName,
                catagory: catagory,
                shortDesc: shortDesc,
                fullDesc: fullDesc,
                meetingDays: meetingDays,
                coach: coach,
                location: location,
                contactInfo: contactInfo,
            },
        });

        if (images && images.length > 0) {
            for (const image of images) {
                const imageId = idGenerator("IMG");
                const imageUrl = await uploadImage(image);
                const updateImage = await prisma.image.create({
                    data: {
                        id: imageId,
                        imageName: image.originalname,
                        imageUrl: imageUrl,
                        ekskulId: ekskulId,
                    },
                });
                imagesUpdate.push(updateImage);
            }
        }

        res.status(200).json({
            success: true,
            message: "Eskul updated successfully",
            data: {
                ekskul: newEkskul,
                images: imagesUpdate.map((img) => img.imageUrl),
            },
        });
    } catch (err) {
        next(err);
    }
};

const deleteEkskul = async (req, res, next) => {
    const id = req.params.id;
    const ekskulId = parseInt(id, 10);

    try {
        const currentEkskul = await prisma.ekskul.findUnique({
            where: { id: ekskulId },
            include: {
                images: true,
            },
        });

        if (!currentEkskul) {
            return res.status(404).json({
                message: "Ekskul Not Found",
            });
        }

        for (const image of currentEkskul.images) {
            const publicId = image.imageUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await prisma.image.deleteMany({
            where: { ekskulId: ekskulId },
        });

        await prisma.ekskul.delete({
            where: { id: ekskulId },
        });

        res.status(200).json({
            success: true,
            message: "Ekskul Deleted Successfully",
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addEkskul,
    getAllEkskul,
    getEkskulById,
    updateEkskul,
    deleteEkskul,
};
