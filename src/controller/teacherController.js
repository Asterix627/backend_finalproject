const { PrismaClient } = require('@prisma/client');
const { uploadImage } = require('../services/uploadImage');
const prisma = new PrismaClient();
const cloudinary = require('cloudinary').v2;

const createTeacher = async (req, res, next) => {
  const { fullName, NIP, address, subjects,position } = req.body;
  const image = req.file;

  try {
    const createdTeacher = await prisma.teacher.create({
      data: {
        fullName,
        NIP,
        address,
        subjects,
        position,
      }
    });

    if (image) {
      const imageUrl = await uploadImage(image);
      const createdImage = await prisma.image.create({
        data: {
          imageName: image.originalname,
          imageUrl,
          teacherId: createdTeacher.id
        }
      })
      res.status(201).json
        ({
          success: true,
          message: "Teacher created successfully",
          data: {
            teacher: createdTeacher,
            imageUrl: createdImage.imageUrl,
          }
        });
    }
  } catch (error) {
    if (createdTeacher) {
      await prisma.teacher.delete({
        where: {
          id: createdTeacher.id
        }
      });
      if (imageUrl) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      await prisma.image.delete({
        where: {
          id: createdImage.id
        }
      });
      res.status(400).json({ error: 'Teacher creation failed', details: error.message });
    }
    next(error);
  }
};

const getTeachers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSizeNumber = parseInt(limit) || 10;
    const teachers = await prisma.teacher.findMany({
      orderBy: {
        fullName: 'asc'
      },
      skip: (pageNumber - 1) * pageSizeNumber,
      take: pageSizeNumber
    });

    const totalCount = await prisma.teacher.count();
    const paginationMetadata = {
      page: pageNumber,
      totalCount,
      limit: pageSizeNumber,
    };

    const response = {
      success: true,
      message: "Teachers retrieved successfully",
      data: teachers,
    };
    res.status(200).json
      ({
        data:
          response,
        paginationMetadata
      });
  } catch (error) {
    next(error);
  }
};

const getDetailsTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher retrieved successfully",
      data: {
        teacher: {
          ...teacher,
          images: teacher.images.map(image => image.imageUrl),
        }
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateTeacher = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { fullName, email, NIP, address, subjects } = req.body;
    const image = req.file;

    const curentTeacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!curentTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      })
    }

    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        fullName,
        email,
        NIP,
        address,
        subjects
      }
    });

    let updatedImage;
    if (image) {
      if (curentTeacher.images.length > 0) {
        for (const image of curentTeacher.images) {
          const publicId = image.imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }

        await prisma.image.deleteMany({
          where: { teacherId: id }
        });
      }
      const imageUrl = await uploadImage(image);
      updatedImage = await prisma.image.create({
        data: {
          imageName: image.originalname,
          imageUrl,
          teacherId: updatedTeacher.id
        }
      })
    }

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: {
        teacher: {
          ...updatedTeacher,
          images: updatedImage ? [updatedImage.imageUrl] : []
        }
      }
    })
  } catch (error) {
    next(error)
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    for (const image of teacher.images) {
      const publicId = image.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await prisma.image.deleteMany({
      where: { teacherId: id }
    });

    const deletedTeacher = await prisma.teacher.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
      data: deletedTeacher
    })
  } catch (error) {
    next(error)
  }
};


module.exports = { createTeacher, getTeachers, getDetailsTeacher, updateTeacher, deleteTeacher };