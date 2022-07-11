const handleApiError = (e, message, next, code = 500) => {
    e.code = code
    e.originalMessage = e.message
    e.message = message
    next(e)
}

module.exports = {handleApiError}