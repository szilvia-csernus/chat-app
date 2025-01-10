import { prisma } from "@/prisma";

function getOTPByEmail(email: string) {
  try {
    return prisma.token.findFirst({
      where: {
        email,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function deleteOTP(email: string) {
  try {
    const existingToken = await getOTPByEmail(email);

    if (existingToken) {
      return prisma.token.delete({
        where: {
          id: existingToken.id,
        },
      });
    }
    
  } catch (error) {
    throw error;
  }
}

/** Generate a random, 6-digit number */
function generateSixDigitOTP(): string {
  // Generate a random number between 0 and 999999
  const randomNumber = Math.floor(Math.random() * 1000000);
  // Convert to string and pad with leading zeros if necessary
  return randomNumber.toString().padStart(6, "0");
}


/** Delete token if already exists then create a new one in the database 
 * 
 * @param email - The email address to associate with the token
 * @returns The new token
 * @error Throws an error if the token cannot be created
*/
export async function generateAndStoreOTP(email: string) {
  try {
    // If a token already exists, delete it before creating a new one
    await deleteOTP(email);
      
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    // a random 6 digit number
    const randomToken = generateSixDigitOTP();

    // Store the new token in the database
    return prisma.token.create({
      data: {
        email,
        token: randomToken,
        expires,
      },
    });

  } catch (error) {
    console.error(error);
    throw error;
  }

}


export async function verifyAndDeleteOTP(email: string, token: string) {
  try {
    const existingToken = await getOTPByEmail(email);

    if (existingToken?.token === token) {
      await deleteOTP(email);
      return true;
    } 

    // In all cases, delete the token
    await deleteOTP(email);

    throw new Error("Verification failed");
  } catch (error) {
    throw error;
  }
}

