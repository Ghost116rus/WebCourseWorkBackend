
export default (req, res, next) => {

    if(req.role === 0)
    {
        next();
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }

}