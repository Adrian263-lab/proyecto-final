export default function Footer() {
    return (
        <footer className="bg-white border-top py-4 mt-auto">
            <div className="container text-center">
                <h5 className="text-huellitas fw-bold mb-1">🐾 Huellitas</h5>
                <p className="text-muted small mb-2">Plataforma de Adopción Responsable</p>
                <div className="mb-3">
                    <a href="#" className="text-muted mx-2 small text-decoration-none">Privacidad</a>
                    <a href="#" className="text-muted mx-2 small text-decoration-none">Contacto</a>
                </div>
                <p className="text-muted mb-0" style={{fontSize: '0.8rem'}}>
                    © {new Date().getFullYear()} - Elda Protect. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}