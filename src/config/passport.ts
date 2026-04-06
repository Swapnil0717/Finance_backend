import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import prisma from "./prisma";
import { env } from "./env";
import { Role } from "@prisma/client";

// GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"), false);
        }

        // FIND EXISTING USER
        let user = await prisma.user.findUnique({
          where: { email },
        });

        // CREATE USER IF NOT EXISTS
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || "Google User",
              isEmailVerified: true,
              role: Role.VIEWER,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, false);
      }
    }
  )
);

// SERIALIZE USER
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// DESERIALIZE USER
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;