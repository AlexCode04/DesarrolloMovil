import { useState, useEffect, useMemo } from 'react';
import type { User, Paciente, Turno } from '@/types';
import { getPacientes, savePaciente, deletePaciente } from '@/services/pacienteService';
import { getTurnos, saveTurno, deleteTurno } from '@/services/turnoService';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { FormularioPaciente } from '@/components/FormularioPaciente';
import { FormularioTurno } from '@/components/FormularioTurno';
import { TablaPacientes } from '@/components/TablaPacientes';
import { BuscadorPacientes } from '@/components/BuscadorPacientes';
import { TablaTurnos } from '@/components/TablaTurnos';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [pacienteAEditar, setPacienteAEditar] = useState<Paciente | null>(null);
  const [turnoAEditar, setTurnoAEditar] = useState<Turno | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioTurno, setMostrarFormularioTurno] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState<'pacientes' | 'turnos'>('pacientes');

  // JUSTIFICACIÓN: El estado de búsqueda vive en Dashboard (componente padre) porque:
  // 1. Dashboard coordina entre BuscadorPacientes (input) y TablaPacientes (resultados)
  // 2. Evita prop drilling y mantiene una única fuente de verdad para el filtrado
  // 3. Permite compartir la lógica de filtrado con otros componentes si fuera necesario
  // 4. Facilita el testing y mantenimiento al centralizar el estado

  useEffect(() => {
    cargarPacientes();
    cargarTurnos();
  }, []);

  const cargarPacientes = () => {
    setPacientes(getPacientes());
  };

  const cargarTurnos = () => {
    const hoy = new Date().toISOString().split('T')[0];
    setTurnos(getTurnos().filter(t => t.fecha === hoy));
  };

  const handleGuardar = (paciente: Paciente) => {
    savePaciente(paciente);
    cargarPacientes();
    setMostrarFormulario(false);
    setPacienteAEditar(null);
  };

  const handleEditar = (paciente: Paciente) => {
    setPacienteAEditar(paciente);
    setMostrarFormulario(true);
  };

  const handleEliminar = (id: string) => {
    deletePaciente(id);
    cargarPacientes();
  };

  const handleEliminarTurno = (id: string) => {
    deleteTurno(id);
    cargarTurnos();
  };

  const handleCambiarEstadoTurno = (id: string, estado: Turno['estado']) => {
    const turno = turnos.find(t => t.id === id);
    if (turno) {
      saveTurno({ ...turno, estado });
      cargarTurnos();
    }
  };

  const handleNuevoPaciente = () => {
    setPacienteAEditar(null);
    setMostrarFormulario(true);
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setPacienteAEditar(null);
  };

  const handleGuardarTurno = (turno: Turno) => {
    saveTurno(turno);
    cargarTurnos();
    setMostrarFormularioTurno(false);
    setTurnoAEditar(null);
  };

  const handleNuevoTurno = () => {
    setTurnoAEditar(null);
    setMostrarFormularioTurno(true);
  };

  const handleCancelarTurno = () => {
    setMostrarFormularioTurno(false);
    setTurnoAEditar(null);
  };

  const pacientesFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return pacientes;
    }

    const searchLower = busqueda.toLowerCase();
    return pacientes.filter(p =>
      p.nombre.toLowerCase().includes(searchLower) ||
      p.apellido.toLowerCase().includes(searchLower) ||
      p.dni.includes(searchLower)
    );
  }, [pacientes, busqueda]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Bienvenido, {user.nombre} {user.apellido}
        </p>
      </div>

      {user.rol !== 'recepcionista' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pacientes.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Turnos Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{turnos.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {turnos.filter(t => t.estado === 'pendiente').length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setVistaActual('pacientes')}
            className={`px-4 py-2 font-medium transition-colors ${
              vistaActual === 'pacientes'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pacientes
          </button>
          <button
            onClick={() => setVistaActual('turnos')}
            className={`px-4 py-2 font-medium transition-colors ${
              vistaActual === 'turnos'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Turnos del Día
          </button>
        </div>
      </div>

      {vistaActual === 'pacientes' && user.rol !== 'medico' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gestión de Pacientes</CardTitle>
              {!mostrarFormulario && (
                <Button onClick={handleNuevoPaciente}>
                  Nuevo Paciente
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {mostrarFormulario ? (
                <FormularioPaciente
                  pacienteAEditar={pacienteAEditar}
                  onGuardar={handleGuardar}
                  onCancelar={handleCancelar}
                />
              ) : (
                <>
                  <BuscadorPacientes
                    value={busqueda}
                    onChange={setBusqueda}
                  />
                  <TablaPacientes
                    pacientes={pacientesFiltrados}
                    onEditar={handleEditar}
                    onEliminar={handleEliminar}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {vistaActual === 'turnos' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Turnos del Día</CardTitle>
            {!mostrarFormularioTurno && (
              <Button onClick={handleNuevoTurno}>
                Nuevo Turno
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {mostrarFormularioTurno ? (
              <FormularioTurno
                turnoAEditar={turnoAEditar}
                onGuardar={handleGuardarTurno}
                onCancelar={handleCancelarTurno}
              />
            ) : (
              <TablaTurnos
                turnos={turnos}
                onEliminar={handleEliminarTurno}
                onCambiarEstado={handleCambiarEstadoTurno}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
