import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { Strategy } from "passport-42";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { AuthService } from "../auth.services";

/**
 * `Strategy` constructor.
 *
 * The 42 authentication strategy authenticates requests by delegating to 42
 * using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your 42 application's UID
 *   - `clientSecret`  your 42 application's SECRET
 *   - `callbackURL`   URL to which 42 will redirect the user after granting
 *                     authorization
 *   — `userAgent`     User Agent string used in all API requests. e.g: domain
 *                     name of your application.
 *   — `profileFields` Object specifying fields to include in the user profile.
 *
 * Examples:
 *
 *     passport.use(new FortyTwoStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/42/callback'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 **/

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    @InjectRepository(UsersService)
    private usersRepository: Repository<User>,
    private authService: AuthService
  ) {
    console.log(process.env);
    super({
      // a remplacer avec les variables d'env
      clientID:
        "219b4f87732a059d270fe71c699bad22dcd750d27d82c5086a0f12044c1f263d",
      clientSecret:
        "44d49e2767bda2d40994b9a453b92c0356eb540c2f94a6ce5499289839e0c330",
      // clientID: process.env['FORTYTWO_ID'],
      // clientSecret: process.env['FORTYTWO_SECRET'],
      callbackURL: "https://trans.nabentay.fr:4500/login",
    });
  }
  async validate(accessToken, refreshToken, profile) {
    this.authService.handleFortyTwo(profile._json);
    return profile;
  }
}
