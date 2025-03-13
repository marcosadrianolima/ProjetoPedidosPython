from fastapi import FastAPI
from settings import HOST, PORT, RELOAD
import uvicorn

# Import das classes com as rotas/endpoints
from app import FuncionarioDAO, ClienteDAO, ProdutoDAO
from contextlib import asynccontextmanager

import security


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Executa no startup
    print("API has started")

    # Cria, caso não existam, as tabelas de todos os modelos importados na aplicação
    import db
    await db.criaTabelas()

    yield

    # Executa no shutdown
    print("API is shutting down")


# Cria a aplicação FastAPI com o contexto de vida
app = FastAPI(lifespan=lifespan)


# Rota padrão
@app.get("/")
async def root():
    return {
        "detail": "API Comandas",
        "Swagger UI": "http://127.0.0.1:8000/docs",
        "ReDoc": "http://127.0.0.1:8000/redoc"
    }


# Mapeamento das rotas/endpoints
app.include_router(security.router)
app.include_router(FuncionarioDAO.router)
app.include_router(ClienteDAO.router)
app.include_router(ProdutoDAO.router)


if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=int(PORT), reload=RELOAD)
