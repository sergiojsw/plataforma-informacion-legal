import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Información Legal Actualizada con IA
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Accede a legislación chilena, jurisprudencia, doctrina y consulta
                con nuestro asistente jurídico inteligente.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/biblioteca"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Explorar Biblioteca
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600"
                alt="Justicia"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Funcionalidades Principales
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon="📚"
              title="Biblioteca Jurídica"
              description="Acceso a legislación, jurisprudencia, doctrina y prácticas jurídicas actualizadas."
              href="/biblioteca"
            />
            <FeatureCard
              icon="🔍"
              title="Buscador Inteligente"
              description="Encuentra documentos legales por palabras clave, categoría o contenido."
              href="/buscador"
            />
            <FeatureCard
              icon="🤖"
              title="Chat con IA"
              description="Consulta dudas legales con nuestro asistente jurídico impulsado por IA."
              href="/chat"
            />
            <FeatureCard
              icon="📬"
              title="Boletín Legal"
              description="Recibe novedades legales diarias y resúmenes semanales en tu correo."
              href="/boletin"
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Prueba la Plataforma
          </h2>
          <p className="text-gray-600 mb-8">
            Accede con las cuentas de demostración para explorar todas las funcionalidades
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="font-semibold text-gray-800 mb-2">Usuario Demo</h3>
              <p className="text-sm text-gray-500 mb-3">Acceso a biblioteca, buscador y chat</p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p><strong>Email:</strong> usuario@legal.cl</p>
                <p><strong>Clave:</strong> usuario123</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-500">
              <div className="text-3xl mb-3">👑</div>
              <h3 className="font-semibold text-gray-800 mb-2">Administrador</h3>
              <p className="text-sm text-gray-500 mb-3">Acceso completo + panel de admin</p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p><strong>Email:</strong> admin@legal.cl</p>
                <p><strong>Clave:</strong> admin123</p>
              </div>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-block mt-8 bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Probar Ahora
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="1000+" label="Documentos Legales" />
            <StatCard number="24/7" label="Disponibilidad" />
            <StatCard number="IA" label="Asistente Inteligente" />
            <StatCard number="100%" label="Actualizado" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">LegalIA</h4>
              <p className="text-sm">
                Plataforma de información jurídica actualizada con inteligencia artificial.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Secciones</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/biblioteca" className="hover:text-white transition-colors">Biblioteca</Link></li>
                <li><Link href="/buscador" className="hover:text-white transition-colors">Buscador</Link></li>
                <li><Link href="/chat" className="hover:text-white transition-colors">Chat IA</Link></li>
                <li><Link href="/boletin" className="hover:text-white transition-colors">Boletín</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Acceso</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-white transition-colors">Iniciar Sesión</Link></li>
                <li><Link href="/registro" className="hover:text-white transition-colors">Registrarse</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Administración</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <p className="text-sm">Dirección Jurídica Municipal</p>
              <p className="text-sm mt-2">juridica@municipalidad.cl</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>© 2026 LegalIA - Plataforma de Información Legal</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, href }: { icon: string; title: string; description: string; href: string }) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all cursor-pointer h-full">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <p className="text-blue-600 text-sm mt-4 font-medium">Acceder →</p>
      </div>
    </Link>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-blue-200">{label}</div>
    </div>
  )
}
