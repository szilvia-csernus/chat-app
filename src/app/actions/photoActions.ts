"use server";

import { prisma } from "@/prisma";
import { auth } from "@/auth";
import {
  photoSchema,
} from "@/lib/schemas/completeProfileSchema";
import { cloudinary } from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";


async function getPhotoByUserIdFn(userId: string) {
  return prisma.photo.findFirst({
    where: { userId },
  });
}

export const getPhotoByUserId = nextCache(
  async (userId: string) => await getPhotoByUserIdFn(userId),
  ["user-photo"],
  { tags: ["user-photo"] }
);

export async function addPhotoToDatabase(
  imageUrl: string,
  cloudinaryImageId: string
) {
  const session = await auth();

  console.log(imageUrl, cloudinaryImageId);
  if (!session?.user) return { status: "error", error: "User not found" };

  try {
    // Safe parse and validate data with Zod
    const validated = photoSchema.safeParse({ imageUrl, cloudinaryImageId });
    if (!validated.success) {
      console.log(validated.error);
      return { status: "error", error: "Invalid data" };
    }
    const userId = session.user.id as string;
    const userOldPhoto = await prisma.photo.findFirst({
      where: { userId },
    });

    if (userOldPhoto) {
      // Delete the previous image from Cloudinary
      await deleteImageFromCloudinary(userOldPhoto.cloudinaryImageId);

      const result = await prisma.photo.update({
        where: { userId: userOldPhoto.userId },
        data: {
          cloudinaryImageId,
          imageUrl,
        },
      });
      await prisma.user.update({
        where: { id: result.userId },
        data: {
          image: imageUrl,
        },
      });
    } else {
      await prisma.photo.create({
        data: {
          cloudinaryImageId,
          imageUrl,
          user: {
            connect: {
              id: userId,
              image: imageUrl,
            },
          },
        },
      });
    }

    revalidateTag("user-photo");
    revalidateTag("members");

    return { status: "success", data: "Photo saved successfully." };
  } catch (error) {
    console.error(error);
    return { status: "error", error: "Error uploading image" };
  }
}

export async function uploadImageToCloudinaryFromUrl(
  imageUrl: string
): Promise<UploadApiResponse> {
  const result = await cloudinary.v2.uploader.upload(imageUrl);
  console.log(result);
  return result;
}

export async function deleteImageFromCloudinary(cloudinaryImageId: string) {
  try {
    await cloudinary.v2.uploader.destroy(cloudinaryImageId);
  } catch (error) {
    console.error(
      `Error deleting ${cloudinaryImageId} from Cloudinary. Error: ${error}`
    );
  }
}

export async function deletePhotoFromDatabase(cloudinaryImageId: string) {
  try {
    const result = await prisma.photo.delete({
      where: { cloudinaryImageId },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });


    await prisma.user.update({
      where: { id: result.userId },
      data: {
        image: null,
      },
    })
    revalidateTag("user-photo");
    revalidateTag("members");
  } catch (error) {
    console.error(
      `Error deleting ${cloudinaryImageId} from database. Error: ${error}`
    );
  }
}
