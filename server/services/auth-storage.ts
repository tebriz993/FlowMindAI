import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { User } from "@shared/schema";

export class AuthStorage {
  async createUserWithVerification(userData: {
    firstName: string;
    lastName: string;
    email: string;
    hashedPassword: string;
    verificationToken: string;
    tokenExpiry: Date;
  }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        hashedPassword: userData.hashedPassword,
        isVerified: false,
        verificationToken: userData.verificationToken,
        tokenExpiry: userData.tokenExpiry,
      })
      .returning();
    return user;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async findUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user;
  }

  async verifyUser(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
        tokenExpiry: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async updateVerificationToken(userId: string, token: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({
        verificationToken: token,
        tokenExpiry: expiry,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async updateUserPassword(email: string, hashedPassword: string) {
    const [updatedUser] = await db
      .update(users)
      .set({ hashedPassword, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning();
    return updatedUser;
  }
}

export const authStorage = new AuthStorage();