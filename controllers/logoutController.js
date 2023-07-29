const User = require("../model/User");

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    console.log(JSON.stringify(cookies))
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    console.log(refreshToken)

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken: { $in: [refreshToken] } }).exec();
    if (!foundUser) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
      return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    const result = await foundUser.save()
    console.log("Refresh token cleared from the database:", result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }
