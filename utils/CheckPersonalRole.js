
export default (req, res, next) => {

    if(req.role !== 1)
    {
        next();
    } else {
        console.log(req.role);
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }

}