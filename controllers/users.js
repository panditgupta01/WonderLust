const User = require("../models/user.js");

module.exports.renderUserSignup = (req, res) => {
    res.render("./users/signup");
}

module.exports.userSignup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderUserlogin = (req, res) => {
    res.render("./users/login");
}

module.exports.userLogin = (req, res) => {
    req.flash("success", "Welcome to wonderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.userLogout = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Logout Successfull");
        res.redirect("/listings");
    });
}
