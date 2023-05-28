
export default (req, res, next) => {

    if(req.role === 1)
    {
        next();
    } else {
        console.log(req.role);
        return res.status(403).json({
            msg: 'У персонала нет возможности взять физическую версию книги',
        });
    }

}