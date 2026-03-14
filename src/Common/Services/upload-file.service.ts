import { Injectable } from "@nestjs/common";
import { CloudinaryConfig } from "../Config";
import { UploadApiOptions } from "cloudinary";


type CloudImage = {
  secure_url: string
  public_id: string
}


@Injectable()
export class UploadCloudFileService{
    private cloudinary = CloudinaryConfig()


    async uploadfile(file: string , options?: UploadApiOptions) {
        const data = await this.cloudinary.uploader.upload(file, options)
        return {secure_url:data.secure_url , public_id: data.public_id}
    }

    async uploadfiles(files: string[], options?:UploadApiOptions) {
        const images: CloudImage[] = []
        // const images: { secure_url: string; public_id: string }[] = [];
        for (const path of files) {
            const data = await this.uploadfile(path, options)
            images.push({secure_url:data.secure_url , public_id: data.public_id})
        }
        return images 
    }

    async deleteFileByPublicId(public_id){
        return await this.cloudinary.uploader.destroy(public_id)
    }

    async deleteFolderByPrefix(prefix:string){
        await this.cloudinary.api.delete_resources_by_prefix(prefix)
        await this.cloudinary.api.delete_folder(prefix)
    }
}