from cx_Freeze import setup, Executable

setup(
    name="ServidorHTTP",
    version="1.0",
    description="Servidor HTTP Local",
    executables=[Executable("server.py", base=None)]
)