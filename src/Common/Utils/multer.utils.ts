import { BadRequestException } from "@nestjs/common";
import { Request } from "express";
import { diskStorage } from "multer";



interface MulterOptions{
    path?: string,
    allowedFileType: string []
}


export const UploadedFileOptions= (
{path= 'General' , allowedFileType}: MulterOptions
) => {
    const storage =diskStorage({})
        // destination: `uploads/${path}`,
        // filename:(req, file, callback) => {
        //     const filename = `${Date.now()}, ${file.originalname}`
        //     callback(null, filename)
        // } 

    const fileFilter= (req:Request, file:Express.Multer.File, callback: Function) => {
        if(allowedFileType.includes(file.mimetype)) {
            callback (null , true)
        }
        else {
            callback (new BadRequestException ('Invalid File Type'), false)
        }
    }

    return {
        fileFilter,
        storage
    }
}