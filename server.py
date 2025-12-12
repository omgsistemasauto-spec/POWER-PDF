import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 5500

# Detecta se está rodando como executável PyInstaller
if getattr(sys, 'frozen', False):
    # Rodando como executável
    BASE_DIR = sys._MEIPASS
else:
    # Rodando como script Python
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    
    def log_message(self, format, *args):
        print(f"🌐 {self.address_string()} - {format % args}")

def main():
    # Muda para o diretório correto
    os.chdir(BASE_DIR)
    
    Handler = MyHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print("🚀 SERVIDOR INICIADO!")
            print(f"📡 Rodando em: http://localhost:{PORT}")
            print(f"📁 Diretório: {BASE_DIR}")
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print("\n📄 Arquivos disponíveis:")
            
            # Lista arquivos
            for item in os.listdir(BASE_DIR):
                if os.path.isfile(os.path.join(BASE_DIR, item)):
                    print(f"   • {item}")
                elif os.path.isdir(os.path.join(BASE_DIR, item)):
                    print(f"   📁 {item}/")
            
            print("\n✅ Pressione Ctrl+C para parar\n")
            
            # Abrir navegador
            webbrowser.open(f'http://localhost:{PORT}')
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Servidor encerrado!")
        sys.exit(0)
    except OSError as e:
        if e.errno == 10048 or e.errno == 98:  # Porta em uso
            print(f"❌ Erro: Porta {PORT} já está em uso!")
            print("   Feche outros programas usando essa porta.")
        else:
            print(f"❌ Erro: {e}")
        input("\nPressione Enter para sair...")
        sys.exit(1)

if __name__ == "__main__":
    main()