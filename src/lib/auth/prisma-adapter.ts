import { Adapter } from 'next-auth/adapters';

import { prisma } from '../prisma';

export function PrismaAdapter(): Adapter {
  return {
    async createUser(user) {},

    async getUser(id) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id },
      });

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      };
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { email },
      });

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const { user } = await prisma.account.findUniqueOrThrow({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      });

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      };
    },

    async updateUser(user) {
      const userUpdated = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      });

      return {
        id: userUpdated.id,
        name: userUpdated.name,
        username: userUpdated.username,
        email: userUpdated.email!,
        emailVerified: null,
        avatar_url: userUpdated.avatar_url!,
      };
    },

    async deleteUser(userId) {
      await prisma.user.delete({
        where: { id: userId },
      });
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refreshToken,
          access_token: account.accessToken,
          expires_at: account.accessTokenExpires,
          token_type: account.tokenType,
          scope: account.scope,
          id_token: account.idToken,
          session_state: account.sessionState,
        },
      });
    },

    async unlinkAccount({ providerAccountId, provider }) {},

    async createSession({ sessionToken, userId, expires }) {},

    async getSessionAndUser(sessionToken) {},

    async updateSession({ sessionToken }) {},

    async deleteSession(sessionToken) {},

    async createVerificationToken({ identifier, expires, token }) {},

    async useVerificationToken({ identifier, token }) {},
  };
}
