import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "./app.config";
import { NotFoundException } from "@/utils/ApiError";
import { ProviderEnum } from "@/enums/account-provider.enum";
import {
  loginOrCreateAccountService,
  verifyUserService,
} from "@/services/auth.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;
        console.log("profile", profile._json);
        console.log("googleId", googleId);

        if (!googleId) {
          throw new NotFoundException("Google ID (sub) is missing.");
        }

        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture,
          email,
        });

        return done(null, user as any);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
    },
    async (email, password, done) => {
      try {
        const user = await verifyUserService({ email, password });

        return done(null, user as any);
      } catch (err: any) {
        return done(err, false, {
          message: err?.message,
        });
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user._id || user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const UserModel = (await import("@/models/user.model")).default;
    const user = await UserModel.findById(id);

    if (!user) {
      return done(new NotFoundException("User not found"), null);
    }

    done(null, user as any);
  } catch (err) {
    done(err, null);
  }
});
