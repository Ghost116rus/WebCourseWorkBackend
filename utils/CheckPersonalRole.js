
export default (req, res, next) => {
    if(req.role !== 1)
    {
        next();
    } else {
        return res.status(403).json({
            msg: 'Нет доступа',
        });
    }

}