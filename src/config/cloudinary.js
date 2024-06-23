import cloudinary from "cloudinary";
cloudinary.config({
  cloud_name: "finalniichacafe",
  api_key: "176555824346398",
  api_secret: "O3krc3EEm548AwZC-NUZnpp2Sag",
});

export const UploadToCloudinary = async (files, oldImage) => {
  try {
    if (oldImage) {
      const spliturl = oldImage.split("/");
      const img_id = spliturl[spliturl.length - 1].split(".")[0];
      await cloudinary.uploader.destroy(img_id);
    }
    const base64 = files.toString("base64");
    const imgPath = `data:image/jpeg;base64,${base64}`;
    const cloudinaryUpload = await cloudinary.uploader.upload(imgPath, {
      public_id: `IMG_${Date.now()}`,
      resource_type: "auto",
    });
    return cloudinaryUpload.url;
  } catch (error) {
    console.log(error);
    return ""
  }
};
