const get404 = async (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Not Found', path: '/404' });
}

export { get404 }