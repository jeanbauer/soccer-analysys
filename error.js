const errorMessageBuilder = (code, message) => ({
  errorCode: code,
  errorDescription: message
})

exports.serverUnavailable = errorMessageBuilder(2, "Servidor Indisponível");
exports.notFound = errorMessageBuilder(2, "Dados Inexistentes");
