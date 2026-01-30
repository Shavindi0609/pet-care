export const uploadImageToCloudinary = async (imageUri: string) => {
  const cloudName = "dm4qd5n2c"; // Cloudinary Dashboard එකෙන් ගන්න
  const uploadPreset = "pet_care_upload"; // Settings -> Upload -> Unsigned upload preset

  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "product.jpg",
  } as any);
  data.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const result = await response.json();
    return result.secure_url; // රූපයේ URL එක
  } catch (error) {
    console.error("Cloudinary Upload Error: ", error);
    return null;
  }
};