function isStudent(req, res, next) {

    if (!req.session.student) {
        return res.redirect("/login")
    }

    next()
}

function isAdmin(req, res, next) {

    if (!req.session.admin) {
        return res.redirect("/admin/login")
    }

    next()
}

module.exports = {
    isStudent,
    isAdmin
}