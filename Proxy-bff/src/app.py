import os
import logging
from datetime import timedelta
from flask_cors import CORS
from flask import Flask, send_from_directory, session
# carrega o arquivo .env, variáveis de ambiente
from settings import PROXY_PORT, PROXY_DEBUG, TEMPO_SESSION, FRONTEND_URL

from funcoes import Funcoes

# blueprints
from mod_funcionario.funcionario import bp_funcionario

# Configuração básica de logging
logging.basicConfig(level=logging.INFO)

# Aplicação Flask
app = Flask(__name__)

# Habilita CORS para permitir requisições do frontend React
CORS(app, resources={r"/api/*": {"origins": f"{FRONTEND_URL}"}})

# Flask não serve automaticamente o favicon, então você precisa criar uma rota para ele
# Crie um arquivo favicon.ico na pasta static
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        directory='static',
        path='favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )

# rota somente para teste de comunicação com a API e geração do token
# não é utilizada na aplicação, mas pode ser útil para verificar se a API está acessível
@app.route('/api/teste_token', methods=['POST'])
def teste_token():
    return Funcoes.get_api_token()

# Gerando uma chave randômica para secret_key
app.secret_key = os.urandom(12).hex()

# Configuração do tempo de expiração da sessão (em minutos), o padrão é 31 dias
app.permanent_session_lifetime = timedelta(minutes=int(TEMPO_SESSION))

# Configuração do SameSite para cookies
app.config['SESSION_COOKIE_SAMESITE'] = 'None'

# Configuração para enviar cookies apenas em conexões HTTPS
app.config['SESSION_COOKIE_SECURE'] = True

# O decorador @app.before_request é chamado antes de cada requisição
@app.before_request
def before_request():
    # Renovar o tempo da sessão automaticamente conforme o usuário interage com a aplicação
    session.permanent = True

# registra as rotas dos blueprints
app.register_blueprint(bp_funcionario)

# Ponto de entrada para execução
if __name__ == '__main__':
    logging.info(f"Iniciando o servidor Flask na porta: {PROXY_PORT}")
    # Roda o servidor Flask em modo de debug (recarrega automaticamente e mostra mais erros)
    # Desative o debug em produção!
    app.run(host='0.0.0.0', port=PROXY_PORT, debug=PROXY_DEBUG, use_reloader=PROXY_DEBUG)
