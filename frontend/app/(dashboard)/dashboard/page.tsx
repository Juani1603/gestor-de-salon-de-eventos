export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido al sistema de gestión</p>
      </div>

      {/* Grid de prueba */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de prueba 1 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Próximo Evento
          </h3>
          <p className="text-gray-600">Cargando...</p>
        </div>

        {/* Card de prueba 2 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Próxima Reunión
          </h3>
          <p className="text-gray-600">Cargando...</p>
        </div>

        {/* Card de prueba 3 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Estadísticas
          </h3>
          <p className="text-gray-600">Este mes</p>
        </div>
      </div>

      {/* Calendario placeholder */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Calendario del Mes
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded-xl">
          <p className="text-gray-500">Calendario próximamente...</p>
        </div>
      </div>
    </div>
  );
}