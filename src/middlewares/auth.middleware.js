// Check if the current session has username and role
export const auth = (req, res, next) => {
    if(req.session.user){
        return next()
    }

    // Return to an error view
    return res.status(401).render('error', {req})
}