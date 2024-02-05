import { Router } from "express";

const router = Router()

router
.get('/setcookies', (req, res) => {
    res.cookie('TestCookie', 'this is a cookie', {maxAge: 10000}).send('setting cookie')
})

.get('/getcookies', (req, res) => {
    console.log(req.cookies);
    res.send(req.cookies)
})

.get('/deletecookies', (req, res) =>{

})

.get('/setcookieSigned', (req, res) =>{
    res.cookie('CoderCookie', 'this is a signed cookie', {maxAge: 10000, signed: true}).send('setting cookie')
})

.get('/getcookieSigned', (req, res) =>{

})

.get('/session', (req, res) =>{
    if (req.session.counter){
        req.session.counter++
        res.send(`You visited this session ${req.session.counter} times`)       
    } else {
        req.session.counter = 1
        res.send('Welcome to the test session')
    }
})

.get('/logout', (req, res) =>{
    req.session.destroy(err => {
        if(err) return res.send('Logout error')
        res.send({status: 'success', message: 'Logout successfully'})
    })
})

export default router