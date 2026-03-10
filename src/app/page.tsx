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
                  href="/buscador"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Explorar
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
            />
            <FeatureCard
              icon="🔍"
              title="Buscador Inteligente"
              description="Encuentra documentos legales por palabras clave, categoría o contenido."
            />
            <FeatureCard
              icon="🤖"
              title="Chat con IA"
              description="Consulta dudas legales con nuestro asistente jurídico impulsado por IA."
            />
            <FeatureCard
              icon="📬"
              title="Boletín Legal"
              description="Recibe novedades legales diarias y resúmenes semanales en tu correo."
            />
          </div>
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
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 LegalIA - Plataforma de Información Legal</p>
          <p className="text-sm mt-2">Dirección Jurídica Municipal</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
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
